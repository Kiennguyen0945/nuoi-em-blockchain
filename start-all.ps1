$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

function Start-CommandProcess {
    param(
        [string]$Name,
        [string]$FilePath,
        [string[]]$Arguments
    )

    Write-Host "Starting $Name..." -ForegroundColor Cyan
    return Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $projectRoot `
        -PassThru
}

$hardhatProcess = $null
$nextProcess = $null

try {
    Write-Host "Starting PostgreSQL and pgAdmin..." -ForegroundColor Cyan
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose could not start. Make sure Docker Desktop is running and accessible."
    }

    Write-Host "Waiting for PostgreSQL..." -ForegroundColor Yellow
    $postgresReady = $false
    for ($attempt = 1; $attempt -le 30; $attempt++) {
        $health = docker inspect --format='{{.State.Health.Status}}' charity_ledger_postgres 2>$null
        if ($LASTEXITCODE -ne 0) {
            Start-Sleep -Seconds 2
            continue
        }
        if ($health -eq "healthy") {
            $postgresReady = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    if (-not $postgresReady) {
        throw "PostgreSQL did not become healthy within 60 seconds."
    }

    Write-Host "Preparing database and Prisma Client..." -ForegroundColor Cyan
    & npm.cmd run db:generate
    & npm.cmd run db:push

    $chainAlreadyRunning = Test-NetConnection `
        -ComputerName "127.0.0.1" `
        -Port 8545 `
        -InformationLevel Quiet `
        -WarningAction SilentlyContinue
    if ($chainAlreadyRunning) {
        Write-Host "Hardhat is already running on port 8545; reusing it." -ForegroundColor Yellow
    } else {
        $hardhatProcess = Start-CommandProcess `
            -Name "Hardhat local blockchain" `
            -FilePath "node.exe" `
            -Arguments @("node_modules/hardhat/internal/cli/bootstrap.js", "node")
        $chainReady = $false
        for ($attempt = 1; $attempt -le 30; $attempt++) {
            if ($hardhatProcess.HasExited) {
                throw "Hardhat process exited unexpectedly with code $($hardhatProcess.ExitCode)."
            }
            $chainReady = Test-NetConnection `
                -ComputerName "127.0.0.1" `
                -Port 8545 `
                -InformationLevel Quiet `
                -WarningAction SilentlyContinue
            if ($chainReady) {
                break
            }
            Start-Sleep -Seconds 1
        }
        if (-not $chainReady) {
            throw "Hardhat did not start on port 8545 within 30 seconds."
        }
    }

    Write-Host "Deploying CharityLedger contract..." -ForegroundColor Cyan
    $deployErrorAction = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $deployOutput = (& node.exe "node_modules/hardhat/internal/cli/bootstrap.js" run "scripts/deploy-charity-ledger.ts" --network localhost 2>&1 | Out-String)
    $deployExitCode = $LASTEXITCODE
    $ErrorActionPreference = $deployErrorAction
    $deployOutput | Write-Host
    if ($deployExitCode -ne 0) {
        throw "CharityLedger deployment failed with exit code $deployExitCode."
    }
    $contractMatch = [regex]::Match($deployOutput, "CharityLedger deployed at (0x[a-fA-F0-9]{40})")
    if (-not $contractMatch.Success) {
        throw "Could not read the deployed CharityLedger contract address."
    }

    $env:CHARITY_LEDGER_CONTRACT_ADDRESS = $contractMatch.Groups[1].Value
    $env:NEXT_PUBLIC_CHARITY_LEDGER_CONTRACT_ADDRESS = $env:CHARITY_LEDGER_CONTRACT_ADDRESS
    $env:BLOCKCHAIN_RPC_URL = "http://127.0.0.1:8545"

    $nextProcess = Start-CommandProcess `
        -Name "Next.js application" `
        -FilePath "node.exe" `
        -Arguments @("node_modules/next/dist/bin/next", "dev")

    Write-Host "" 
    Write-Host "All project components are running:" -ForegroundColor Green
    Write-Host "  App:     http://localhost:3000"
    Write-Host "  pgAdmin: http://localhost:5050"
    Write-Host "  Chain:   http://127.0.0.1:8545"
    Write-Host "  Contract: $($env:CHARITY_LEDGER_CONTRACT_ADDRESS)"
    Write-Host "" 
    Write-Host "Press Ctrl+C to stop the application and blockchain processes." -ForegroundColor Yellow

    while ($true) {
        if ($nextProcess.HasExited) {
            throw "Next.js process exited unexpectedly with code $($nextProcess.ExitCode)."
        }
        if ($hardhatProcess.HasExited) {
            throw "Hardhat process exited unexpectedly with code $($hardhatProcess.ExitCode)."
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    foreach ($process in @($nextProcess, $hardhatProcess)) {
        if ($null -ne $process -and -not $process.HasExited) {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "Application and blockchain processes stopped. PostgreSQL/pgAdmin remain running." -ForegroundColor DarkGray
}

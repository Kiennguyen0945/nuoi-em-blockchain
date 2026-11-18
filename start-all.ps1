$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

function Invoke-CheckedNpm {
    param([string[]]$Arguments)

    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & npm.cmd @Arguments
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousPreference

    if ($exitCode -ne 0) {
        throw "npm $($Arguments -join ' ') failed with exit code $exitCode."
    }
}

function Start-DirectNodeProcess {
    param(
        [string]$Name,
        [string[]]$Arguments
    )

    Write-Host "Starting $Name..." -ForegroundColor Cyan
    return Start-Process `
        -FilePath "node.exe" `
        -ArgumentList $Arguments `
        -WorkingDirectory $projectRoot `
        -PassThru
}

function Start-HardhatTerminal {
    Write-Host "Opening Hardhat blockchain terminal..." -ForegroundColor Cyan
    $terminalCommand = "Set-Location -LiteralPath '$projectRoot'; Write-Host 'Hardhat local blockchain' -ForegroundColor Green; node.exe node_modules/hardhat/internal/cli/bootstrap.js node"
    return Start-Process `
        -FilePath "powershell.exe" `
        -ArgumentList @("-NoProfile", "-NoExit", "-Command", $terminalCommand) `
        -WorkingDirectory $projectRoot `
        -PassThru
}

function Test-LocalPort {
    param([int]$Port)

    return Test-NetConnection `
        -ComputerName "127.0.0.1" `
        -Port $Port `
        -InformationLevel Quiet `
        -WarningAction SilentlyContinue
}

$hardhatProcess = $null
$nextProcess = $null

try {
    Write-Host "Starting Docker services..." -ForegroundColor Cyan
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose failed. Please start Docker Desktop and try again."
    }

    Write-Host "Waiting for PostgreSQL..." -ForegroundColor Yellow
    $postgresReady = $false
    for ($attempt = 1; $attempt -le 30; $attempt++) {
        $health = docker inspect --format='{{.State.Health.Status}}' charity_ledger_postgres 2>$null
        if ($health -eq "healthy") {
            $postgresReady = $true
            break
        }
        Start-Sleep -Seconds 2
    }
    if (-not $postgresReady) {
        throw "PostgreSQL did not become healthy within 60 seconds."
    }

    Write-Host "Preparing Prisma..." -ForegroundColor Cyan
    Invoke-CheckedNpm -Arguments @("run", "db:generate")
    Invoke-CheckedNpm -Arguments @("run", "db:push")

    if (Test-LocalPort -Port 8545) {
        Write-Host "Hardhat is already running on port 8545; reusing it." -ForegroundColor Yellow
    } else {
        $hardhatProcess = Start-HardhatTerminal

        $chainReady = $false
        for ($attempt = 1; $attempt -le 30; $attempt++) {
            if ($hardhatProcess.HasExited) {
                throw "Hardhat exited unexpectedly with code $($hardhatProcess.ExitCode)."
            }
            if (Test-LocalPort -Port 8545) {
                $chainReady = $true
                break
            }
            Start-Sleep -Seconds 1
        }
        if (-not $chainReady) {
            throw "Hardhat did not start on port 8545 within 30 seconds."
        }
    }

    Write-Host "Deploying CharityLedger..." -ForegroundColor Cyan
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $deployOutput = (& node.exe "node_modules/hardhat/internal/cli/bootstrap.js" run "scripts/deploy-charity-ledger.ts" --network localhost 2>&1 | Out-String)
    $deployExitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousPreference
    $deployOutput | Write-Host

    if ($deployExitCode -ne 0) {
        throw "CharityLedger deployment failed with exit code $deployExitCode."
    }

    $contractMatch = [regex]::Match($deployOutput, "CharityLedger deployed at (0x[a-fA-F0-9]{40})")
    if (-not $contractMatch.Success) {
        throw "Could not read the deployed CharityLedger address."
    }

    $env:CHARITY_LEDGER_CONTRACT_ADDRESS = $contractMatch.Groups[1].Value
    $env:NEXT_PUBLIC_CHARITY_LEDGER_CONTRACT_ADDRESS = $env:CHARITY_LEDGER_CONTRACT_ADDRESS
    $env:BLOCKCHAIN_RPC_URL = "http://127.0.0.1:8545"
    $env:SEPOLIA_RPC_URL = "http://127.0.0.1:8545"

    $nextProcess = Start-DirectNodeProcess `
        -Name "Next.js application" `
        -Arguments @("node_modules/next/dist/bin/next", "dev")

    Write-Host "" 
    Write-Host "All project components are running:" -ForegroundColor Green
    Write-Host "  App:      http://localhost:3000"
    Write-Host "  pgAdmin:  http://localhost:5050"
    Write-Host "  Chain:    http://127.0.0.1:8545"
    Write-Host "  Contract: $($env:CHARITY_LEDGER_CONTRACT_ADDRESS)"
    Write-Host "" 
    Write-Host "Press Ctrl+C to stop Next.js and Hardhat." -ForegroundColor Yellow

    while ($true) {
        if ($nextProcess.HasExited) {
            throw "Next.js exited unexpectedly with code $($nextProcess.ExitCode)."
        }
        if ($null -ne $hardhatProcess -and $hardhatProcess.HasExited) {
            throw "Hardhat exited unexpectedly with code $($hardhatProcess.ExitCode)."
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    foreach ($process in @($nextProcess, $hardhatProcess)) {
        if ($null -ne $process -and -not $process.HasExited) {
            if ($process -eq $hardhatProcess) {
                taskkill.exe /PID $process.Id /T /F 2>$null | Out-Null
            } else {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
    Write-Host "Next.js and Hardhat stopped. Docker services remain running." -ForegroundColor DarkGray
}

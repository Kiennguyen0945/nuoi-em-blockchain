export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
      <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold mb-2">Charity Ledger System</h1>
        <p className="text-slate-600 mb-4">
          Môi trường phát triển đã sẵn sàng.
        </p>
        <ul className="text-sm text-slate-500 space-y-1">
          <li>- Next.js (App Router, TypeScript)</li>
          <li>- Postgres (Docker / Neon) + Prisma</li>
          <li>- Hardhat + Solidity + viem</li>
          <li>- Ghi hash trực tiếp on-chain (Sepolia) + AES-256-GCM</li>
        </ul>
      </div>
    </main>
  );
}


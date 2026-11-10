import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { roleHome } from "@/lib/require-role";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(roleHome(session.user.role));
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
        <h1 className="text-2xl font-bold mb-1 text-teal-800">Charity Ledger System</h1>
        <p className="text-slate-600 mb-6">Sao kê minh bạch quỹ nuôi em — blockchain + VietQR</p>
        <Link
          href="/login"
          className="inline-block bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-6 py-2.5 text-sm font-semibold"
        >
          Đăng nhập theo vai trò
        </Link>
        <p className="text-xs text-slate-400 mt-4">
          Prototype HTML: <a className="underline" href="/prototype.html">/prototype.html</a> · API: /api/records
        </p>
      </div>
    </main>
  );
}

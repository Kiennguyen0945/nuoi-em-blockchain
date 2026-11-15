import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { roleHome } from "@/lib/require-role";
import PublicShell from "@/components/public-shell";
import { getPublicHomeStats, formatVND } from "@/lib/public";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(roleHome(session.user.role));
  }

  const stats = await getPublicHomeStats();

  return (
    <PublicShell>
      {/* Hero cộng đồng */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600"
        />
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-white">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest bg-white/10 border border-white/20 rounded-full px-3 py-1">
            🌱 Cộng đồng nuôi em — sao kê minh bạch
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black leading-tight">
            Mỗi khoản chuyển tới em<br />
            <span className="text-amber-300">đều được theo dõi tới cùng.</span>
          </h1>
          <p className="mt-4 text-teal-50 max-w-xl text-sm sm:text-base leading-relaxed">
            Nuôi Em dùng blockchain để cam kết tính nguyên vẹn của hồ sơ, và VietQR để mạnh thường quân
            quyên góp ẩn danh. Trường ký, chính quyền ký — tiền tới em, không đứt đoạn.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ho-so"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-teal-900 font-bold rounded-xl px-5 py-3 text-sm shadow-lg shadow-black/10"
            >
              Xem các em đang chờ giúp →
            </Link>
            <Link
              href="/huong-dan"
              className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Vì sao minh bạch?
            </Link>
          </div>
        </div>
      </section>

      {/* Số liệu cộng đồng */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-200 text-center overflow-hidden">
          <div className="p-4">
            <div className="text-2xl font-black text-teal-800">{stats.totalRecords}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wide">Hồ sơ</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-black text-teal-800">{stats.receiving}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wide">Đang nhận</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-black text-teal-800">{stats.totalDonations}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wide">Lượt quyên góp</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-black text-amber-600">{formatVND(stats.totalConfirmed)}</div>
            <div className="text-[11px] text-stone-500 uppercase tracking-wide">Đã đối soát</div>
          </div>
        </div>
      </section>

      {/* 3 bước quyên góp */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl sm:text-2xl font-black text-teal-900 text-center">Quyên góp chỉ với 3 bước</h2>
        <p className="text-center text-sm text-stone-500 mt-1">Không cần tạo tài khoản. Không cần ví crypto.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🔎", title: "1. Chọn một em", body: "Xem danh sách hồ sơ, chọn hoàn cảnh bạn muốn giúp. Mọi thông tin em đều công khai ở mức an toàn." },
            { icon: "📱", title: "2. Quét mã VietQR", body: "Hệ thống sinh mã QR đúng số tài khoản trường kèm mã hồ sơ ẩn bên trong." },
            { icon: "🧾", title: "3. Giữ lại mã giao dịch", body: "Nhập mã giao dịch ở trang Tra cứu bất cứ lúc nào để xem khoản của bạn đi tới đâu." },
          ].map((s) => (
            <div key={s.title} className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-sm">
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 font-bold text-teal-900">{s.title}</div>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cam kết cộng đồng */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="rounded-2xl bg-teal-900 text-teal-50 p-6 sm:p-8 grid gap-4 sm:grid-cols-2 sm:items-center">
          <div>
            <h2 className="text-xl font-black text-amber-300">Cam kết với cộng đồng</h2>
            <ul className="mt-3 text-sm space-y-2">
              <li>✅ 100% giao dịch được ghi nhận công khai</li>
              <li>✅ Hồ sơ chỉ RECEIVING khi trường + chính quyền cùng ký</li>
              <li>✅ Không rút/rút lui dữ liệu — commitment lưu vĩnh viễn on-chain</li>
              <li>✅ Mạnh thường quân ẩn danh, không thu thập thông tin cá nhân</li>
            </ul>
          </div>
          <div className="text-right sm:text-right">
            <Link
              href="/ho-so"
              className="inline-block bg-amber-400 hover:bg-amber-300 text-teal-900 font-bold rounded-xl px-6 py-3 text-sm"
            >
              Chọn hồ sơ để quyên góp →
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

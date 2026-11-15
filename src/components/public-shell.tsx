import type { ReactNode } from "react";

/**
 * Khung dùng chung cho các trang công khai (MTQ, ai cũng xem được).
 * Phong cách cộng đồng: xanh hiền từ + cam ấm, chữ to dễ đọc.
 */
export default function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBFAF7] text-stone-800">
      {/* Top bar */}
      <header className="bg-[#0F766E] text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2 3 8v6c0 5 4 8 9 8s9-3 9-8V8l-9-6Z" stroke="#FCD34D" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 12c0-3-2-5-5-5 0 3 2 5 5 5Z" fill="#FCD34D"/>
            </svg>
            Nuôi Em
          </a>
          <nav className="flex items-center gap-2 text-sm">
            <a href="/ho-so" className="hidden sm:inline px-3 py-1.5 rounded-lg hover:bg-white/10">Danh sách hồ sơ</a>
            <a href="/tra-cuu" className="hidden sm:inline px-3 py-1.5 rounded-lg hover:bg-white/10">Tra cứu</a>
            <a href="/huong-dan" className="hidden sm:inline px-3 py-1.5 rounded-lg hover:bg-white/10">Vì sao minh bạch?</a>
            <a href="/login" className="px-3 py-1.5 rounded-lg border border-white/40 hover:bg-white hover:text-teal-800 font-semibold">Đăng nhập</a>
          </nav>
        </div>
      </header>

      {/* Nội dung */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-teal-900 text-teal-100 text-xs">
        <div className="max-w-6xl mx-auto px-4 py-6 grid gap-3 sm:grid-cols-3">
          <div>
            <div className="font-bold text-white">🌱 Nuôi Em</div>
            <div className="mt-1 text-teal-200">Sao kê từ thiện minh bạch — blockchain + VietQR</div>
          </div>
          <div>
            <div className="font-bold text-white">Uỷ thác</div>
            <div className="mt-1 text-teal-200">Mỗi khoản chuyển đều được lưu, đối soát và đối chiếu on-chain.</div>
          </div>
          <div>
            <div className="font-bold text-white">Liên kết</div>
            <div className="mt-1 flex flex-col gap-1 text-teal-200">
              <a href="/ho-so" className="hover:text-white">Xem hồ sơ</a>
              <a href="/tra-cuu" className="hover:text-white">Tra cứu giao dịch</a>
              <a href="/huong-dan" className="hover:text-white">Vì sao minh bạch?</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

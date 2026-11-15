import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#FBFAF7] flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-6xl">🔒</div>
        <h1 className="mt-3 text-2xl font-black text-teal-900">Bạn không có quyền xem trang này</h1>
        <p className="mt-1 text-sm text-stone-500">
          Hồ sơ thuộc tổ chức khác, hoặc vai trò của bạn không phù hợp.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Link href="/" className="border border-stone-200 rounded-xl px-4 py-2 text-sm hover:bg-stone-50">Về trang chủ</Link>
          <Link href="/ho-so" className="bg-teal-700 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-teal-800">Xem hồ sơ công khai</Link>
        </div>
      </div>
    </main>
  );
}

import PublicShell from "@/components/public-shell";

export default function HuongDanPage() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-teal-900">Vì sao hệ thống này minh bạch?</h1>
        <p className="mt-1 text-sm text-stone-500">
          Bạn không cần tin ai — kể cả ban quản trị. Dưới đây là cách tự kiểm chứng.
        </p>

        <ol className="mt-8 space-y-6">
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">Bước 1</div>
            <h2 className="mt-1 font-bold text-teal-900">Mở trang hồ sơ công khai</h2>
            <p className="mt-1 text-sm text-stone-600">
              Mọi hồ sơ đang tiếp nhận đều hiển thị: trường nào, xã nào, hoàn cảnh, mục tiêu, số tiền đã được xác nhận góp, và danh sách giao dịch (không kèm danh tính người chuyển).
            </p>
          </li>
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">Bước 2</div>
            <h2 className="mt-1 font-bold text-teal-900">So sánh số tiền đã xác nhận với mục tiêu</h2>
            <p className="mt-1 text-sm text-stone-600">
              Hiển thị chính xác: đã nhận X / mục tiêu Y / còn thiếu Z. Số liệu lấy từ webhook ngân hàng — không phải tự khai.
            </p>
          </li>
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">Bước 3</div>
            <h2 className="mt-1 font-bold text-teal-900">Kiểm chứng cam kết trên blockchain</h2>
            <p className="mt-1 text-sm text-stone-600">
              Khi hồ sơ được duyệt, hệ thống ghi một mã băm <code className="bg-stone-100 rounded px-1">commitment = hash(L1 + L2 + salt)</code> lên blockchain. Commitment không chứa thông tin cá nhân, nhưng không thể giả mạo hoặc thay đổi.
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Bất kỳ ai có quyền đọc hồ sơ có thể băm lại dữ liệu → so với commitment trên chuỗi → biết hồ sơ có bị sửa hay không.
            </p>
          </li>
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">Điều bạn KHÔNG tin tưởng</div>
            <ul className="mt-1 text-sm text-stone-600 list-disc pl-5 space-y-1">
              <li>Bạn không cần tin ban quản trị đổi sao kê — vì giao dịch đến trực tiếp từ ngân hàng qua webhook.</li>
              <li>Bạn không cần tin hồ sơ không bị sửa — vì commitment trên chuỗi là bằng chứng một chiều.</li>
              <li>Bạn không cần tin nhà trường khai báo đúng số tiền thu — vì số tiền hiển thị là số tiền ngân hàng báo về.</li>
            </ul>
          </li>
        </ol>

        <div className="mt-6 text-[12px] text-stone-400">
          Câu hỏi khác? Liên hệ điểm tiếp nhận hoặc đọc <a href="/ho-so" className="underline">danh sách hồ sơ</a>.
        </div>
      </div>
    </PublicShell>
  );
}

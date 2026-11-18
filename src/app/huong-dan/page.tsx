import Link from "next/link";
import PublicShell from "@/components/public-shell";

export default function HuongDanPage() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-teal-900">
          Vì sao hệ thống này minh bạch?
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Dưới đây là cách tự kiểm chứng:
        </p>

        <ol className="mt-8 space-y-6">
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">
              Bước 1
            </div>
            <h2 className="mt-1 font-bold text-teal-900">
              Mở trang hồ sơ công khai
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Mọi hồ sơ đang tiếp nhận đều hiển thị: trường nào, xã nào, hoàn
              cảnh, mục tiêu, số tiền đã được xác nhận góp, và danh sách giao
              dịch (không kèm danh tính người chuyển).
            </p>
          </li>
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">
              Bước 2
            </div>
            <h2 className="mt-1 font-bold text-teal-900">
              So sánh số tiền đã xác nhận với mục tiêu
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Hiển thị chính xác: đã nhận X / mục tiêu Y / còn thiếu Z. Số liệu
              lấy từ giao dịch thực tế của mạnh thường quân — không phải tự
              khai.
            </p>
          </li>
          <li className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="text-xs font-black uppercase text-amber-700">
              Bước 3
            </div>
            <h2 className="mt-1 font-bold text-teal-900">
              Kiểm chứng tính minh bạch của hồ sơ
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Mỗi hồ sơ sau khi được xác nhận sẽ được hệ thống lưu lại dấu xác
              thực trên Blockchain. Dấu xác thực này giống như một mốc ghi nhận
              không thể tùy tiện thay đổi, giúp bảo vệ tính nguyên vẹn của thông
              tin đã công bố.
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Khi cần kiểm tra, mọi người có thể đối chiếu hồ sơ hiện tại với
              dấu xác thực ban đầu để biết thông tin có bị chỉnh sửa sau khi
              công bố hay không.
            </p>
            <Link
              href="/kiem-chung"
              className="mt-4 inline-flex rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-800"
            >
              Mở màn hình kiểm chứng blockchain →
            </Link>
          </li>
        </ol>

        <div className="mt-6 text-[12px] text-stone-400">
          Câu hỏi khác? Liên hệ điểm tiếp nhận hoặc đọc{" "}
          <a href="/ho-so" className="underline">
            danh sách hồ sơ
          </a>
          .
        </div>
      </div>
    </PublicShell>
  );
}

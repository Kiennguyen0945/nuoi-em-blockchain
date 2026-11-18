"use client";

import { useState } from "react";
import PublicShell from "@/components/public-shell";

const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Đang chờ xác nhận",
  PROCESSING: "Đang xử lý",
  FAILED: "Giao dịch thất bại",
  CANCELLED: "Đã hủy",
};

function getTransactionStatusLabel(status?: string): string {
  const normalizedStatus = status?.trim().toUpperCase();
  return normalizedStatus
    ? TRANSACTION_STATUS_LABELS[normalizedStatus] ?? status!
    : "Đã xác nhận";
}

export default function TraCuuPage() {
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    found: boolean;
    status?: string;
    amount?: number | string;
    createdAt?: string;
    recordId?: string;
    note?: string;
  }>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `/api/donations/tra-cuu?transactionId=${encodeURIComponent(transactionId.trim())}`,
      );
      if (res.status === 404 || res.status === 501) {
        setResult({ found: false, note: "Mã giao dịch không tồn tại!" });
        return;
      }
      if (!res.ok) {
        setResult({ found: false, note: "Không tìm thấy hoặc lỗi máy chủ" });
        return;
      }
      const data = await res.json();
      setResult({ found: true, ...data });
    } catch {
      setResult({ found: false, note: "Không kết nối được máy chủ" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-teal-900">Tra cứu giao dịch công khai của Nuôi em</h1>
        <p className="mt-1 text-sm text-stone-500">
          Nhập mã giao dịch mà app ngân hàng cung cấp sau khi chuyển tiền — không cần đăng nhập, không cần tạo tài khoản.
        </p>
        <form onSubmit={onSubmit} className="mt-5 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <label className="text-xs font-bold text-stone-500">Mã giao dịch</label>
          <input
            required
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="VD: FT26299GJ9..."
            className="mt-1 w-full border border-stone-200 rounded-xl px-4 py-3 text-sm font-mono"
          />
          <button
            disabled={loading}
            className="mt-3 w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-teal-900 font-black rounded-xl py-3 text-sm"
          >
            {loading ? "Đang tra cứu..." : "Tra cứu →"}
          </button>
        </form>

        {result && (
          <div className="mt-4 bg-white border border-stone-200 rounded-2xl p-5">
            {result.found ? (
              <>
                <div className="text-xs text-stone-400">Trạng thái</div>
                <div className="font-black text-emerald-700 text-lg">
                  {getTransactionStatusLabel(result.status)}
                </div>
                {result.amount != null && (
                  <div className="mt-2 text-sm">
                    <span className="text-stone-500">Số tiền:</span>{" "}
                    <b>{Number(result.amount).toLocaleString("vi-VN")} đ</b>
                  </div>
                )}
                {result.createdAt && (
                  <div className="text-sm text-stone-500">
                    Thời gian: {new Date(result.createdAt).toLocaleString("vi-VN")}
                  </div>
                )}
                {result.recordId && (
                  <a href={`/ho-so/${result.recordId}`} className="mt-3 inline-block text-sm font-semibold text-teal-800 underline">
                    Xem hồ sơ được hỗ trợ →
                  </a>
                )}
              </>
            ) : (
              <div className="text-sm text-stone-600">
                <div className="font-bold text-amber-800">Chưa tìm thấy</div>
                <p className="mt-1">{result.note ?? "Mã này chưa có trong sổ cái hoặc bạn nhập sai. Hãy kiểm tra lại mã giao dịch trong app ngân hàng."}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-[11px] text-stone-400 leading-relaxed">
          Danh tính người chuyển không được thu thập.
        </div>
      </div>
    </PublicShell>
  );
}

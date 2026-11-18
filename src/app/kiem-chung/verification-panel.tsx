"use client";

import { useEffect, useState } from "react";

type VerificationResult = {
  recordId: string;
  status: "VALID" | "MISMATCH";
  databaseCommitment: string;
  recomputedCommitment: string;
  blockchainCommitment: string;
  databaseCommitmentMatches: boolean;
  blockchainCommitmentMatches: boolean;
  transactionHash: string | null;
  blockNumber: string | null;
  blockchainTimestamp: string;
  recordedBy: string;
  contractAddress: string;
};

export default function VerificationPanel({ initialRecordId }: { initialRecordId: string }) {
  const [recordId, setRecordId] = useState(initialRecordId);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify(id = recordId) {
    const value = id.trim();
    if (!value) {
      setError("Vui lòng nhập mã hồ sơ.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`/api/records/${encodeURIComponent(value)}/verify`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Không thể kiểm chứng hồ sơ.");
      setResult(data);
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Không thể kiểm chứng hồ sơ.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialRecordId) void verify(initialRecordId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRecordId]);

  return (
    <div className="space-y-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void verify();
        }}
        className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
      >
        <label htmlFor="record-id" className="text-xs font-bold text-stone-500">
          Mã hồ sơ
        </label>
        <div className="mt-1 flex flex-col sm:flex-row gap-2">
          <input
            id="record-id"
            value={recordId}
            onChange={(event) => setRecordId(event.target.value)}
            placeholder="Nhập mã hồ sơ"
            className="min-w-0 flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white rounded-xl px-5 py-3 text-sm font-bold"
          >
            {loading ? "Đang kiểm chứng..." : "Kiểm chứng"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-stone-400">
          Bạn có thể lấy mã này từ đường dẫn trang chi tiết hồ sơ.
        </p>
      </form>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      {result && (
        <section className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className={`rounded-xl p-4 ${result.status === "VALID" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
            <div className="text-xs font-bold uppercase tracking-wide">Kết quả kiểm chứng</div>
            <div className="mt-1 text-xl font-black">
              {result.status === "VALID" ? "Hợp lệ — thông tin hồ sơ khớp" : "Có thay đổi — cần kiểm tra lại"}
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              {result.status === "VALID"
                ? "Thông tin hồ sơ hiện tại khớp với thông tin đã được ghi nhận trước đó."
                : "Thông tin hồ sơ hiện tại không còn giống với thông tin đã được ghi nhận trước đó."}
            </p>
          </div>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Mã hồ sơ" value={result.recordId} mono />
            <Info label="Trạng thái" value={result.status === "VALID" ? "Đã xác nhận" : "Cần kiểm tra lại"} />
            <Info label="Ghi nhận trên blockchain" value="Đã lưu" />
            <Info label="Thời điểm ghi nhận" value={formatTimestamp(result.blockchainTimestamp)} />
          </dl>

          <p className="mt-5 text-xs leading-relaxed text-stone-500">
            Kết quả này giúp bạn biết hồ sơ có bị thay đổi sau khi được xác nhận hay không. Thông tin cá nhân và chi tiết kỹ thuật không được đưa lên blockchain.
          </p>

          <details className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <summary className="cursor-pointer text-sm font-bold text-teal-900">Xem chi tiết kỹ thuật</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <HashCard label="Dấu xác thực tính từ hồ sơ hiện tại" value={result.recomputedCommitment} />
              <HashCard label="Dấu xác thực trên blockchain" value={result.blockchainCommitment} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Block" value={result.blockNumber ?? "Chưa có receipt"} mono />
              <Info label="Transaction hash" value={result.transactionHash ?? "Chưa có"} mono />
              <Info label="Contract" value={result.contractAddress} mono />
              <Info label="Ví ghi nhận" value={result.recordedBy} mono />
              <Info label="Đối chiếu database" value={result.databaseCommitmentMatches ? "Khớp" : "Không khớp"} />
            </dl>
          </details>
        </section>
      )}
    </div>
  );
}

function formatTimestamp(value: string) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return "Chưa có thông tin";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(seconds * 1000));
}

function HashCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 border border-stone-100 p-3">
      <div className="text-[11px] text-stone-500">{label}</div>
      <code className="mt-1 block break-all text-[11px] text-teal-900">{value}</code>
    </div>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-stone-400">{label}</dt>
      <dd className={`mt-0.5 break-all ${mono ? "font-mono text-xs" : "font-semibold text-stone-700"}`}>{value}</dd>
    </div>
  );
}

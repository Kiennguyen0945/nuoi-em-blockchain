import Link from "next/link";
import { notFound } from "next/navigation";
import PublicShell from "@/components/public-shell";
import ProgressBar from "@/components/progress-bar";
import { getPublicRecord, getDonations, formatVND, shortCode } from "@/lib/public";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSchool,
  faLandmark,
  faMoneyBillWave,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";

const STATUS_STEPS = [
  { key: "DRAFT", label: "Soạn hồ sơ" },
  { key: "PENDING_APPROVAL", label: "Chờ ký" },
  { key: "RECEIVING", label: "Đang nhận" },
  { key: "WAITING_FOR_REPORT", label: "Chờ báo cáo" },
  { key: "CLOSED", label: "Đã hoàn tất" },
];

export default async function PublicRecordDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const record = await getPublicRecord(params.id);
  if (!record) notFound();

  const goal = Number(record.goalLimit);
  const currentStep = STATUS_STEPS.findIndex((s) => s.key === record.status);
  const statusIdx = currentStep === -1 ? 2 : currentStep;
  const donations = await getDonations(record.id);

  return (
    <PublicShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/ho-so" className="inline-flex items-center gap-1.5 text-sm text-teal-800 hover:underline"><FontAwesomeIcon icon={faArrowLeft} /> Về danh sách hồ sơ</Link>

        {/* Hero + progress */}
        <div className="mt-3 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-teal-700 to-emerald-600 text-white p-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold bg-white/20 rounded-full px-3 py-1">
                Mã hồ sơ #{shortCode(record.id)}
              </span>
              <span className="text-[10px] uppercase font-bold bg-amber-400 text-teal-900 rounded-full px-3 py-1">
                {record.status}
              </span>
            </div>
            <h1 className="mt-3 text-xl sm:text-2xl font-black leading-snug">{record.situation ?? "Hoàn cảnh khó khăn"}</h1>
            <div className="mt-2 text-xs text-teal-50">
              <span className="inline-flex items-center gap-1.5"><FontAwesomeIcon icon={faSchool} /> {record.school?.organizationName ?? "—"} ({record.school?.organizationCode ?? ""})</span>
              <br />
              <span className="inline-flex items-center gap-1.5"><FontAwesomeIcon icon={faLandmark} /> {record.localAuth?.organizationName ?? "—"} ({record.localAuth?.organizationCode ?? ""})</span>
            </div>
          </div>

          <div className="p-6">
            <ProgressBar raised={record.raised} goal={goal} size="lg" />
            <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[11px] text-stone-500">
                {donations.length} lượt chuyển · Tài khoản tiếp nhận:{" "}
                <span className="font-mono">{record.bankAccountNumber ?? "—"}</span>
              </div>
              <Link
                href={`/ho-so/${record.id}/quyen-gop`}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-teal-900 font-black rounded-xl px-6 py-3 text-sm shadow"
              >
                <FontAwesomeIcon icon={faMoneyBillWave} /> Quyên góp ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline trạng thái */}
        <div className="mt-4 bg-white border border-stone-200 rounded-2xl p-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-stone-500">Hành trình hồ sơ</h2>
          <ol className="mt-3 flex flex-wrap gap-2">
            {STATUS_STEPS.map((step, i) => {
              const active = i <= statusIdx;
              const current = i === statusIdx;
              return (
                <li
                  key={step.key}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                    current
                      ? "border-amber-400 bg-amber-50 text-amber-800"
                      : active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 text-stone-400"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${active ? "bg-emerald-500" : "bg-stone-300"}`} />
                  {step.label}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Sao kê công khai */}
        <div className="mt-4 bg-white border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="font-black text-teal-900">Sao kê giao dịch (công khai)</h2>
            <Link href="/tra-cuu" className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:underline">Tra cứu khoản của bạn <FontAwesomeIcon icon={faArrowRight} /></Link>
          </div>
          {donations.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">Chưa có giao dịch nào — hãy là người đầu tiên.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-stone-500 border-b border-stone-200">
                    <th className="py-2">Mã giao dịch</th>
                    <th>Số tiền</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-stone-100">
                      <td className="py-2 font-mono text-xs">{d.transactionId.slice(0, 12)}…</td>
                      <td className="font-bold text-teal-900">{formatVND(d.amount)}</td>
                      <td className="text-xs text-stone-600">
                        {new Date(d.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td>
                        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-[10px] text-stone-400">
            Danh tính người chuyển KHÔNG được công khai. Chỉ hiển thị: mã giao dịch, số tiền, thời gian.
          </p>
        </div>

        {/* Chứng minh toàn vẹn */}
        <div className="mt-4 bg-teal-900 text-teal-50 rounded-2xl p-5 text-sm">
          <h2 className="font-black text-amber-300 inline-flex items-center gap-2"><FontAwesomeIcon icon={faLink} /> Toàn vẹn dữ liệu</h2>
          <p className="mt-1 text-teal-100">
            Hồ sơ này được cam kết trên blockchain bằng{" "}
            <code className="bg-white/10 rounded px-1">commitment = hash(L1 + L2 + salt)</code>.
            Bất kỳ ai sửa hồ sơ sau khi ghi cũng làm lệch mã băm. Chi tiết xem{" "}
            <Link href="/huong-dan" className="underline font-semibold">Vì sao minh bạch?</Link>.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}

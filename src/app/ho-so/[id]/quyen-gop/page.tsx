import { notFound } from "next/navigation";
import PublicShell from "@/components/public-shell";
import DonationPanel from "./donation-panel";
import { getPublicRecord, shortCode } from "@/lib/public";
import { getRecordStatusLabel } from "@/lib/record-status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { verifyAndUpdateRecordIntegrity } from "@/lib/record-integrity";
 
export const dynamic = "force-dynamic";

export default async function DonatePage({ params }: { params: { id: string } }) {
  const record = await getPublicRecord(params.id);
  if (!record) notFound();

  // Chỉ cho quyên góp khi hồ sơ đang RECEIVING
  if (record.status !== "RECEIVING") {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="text-5xl text-teal-700"><FontAwesomeIcon icon={faDove} /></div>
          <h1 className="mt-3 text-xl font-black text-teal-900">Hồ sơ chưa mở quyên góp</h1>
          <p className="mt-1 text-sm text-stone-500">
            Hồ sơ này hiện ở trạng thái <b>{getRecordStatusLabel(record.status)}</b>. Quyên góp chỉ mở khi hồ sơ chuyển sang trạng thái “Đang nhận quyên góp”.
          </p>
          <a href="/ho-so" className="mt-4 inline-flex items-center gap-1.5 bg-amber-400 text-teal-900 font-bold rounded-xl px-5 py-2.5 text-sm">
            Về danh sách hồ sơ <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </PublicShell>
    );
  }

  const integrity = await verifyAndUpdateRecordIntegrity(record.id);
  if (integrity.status !== "VALID") {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="text-5xl text-red-600">🔴</div>
          <h1 className="mt-3 text-xl font-black text-red-800">
            Quyên góp tạm thời bị tạm dừng
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Hồ sơ chưa vượt qua kiểm tra tính toàn vẹn. Vui lòng quay lại sau.
          </p>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <DonationPanel
          recordId={record.id}
          situation={record.situation ?? "Hoàn cảnh khó khăn"}
          shortCode={shortCode(record.id)}
          bankAccount={record.bankAccountNumber}
          schoolName={record.school?.organizationName ?? ""}
          remaining={Math.max(0, Number(record.goalLimit) - Number(record.raised))}
        />
      </div>
    </PublicShell>
  );
}

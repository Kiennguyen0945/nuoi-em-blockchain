import { notFound } from "next/navigation";
import PublicShell from "@/components/public-shell";
import DonationPanel from "./donation-panel";
import { getPublicRecord, shortCode } from "@/lib/public";

export const dynamic = "force-dynamic";

export default async function DonatePage({ params }: { params: { id: string } }) {
  const record = await getPublicRecord(params.id);
  if (!record) notFound();

  // Chỉ cho quyên góp khi hồ sơ đang RECEIVING
  if (record.status !== "RECEIVING") {
    return (
      <PublicShell>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="text-5xl">🕊️</div>
          <h1 className="mt-3 text-xl font-black text-teal-900">Hồ sơ chưa mở quyên góp</h1>
          <p className="mt-1 text-sm text-stone-500">
            Hồ sơ này hiện ở trạng thái <b>{record.status}</b>. Quyên góp chỉ mở khi hồ sơ chuyển sang RECEIVING.
          </p>
          <a href="/ho-so" className="mt-4 inline-block bg-amber-400 text-teal-900 font-bold rounded-xl px-5 py-2.5 text-sm">
            Về danh sách hồ sơ →
          </a>
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

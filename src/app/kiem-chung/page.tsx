import Link from "next/link";
import PublicShell from "@/components/public-shell";
import VerificationPanel from "./verification-panel";

export const dynamic = "force-dynamic";

export default function BlockchainVerificationPage({
  searchParams,
}: {
  searchParams: { recordId?: string };
}) {
  const initialRecordId = searchParams.recordId ?? "";

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/ho-so" className="text-sm text-teal-800 hover:underline">
          ← Về danh sách hồ sơ
        </Link>
        <h1 className="mt-4 text-2xl sm:text-3xl font-black text-teal-900">Kiểm tra tính minh bạch</h1>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">
          Kiểm tra xem thông tin hồ sơ hiện tại có đúng với thông tin đã được ghi nhận trước đó hay không.
        </p>
        <div className="mt-6">
          <VerificationPanel initialRecordId={initialRecordId} />
        </div>
      </div>
    </PublicShell>
  );
}

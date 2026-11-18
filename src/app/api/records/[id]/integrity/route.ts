import { NextResponse } from "next/server";
import { verifyAndUpdateRecordIntegrity } from "@/lib/record-integrity";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const result = await verifyAndUpdateRecordIntegrity(params.id);
    return NextResponse.json({ recordId: params.id, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể kiểm tra hồ sơ";
    return NextResponse.json({ status: "UNKNOWN", recordId: params.id, reason: message }, { status: 404 });
  }
}

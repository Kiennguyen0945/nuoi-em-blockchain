import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Skeleton route nhận webhook (SePay / Casso / mô phỏng chuyển khoản)
  // Không chứa logic nghiệp vụ theo yêu cầu giai đoạn cấu hình môi trường
  return NextResponse.json(
    { message: "Webhook endpoint ready" },
    { status: 200 }
  );
}


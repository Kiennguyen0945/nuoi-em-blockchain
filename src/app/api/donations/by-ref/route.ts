import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      return NextResponse.json({ error: "Thiếu mã referenceCode" }, { status: 400 });
    }

    // Tìm kiếm giao dịch trong bảng donations theo mã referenceCode
    const donation = await prisma.donation.findFirst({
      where: {
        referenceCode: {
          equals: ref,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        amount: true,
        transactionId: true,
        createdAt: true,
      },
    });

    if (!donation) {
      // Chưa có tiền vào -> báo frontend tiếp tục đợi
      return NextResponse.json({ status: "pending", ref }, { status: 200 });
    }

    // Đã nhận được tiền -> frontend sẽ tự động nhảy sang màn hình cảm ơn!
    return NextResponse.json(
      {
        status: "confirmed",
        donation: {
          id: donation.id,
          amount: Number(donation.amount),
          transactionId: donation.transactionId,
          createdAt: donation.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

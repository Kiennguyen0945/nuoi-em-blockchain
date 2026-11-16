import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import {
  canAssignToRecord,
  extractRecordPrefix,
  extractReferenceCode,
  extractTransactionId,
} from "@/lib/sepay";

export async function POST(req: Request) {
  try {
    // 1. Xác thực API Key từ SePay
    const sepayApiKey = process.env.SEPAY_API_KEY;
    if (sepayApiKey) {
      const authHeader = req.headers.get("authorization") ?? "";
      // SePay gửi header dạng: "Apikey YOUR_API_KEY"
      const token = authHeader.replace(/^Apikey\s+/i, "").trim();

      if (token !== sepayApiKey) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Sai API Key" },
          { status: 401 }
        );
      }
    }

    // 2. Đọc payload JSON
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Payload JSON không hợp lệ" },
        { status: 400 }
      );
    }

    // Bỏ qua nếu là giao dịch tiền ra
    if (body.transferType && body.transferType !== "in") {
      return NextResponse.json(
        { success: true, message: "Bỏ qua giao dịch tiền ra (out)" },
        { status: 200 }
      );
    }

    // 3. Trích xuất số tiền (SePay dùng transferAmount)
    const rawAmount = body.transferAmount ?? body.amount;
    const amount = Number(rawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Số tiền quyên góp không hợp lệ" },
        { status: 400 }
      );
    }

    // 4. Trích xuất mã hồ sơ (HSxxxxx-xxxx) từ nội dung chuyển khoản (body.content)
    const ref = extractReferenceCode(body.content, body.referenceCode);
    if (!ref) {
      // Trả về 200 với success: false để SePay không cố gửi lại nếu người chuyển ghi sai cú pháp
      return NextResponse.json(
        {
          success: false,
          message: "Giao dịch không chứa mã hồ sơ hợp lệ (HSxxxxx-xxxx), bỏ qua.",
        },
        { status: 200 }
      );
    }

    const prefix = extractRecordPrefix(ref);

    // 5. Lấy mã giao dịch duy nhất từ SePay (body.id)
    const txId =
      extractTransactionId(body) ??
      `MOCK-TX-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;

    // 6. Tìm hồ sơ đang RECEIVING khớp với 5 ký tự đầu của ID
    const record = await prisma.record.findFirst({
      where: {
        status: "RECEIVING",
        id: {
          startsWith: prefix,
          mode: "insensitive",
        },
      },
      select: { id: true, goalLimit: true, status: true },
    });

    if (!record || !canAssignToRecord(ref, record)) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy hồ sơ RECEIVING khớp với mã ${ref}.`,
        },
        { status: 404 }
      );
    }

    // 7. Tạo mã hash giao dịch
    const salt = process.env.ENCRYPTION_SALT ?? "charity-salt-secret";
    const txHash =
      "0x" +
      createHash("sha256")
        .update(`${txId}:${amount}:${record.id}:${salt}`)
        .digest("hex");

    // 8. Lưu giao dịch & kiểm tra đạt mục tiêu trong 1 Transaction
    const result = await prisma.$transaction(async (tx) => {
      const donation = await tx.donation.create({
        data: {
          recordId: record.id,
          amount,
          transactionId: txId,
          referenceCode: ref,
          transactionHash: txHash,
        },
      });

      const sumResult = await tx.donation.aggregate({
        where: { recordId: record.id },
        _sum: { amount: true },
      });

      const totalRaised = Number(sumResult._sum.amount ?? 0);
      let updatedStatus = record.status;

      if (totalRaised >= Number(record.goalLimit)) {
        await tx.record.update({
          where: { id: record.id },
          data: { status: "WAITING_FOR_REPORT" },
        });
        updatedStatus = "WAITING_FOR_REPORT";
      }

      return { donation, totalRaised, updatedStatus };
    });

    // SePay yêu cầu phản hồi HTTP 200 hoặc 201 kèm { "success": true }
    return NextResponse.json(
      {
        success: true,
        message: "Ghi nhận giao dịch quyên góp thành công!",
        donation: {
          id: result.donation.id,
          transactionId: result.donation.transactionId,
          amount: Number(result.donation.amount),
          referenceCode: result.donation.referenceCode,
          transactionHash: result.donation.transactionHash,
          recordId: result.donation.recordId,
          createdAt: result.donation.createdAt,
        },
        recordStatus: result.updatedStatus,
        totalRaised: result.totalRaised,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Nếu giao dịch đã tồn tại (trùng transactionId), trả về 200 để xác nhận với SePay
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        {
          success: true,
          message: "Giao dịch đã được ghi nhận trước đó.",
        },
        { status: 200 }
      );
    }

    console.error("Webhook Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Lỗi xử lý webhook";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// Prisma Client stub - Sẽ được kích hoạt sau khi định nghĩa schema models và chạy `npx prisma generate`
// Không tạo bảng database ở bước cấu hình môi trường ban đầu theo yêu cầu.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const getPrisma = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
};

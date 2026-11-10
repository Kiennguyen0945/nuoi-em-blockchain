import { auth } from "./auth";
import type { SessionUser } from "./permissions";

/**
 * Lấy SessionUser (id + role) từ NextAuth session.
 * Trả null nếu chưa đăng nhập.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;
  if (!id || !role) return null;
  return { id, role };
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/permissions";

/**
 * Dùng trong server page: bắt buộc đăng nhập + đúng role.
 * Không đúng → redirect (/login nếu chưa đăng nhập, / nếu sai role).
 */
export async function requireRole(role: UserRole) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== role) redirect("/");
  return session.user as {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
  };
}

/** Home: điều hướng theo role nếu đã đăng nhập. */
export function roleHome(role: UserRole): string {
  if (role === "ADMIN") return "/admin";
  if (role === "SCHOOL") return "/school";
  return "/localauth";
}

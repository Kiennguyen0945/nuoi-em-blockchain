import { requireRole } from "@/lib/require-role";
import RoleShell from "@/components/role-shell";
import RecordsBoard from "@/components/records-board";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireRole("ADMIN");
  return (
    <RoleShell role="ADMIN" name={user.name} subtitle="Nhập hồ sơ DRAFT · gửi duyệt khi xong">
      <RecordsBoard role="ADMIN" />
    </RoleShell>
  );
}

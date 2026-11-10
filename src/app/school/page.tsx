import { requireRole } from "@/lib/require-role";
import RoleShell from "@/components/role-shell";
import RecordsBoard from "@/components/records-board";

export const dynamic = "force-dynamic";

export default async function SchoolPage() {
  const user = await requireRole("SCHOOL");
  return (
    <RoleShell role="SCHOOL" name={user.name} subtitle="Chỉ trẻ của trường mình · Ký/từ chối hồ sơ">
      <RecordsBoard role="SCHOOL" />
    </RoleShell>
  );
}

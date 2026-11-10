import { requireRole } from "@/lib/require-role";
import RoleShell from "@/components/role-shell";
import RecordsBoard from "@/components/records-board";

export const dynamic = "force-dynamic";

export default async function LocalAuthPage() {
  const user = await requireRole("LOCAL_AUTH");
  return (
    <RoleShell role="LOCAL_AUTH" name={user.name} subtitle="Trẻ của xã mình · Ký/từ chối hồ sơ">
      <RecordsBoard role="LOCAL_AUTH" />
    </RoleShell>
  );
}

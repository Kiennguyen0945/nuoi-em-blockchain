import type { ReactNode } from "react";
import SignOutButton from "./sign-out-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheatAwn } from "@fortawesome/free-solid-svg-icons";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Quản trị viên (Admin)",
  SCHOOL: "Nhà trường (School)",
  LOCAL_AUTH: "Chính quyền địa phương (LocalAuth)",
};

export default function RoleShell({
  role,
  name,
  subtitle,
  children,
}: {
  role: string;
  name?: string | null;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-teal-800 text-white px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-bold text-lg leading-tight inline-flex items-center gap-2"><FontAwesomeIcon icon={faWheatAwn} className="text-teal-200" /> NuôiEm</div>
          <div className="text-xs text-teal-100">{ROLE_LABEL[role] ?? role}{name ? ` · ${name}` : ""}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-teal-100">{subtitle}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-4">{children}</div>
    </main>
  );
}

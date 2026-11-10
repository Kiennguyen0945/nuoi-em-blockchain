"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100"
    >
      Đăng xuất
    </button>
  );
}

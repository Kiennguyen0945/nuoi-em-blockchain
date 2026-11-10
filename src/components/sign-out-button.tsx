"use client";

import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-1.5 text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100"
    >
      <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
    </button>
  );
}

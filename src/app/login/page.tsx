"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nuoi-em.vn");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Sai email hoặc mật khẩu (hoặc tài khoản đã bị khóa)");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-bold text-teal-800">Đăng nhập NuôiEm</h1>
        <p className="text-xs text-slate-500 mt-1">
          MVP · 5 tài khoản demo (mật khẩu chung <b>Password123!</b>)
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="admin@nuoi-em.vn"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-4 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          <div className="font-semibold text-slate-600">Tài khoản demo:</div>
          <div>Admin: admin@nuoi-em.vn</div>
          <div>School: truong1@nuoi-em.vn · truong2@nuoi-em.vn</div>
          <div>UBND: localauth_xa@nuoi-em.vn · localauth_xb@nuoi-em.vn</div>
        </div>
      </div>
    </main>
  );
}

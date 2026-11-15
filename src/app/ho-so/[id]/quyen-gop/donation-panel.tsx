"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faBuildingColumns,
  faCopy,
  faBolt,
  faSeedling,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

type Phase = "amount" | "qr" | "confirmed";

const PRESETS = [100_000, 200_000, 500_000, 1_000_000, 2_000_000];
const BANK_ID = process.env.NEXT_PUBLIC_VIETQR_BANK_ID ?? "MB";
const TEMPLATE = process.env.NEXT_PUBLIC_VIETQR_TEMPLATE ?? "compact2";

function randomRef(short: string) {
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `HS${short.slice(0, 5)}-${rand}`;
}

export default function DonationPanel({
  recordId,
  situation,
  shortCode,
  bankAccount,
  schoolName,
  remaining,
}: {
  recordId: string;
  situation: string;
  shortCode: string;
  bankAccount: string | null;
  schoolName: string;
  remaining: number;
}) {
  const [amount, setAmount] = useState<number>(200_000);
  const [custom, setCustom] = useState("");
  const [phase, setPhase] = useState<Phase>("amount");
  const [ref, setRef] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [statusNote, setStatusNote] = useState("Đang chờ tiền vào...");
  const [backendError, setBackendError] = useState(false);
  const timerRef = useRef<number | null>(null);

  const effectiveAmount = custom ? Number(custom) || 0 : amount;

  // Sinh reference_code 1 lần, lưu localStorage để reload không sinh mã mới
  useEffect(() => {
    const key = `qr-ref:${recordId}`;
    const saved = window.localStorage.getItem(key);
    if (saved) {
      setRef(saved);
    } else {
      const r = randomRef(shortCode);
      window.localStorage.setItem(key, r);
      setRef(r);
    }
  }, [recordId, shortCode]);

  const qrUrl = useMemo(() => {
    if (!bankAccount) return "";
    const params = new URLSearchParams({
      amount: String(effectiveAmount),
      addInfo: ref,
      accountName: schoolName,
    });
    return `https://img.vietqr.io/image/${BANK_ID}-${bankAccount}-${TEMPLATE}.png?${params}`;
  }, [bankAccount, effectiveAmount, ref, schoolName]);

  // Countdown 10 phút
  useEffect(() => {
    if (phase !== "qr") return;
    if (secondsLeft <= 0) return;
    timerRef.current = window.setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, secondsLeft]);

  // Poll trạng thái giao dịch mỗi 3 giây — backend (nhóm bạn) cài đặt endpoint này
  useEffect(() => {
    if (phase !== "qr") return;
    const poll = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/donations/by-ref?ref=${encodeURIComponent(ref)}`);
        if (res.status === 404 || res.status === 501) {
          setBackendError(true);
          setStatusNote("Backend chưa cài đặt — dùng nút giả lập bên dưới để test");
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (data?.status === "confirmed" || data?.donation) {
          setPhase("confirmed");
          setStatusNote("Cảm ơn bạn đã quyên góp!");
        }
      } catch {
        // im lặng — giữ đếm tiếp
      }
    }, 3000);
    return () => window.clearInterval(poll);
  }, [phase, ref]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  /* ===== Phase 1: chọn số tiền ===== */
  if (phase === "amount") {
    return (
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-6">
          <div className="text-xs font-mono text-stone-400">#{shortCode}</div>
          <h1 className="mt-1 text-xl font-black text-teal-900">{situation}</h1>
            <div className="mt-3 text-sm text-stone-600">
              <span className="inline-flex items-center gap-1.5"><FontAwesomeIcon icon={faSchool} /> {schoolName || "—"}</span>
              <br />
              <span className="inline-flex items-center gap-1.5"><FontAwesomeIcon icon={faBuildingColumns} /> TK nhận: <span className="font-mono">{bankAccount ?? "—"}</span></span>
            </div>
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-900">
            Còn thiếu: <b>{remaining.toLocaleString("vi-VN")} đ</b>
            <br />
            Tiền tới thẳng tài khoản nhà trường — không qua trung gian.
          </div>
        </div>

        <div className="md:col-span-3 bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="font-black text-teal-900">Chọn số tiền quyên góp</h2>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setAmount(p);
                  setCustom("");
                }}
                className={`rounded-xl border px-3 py-3 text-sm font-bold ${
                  !custom && amount === p
                    ? "border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-300"
                    : "border-stone-200 hover:border-amber-300"
                }`}
              >
                {p / 1000}k
              </button>
            ))}
          </div>
          <label className="mt-3 block text-xs font-bold text-stone-500">Hoặc nhập số tiền tuỳ ý (VND)</label>
          <input
            type="number"
            min={1000}
            step={1000}
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setAmount(0);
            }}
            placeholder="VD: 350000"
            className="mt-1 w-full border border-stone-200 rounded-xl px-4 py-3 text-sm"
          />
          <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-stone-500">
              Sẽ hiển thị trên QR: <b className="text-teal-900">{effectiveAmount.toLocaleString("vi-VN")} đ</b>
            </div>
            <button
              disabled={effectiveAmount < 1000}
              onClick={() => setPhase("qr")}
              className="bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl px-6 py-3 font-bold text-sm"
            >
              Sinh mã VietQR →
            </button>
          </div>
          <p className="mt-3 text-[11px] text-stone-400">
            Nội dung chuyển khoản mặc định chứa mã hồ sơ ẩn danh — bạn có thể sao chép nguyên dòng, không sửa kẻo hệ thống không ghép được khoản của bạn.
          </p>
        </div>
      </div>
    );
  }

  /* ===== Phase 2: QR + countdown ===== */
  if (phase === "qr") {
    return (
      <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-2xl p-6 text-center">
        <h1 className="text-lg font-black text-teal-900">Quét mã để chuyển khoản</h1>
        <p className="text-[11px] text-stone-500 mt-1">
          Mở app ngân hàng → <b>Quét QR</b> → chuyển đúng thông tin hiển thị bên dưới (không sửa nội dung).
        </p>

        {qrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrUrl}
            alt={`VietQR - ${schoolName}`}
            className="mt-4 mx-auto w-64 border border-stone-200 rounded-xl p-2 bg-white"
          />
        ) : (
          <div className="mt-4 border border-red-200 bg-red-50 text-red-700 text-xs rounded-xl p-3">
            Hồ sơ chưa cấu hình số tài khoản. Liên hệ ban quản trị.
          </div>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-2 text-left text-[12px]">
          <div className="bg-stone-50 rounded-lg p-2">
            <dt className="text-stone-400">Số tiền</dt>
            <dd className="font-bold text-teal-900">{effectiveAmount.toLocaleString("vi-VN")} đ</dd>
          </div>
          <div className="bg-stone-50 rounded-lg p-2">
            <dt className="text-stone-400">Ngân hàng</dt>
            <dd className="font-bold">{BANK_ID}</dd>
          </div>
          <div className="bg-stone-50 rounded-lg p-2 col-span-2">
            <dt className="text-stone-400">Nội dung chuyển khoản (giữ nguyên)</dt>
            <dd className="font-mono font-bold text-amber-800 select-all">{ref}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-stone-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          {statusNote}
          <span className="font-mono font-bold text-teal-900">{mm}:{ss}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(ref)}
            className="border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-stone-50"
          >
            <FontAwesomeIcon icon={faCopy} className="mr-1.5" /> Sao chép mã HS
          </button>
          <button
            onClick={() => setPhase("amount")}
            className="border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-stone-50 inline-flex items-center justify-center gap-1.5"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Đổi số tiền
          </button>
        </div>

        {backendError && (
          <button
            onClick={() => setPhase("confirmed")}
            className="mt-3 w-full bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            <FontAwesomeIcon icon={faBolt} className="mr-1.5" /> Giả lập “tiền đã vào” (chỉ dùng khi demo)
          </button>
        )}
      </div>
    );
  }

  /* ===== Phase 3: confirmed ===== */
  return (
    <div className="max-w-md mx-auto bg-white border border-emerald-200 rounded-2xl p-8 text-center">
      <div className="text-6xl text-emerald-600"><FontAwesomeIcon icon={faSeedling} /></div>
      <h1 className="mt-2 text-2xl font-black text-emerald-700">Cảm ơn tấm lòng của bạn!</h1>
      <p className="mt-1 text-sm text-stone-600">{statusNote}</p>
      <dl className="mt-4 text-left text-[12px] grid grid-cols-2 gap-2">
        <div className="bg-emerald-50 rounded-lg p-2">
          <dt className="text-stone-400">Mã HS</dt>
          <dd className="font-mono font-bold">{ref}</dd>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2">
          <dt className="text-stone-400">Số tiền</dt>
          <dd className="font-bold">{effectiveAmount.toLocaleString("vi-VN")} đ</dd>
        </div>
      </dl>
      <a
        href={`/ho-so/${recordId}`}
        className="mt-5 inline-block bg-teal-700 hover:bg-teal-800 text-white rounded-xl px-6 py-3 font-bold text-sm"
      >
        Xem sao kê hồ sơ →
      </a>
    </div>
  );
}

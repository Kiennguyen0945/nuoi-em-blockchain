"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

export default function DonationAction({ recordId }: { recordId: string }) {
  const [status, setStatus] = useState<"VALID" | "FAILED" | "UNKNOWN">("UNKNOWN");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`/api/records/${recordId}/integrity`)
      .then((response) => response.json())
      .then((data) => setStatus(data.status ?? "UNKNOWN"))
      .catch(() => setStatus("UNKNOWN"))
      .finally(() => setChecking(false));
  }, [recordId]);

  if (status !== "VALID") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 bg-stone-300 text-stone-500 font-black rounded-xl px-6 py-3 text-sm shadow cursor-not-allowed"
      >
        {status === "FAILED" ? "Quyên góp tạm thời bị tạm dừng" : "Đang kiểm tra tính toàn vẹn..."}
      </button>
    );
  }

  return (
    <Link
      href={`/ho-so/${recordId}/quyen-gop`}
      aria-disabled={checking || status !== "VALID"}
      className={`inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-teal-900 font-black rounded-xl px-6 py-3 text-sm shadow ${checking ? "opacity-60" : ""}`}
    >
      <FontAwesomeIcon icon={faMoneyBillWave} /> Quyên góp ngay
    </Link>
  );
}

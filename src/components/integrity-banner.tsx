"use client";

import { useEffect, useState } from "react";

type IntegrityStatus = "VALID" | "FAILED" | "UNKNOWN";

export default function IntegrityBanner({
  recordId,
  receiving,
}: {
  recordId: string;
  receiving: boolean;
}) {
  const [status, setStatus] = useState<IntegrityStatus>("UNKNOWN");
  const [reason, setReason] = useState<string>();

  useEffect(() => {
    let active = true;
    fetch(`/api/records/${recordId}/integrity`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setStatus(data.status ?? "UNKNOWN");
        setReason(data.reason);
      })
      .catch(() => {
        if (active) setStatus("UNKNOWN");
      });
    return () => {
      active = false;
    };
  }, [recordId]);

  if (status === "FAILED") {
    return (
      <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
        <div className="font-black">🔴 Có dấu hiệu dữ liệu bị chỉnh sửa</div>
        {receiving && <div className="mt-1 font-semibold">Quyên góp tạm thời bị tạm dừng.</div>}
        {reason && <div className="mt-1 text-xs">{reason}</div>}
      </div>
    );
  }

  if (status === "UNKNOWN") {
    return (
      <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        Đang kiểm tra tính toàn vẹn hồ sơ hoặc chưa có commitment trên blockchain.
      </div>
    );
  }

  return null;
}

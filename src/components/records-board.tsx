"use client";

import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrashCan,
  faPaperPlane,
  faPenNib,
  faBan,
  faLock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

type Org = {
  id: string;
  role: string;
  fullName: string;
  organizationName: string | null;
  organizationCode: string | null;
};

export type BoardRecord = {
  id: string;
  childName: string | null;
  childImage: string | null;
  situation: string | null;
  goalLimit: number | string;
  bankAccountNumber: string | null;
  status: string;
  schoolId: string | null;
  localAuthId: string | null;
  schoolSignature: string | null;
  localAuthSignature: string | null;
  recordRejectedReason: string | null;
  school?: { organizationName: string | null; organizationCode: string | null } | null;
  localAuth?: { organizationName: string | null; organizationCode: string | null } | null;
};

type Role = "ADMIN" | "SCHOOL" | "LOCAL_AUTH";

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800",
  RECEIVING: "bg-blue-100 text-blue-800",
  WAITING_FOR_REPORT: "bg-violet-100 text-violet-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
};

function fmt(n: number | string) {
  return Number(n || 0).toLocaleString("vi-VN") + " đ";
}

export default function RecordsBoard({ role }: { role: Role }) {
  const [records, setRecords] = useState<BoardRecord[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BoardRecord | null>(null);

  const [childName, setChildName] = useState("");
  const [situation, setSituation] = useState("");
  const [goalLimit, setGoalLimit] = useState("");
  const [bank, setBank] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [localAuthId, setLocalAuthId] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/records");
      if (!res.ok) throw new Error("Không tải được danh sách");
      const data = await res.json();
      setRecords(data.records ?? []);
      if (role === "ADMIN") {
        const orgRes = await fetch("/api/orgs");
        if (orgRes.ok) setOrgs((await orgRes.json()).orgs ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không rõ");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = (r?: BoardRecord | null) => {
    setEditing(r ?? null);
    setChildName(r?.childName ?? "");
    setSituation(r?.situation ?? "");
    setGoalLimit(r ? String(r.goalLimit) : "");
    setBank(r?.bankAccountNumber ?? "");
    setSchoolId(r?.schoolId ?? "");
    setLocalAuthId(r?.localAuthId ?? "");
  };
  const openCreate = () => {
    resetForm(null);
    setModalOpen(true);
  };
  const openEdit = (r: BoardRecord) => {
    if (r.status !== "DRAFT") return;
    resetForm(r);
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      childName,
      situation,
      goalLimit: Number(goalLimit || 0),
      bankAccountNumber: bank || undefined,
      schoolId: schoolId || null,
      localAuthId: localAuthId || null,
    };
    const res = editing
      ? await fetch(`/api/records/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    if (res.ok) {
      setModalOpen(false);
      showToast(editing ? "Đã cập nhật hồ sơ" : "Đã tạo hồ sơ (DRAFT)");
      load();
    } else {
      const data = await res.json().catch(() => null);
      showToast("Lỗi: " + (data?.error ?? res.status));
    }
  };

  const remove = async (r: BoardRecord) => {
    if (!window.confirm(`Xóa hồ sơ ${r.id}?`)) return;
    const res = await fetch(`/api/records/${r.id}`, { method: "DELETE" });
    showToast(res.ok ? "Đã xóa hồ sơ" : "Không xóa được");
    load();
  };

  const submitForApproval = async (r: BoardRecord) => {
    const res = await fetch(`/api/records/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit" }),
    });
    showToast(res.ok ? "Đã gửi duyệt (PENDING_APPROVAL)" : "Không gửi được");
    load();
  };

  const sign = async (r: BoardRecord) => {
    const res = await fetch(`/api/records/${r.id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sign" }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      showToast(
        data?.bothSigned
          ? "Đã ký đủ → hồ sơ chuyển RECEIVING"
          : "Đã ký hồ sơ",
      );
    } else {
      showToast("Lỗi: " + (data?.error ?? res.status));
    }
    load();
  };

  const reject = async (r: BoardRecord) => {
    const reason = window.prompt("Lý do từ chối (bắt buộc):");
    if (reason === null) return;
    if (!reason.trim()) {
      showToast("Từ chối phải có lý do");
      return;
    }
    const res = await fetch(`/api/records/${r.id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason: reason.trim() }),
    });
    showToast(res.ok ? "Đã từ chối, hồ sơ về DRAFT" : "Không từ chối được");
    load();
  };

  const minePending = (r: BoardRecord) => {
    if (r.status !== "PENDING_APPROVAL") return false;
    return role === "SCHOOL" ? !r.schoolSignature : !r.localAuthSignature;
  };

  const schoolOptions = orgs.filter((o) => o.role === "SCHOOL");
  const laOptions = orgs.filter((o) => o.role === "LOCAL_AUTH");

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-bold text-slate-700">Danh sách hồ sơ</h2>
        {role === "ADMIN" && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm rounded-lg px-3 py-1.5 font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm hồ sơ
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500 mt-4">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="py-2">Mã</th>
                <th>Trẻ (L2)</th>
                <th>Hoàn cảnh</th>
                <th>Mục tiêu</th>
                <th>Trạng thái</th>
                <th>Đơn vị</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 align-top">
                  <td className="py-2 font-mono text-xs">{r.id.slice(0, 8)}</td>
                  <td>{r.childName ?? <span className="italic text-slate-400 inline-flex items-center gap-1"><FontAwesomeIcon icon={faLock} /> L2 ẩn</span>}</td>
                  <td className="max-w-[220px] text-slate-600">
                    {r.situation ?? "—"}
                    {r.recordRejectedReason && (
                      <div className="text-[11px] text-red-600 mt-1">Lý do từ chối: {r.recordRejectedReason}</div>
                    )}
                  </td>
                  <td>{fmt(r.goalLimit)}</td>
                  <td>
                    <span className={`inline-block text-[11px] font-bold rounded-full px-2 py-0.5 ${STATUS_STYLE[r.status] ?? "bg-slate-100"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600">
                    {r.school?.organizationName ?? "—"}
                    <br />
                    {r.localAuth?.organizationName ?? "—"}
                  </td>
                  <td className="whitespace-nowrap">
                    {role === "ADMIN" ? (
                      <div className="flex gap-1">
                        <button title="Sửa (DRAFT)" disabled={r.status !== "DRAFT"} onClick={() => openEdit(r)} className="border rounded px-2 py-1 disabled:opacity-40"><FontAwesomeIcon icon={faPen} /></button>
                        <button title="Gửi duyệt" disabled={r.status !== "DRAFT"} onClick={() => submitForApproval(r)} className="border rounded px-2 py-1 disabled:opacity-40"><FontAwesomeIcon icon={faPaperPlane} /></button>
                        <button title="Xóa" onClick={() => remove(r)} className="border border-red-200 text-red-600 rounded px-2 py-1"><FontAwesomeIcon icon={faTrashCan} /></button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button title="Ký" disabled={!minePending(r)} onClick={() => sign(r)} className="border border-emerald-200 text-emerald-700 rounded px-2 py-1 text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1"><FontAwesomeIcon icon={faPenNib} /> Ký</button>
                        <button title="Từ chối" disabled={r.status !== "PENDING_APPROVAL"} onClick={() => reject(r)} className="border border-red-200 text-red-600 rounded px-2 py-1 text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1"><FontAwesomeIcon icon={faBan} /> Từ chối</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-slate-400 py-6">
                    Không có hồ sơ nào thuộc phạm vi của bạn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl p-5 shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="font-bold text-teal-800">{editing ? "Sửa hồ sơ" : "Thêm hồ sơ"}</h3>
            <form onSubmit={save} className="mt-3 space-y-2 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-600">Tên trẻ (L2) *</label>
                <input required value={childName} onChange={(e) => setChildName(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Nguyễn Văn Bé" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Hoàn cảnh (L1)</label>
                <textarea value={situation} onChange={(e) => setSituation(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Mồ côi mẹ..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Mục tiêu (VNĐ) *</label>
                <input required type="number" min={0} value={goalLimit} onChange={(e) => setGoalLimit(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="10000000" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Số tài khoản trường</label>
                <input value={bank} onChange={(e) => setBank(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="9704220000000001" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Trường</label>
                <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                  <option value="">— Chọn trường —</option>
                  {schoolOptions.map((o) => (
                    <option key={o.id} value={o.id}>{o.organizationName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">UBND xã</label>
                <select value={localAuthId} onChange={(e) => setLocalAuthId(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                  <option value="">— Chọn xã —</option>
                  {laOptions.map((o) => (
                    <option key={o.id} value={o.id}>{o.organizationName}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="border rounded-lg px-4 py-2 text-slate-600">Hủy</button>
                <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 font-semibold">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-sm rounded-lg px-4 py-2 max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}

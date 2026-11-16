export type RecordStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "RECEIVING"
  | "WAITING_FOR_REPORT"
  | "CLOSED";

const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  DRAFT: "Bản nháp",
  PENDING_APPROVAL: "Chờ phê duyệt",
  RECEIVING: "Đang nhận quyên góp",
  WAITING_FOR_REPORT: "Chờ báo cáo",
  CLOSED: "Đã hoàn tất",
};

/** Chuyển mã trạng thái lưu trong DB/API thành nhãn hiển thị tiếng Việt. */
export function getRecordStatusLabel(status: string): string {
  return RECORD_STATUS_LABELS[status as RecordStatus] ?? status;
}


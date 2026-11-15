type ProgressBarProps = {
  raised: number;
  goal: number;
  size?: "sm" | "lg";
};

export default function ProgressBar({ raised, goal, size = "sm" }: ProgressBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] leading-none text-stone-500 mb-1">
        <span>{raised.toLocaleString("vi-VN")} đ</span>
        <span>Mục tiêu {goal.toLocaleString("vi-VN")} đ</span>
      </div>
      <div
        className={`w-full rounded-full bg-stone-200 overflow-hidden ${size === "lg" ? "h-4" : "h-2.5"}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-[11px] text-amber-700 font-semibold mt-1">{pct}% đã quyên góp</div>
    </div>
  );
}

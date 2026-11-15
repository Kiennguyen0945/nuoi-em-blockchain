import Link from "next/link";
import PublicShell from "@/components/public-shell";
import ProgressBar from "@/components/progress-bar";
import { getPublicRecords, formatVND, shortCode } from "@/lib/public";

export const dynamic = "force-dynamic";

const AVATAR_COLORS = [
  "bg-emerald-600",
  "bg-orange-500",
  "bg-sky-600",
  "bg-rose-500",
  "bg-violet-600",
];

export default async function PublicRecordsPage() {
  const records = await getPublicRecords();

  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-teal-900">Những em đang chờ được giúp</h1>
            <p className="text-sm text-stone-500 mt-1">
              Hồ sơ đã được Nhà trường và UBND ký — ở trạng thái đang tiếp nhận.
            </p>
          </div>
          <Link href="/tra-cuu" className="text-sm font-semibold text-teal-800 hover:underline">
            Bạn đã quyên góp? Tra cứu →
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="mt-10 bg-white border border-stone-200 rounded-2xl p-8 text-center">
            <div className="text-4xl">🌙</div>
            <p className="mt-2 font-bold text-teal-900">Chưa có hồ sơ nào đang tiếp nhận</p>
            <p className="text-sm text-stone-500 mt-1">Hồ sơ sẽ xuất hiện khi Trường và UBND ký. Về sau ghé lại nhé.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((r, i) => {
              const goal = Number(r.goalLimit);
              const pct = goal > 0 ? Math.min(100, Math.round((r.raised / goal) * 100)) : 0;
              return (
                <Link
                  key={r.id}
                  href={`/ho-so/${r.id}`}
                  className="group bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {/* Ảnh placeholder — không dùng ảnh thật của trẻ */}
                  <div
                    className={`h-28 flex items-center justify-center text-5xl text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  >
                    🧒
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-stone-400">#{shortCode(r.id)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                        Đang nhận
                      </span>
                    </div>
                    <div className="mt-2 font-bold text-teal-900 leading-snug line-clamp-2 min-h-[2.5em]">
                      {r.situation ?? "Hoàn cảnh khó khăn"}
                    </div>
                    <div className="mt-2 text-[11px] text-stone-500">
                      🏫 {r.school?.organizationName ?? "—"} · 🏛️ {r.localAuth?.organizationName ?? "—"}
                    </div>
                    <div className="mt-3">
                      <ProgressBar raised={r.raised} goal={goal} size="sm" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{r._count.donations} lượt quyên góp</span>
                      <span className="font-bold text-amber-700">{pct}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-stone-400">
          Mỗi hồ sơ chỉ chuyển sang trạng thái “Đang nhận” khi có đủ chữ ký của Nhà trường và UBND xã.
        </p>
      </div>
    </PublicShell>
  );
}

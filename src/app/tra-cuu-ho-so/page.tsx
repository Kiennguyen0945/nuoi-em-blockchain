"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicShell from "@/components/public-shell";
import ProgressBar from "@/components/progress-bar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowRight,
  faSchool,
  faLandmark,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type LookupView = {
  id: string;
  situation: string | null;
  status: string;
  goalLimit: number;
  raised: number;
  donationCount: number;
  school?: { organizationName: string | null } | null;
  localAuth?: { organizationName: string | null } | null;
};

export default function TraCuuHoSoPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LookupView[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function doSearch() {
    if (query.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/public/lookup?q=${encodeURIComponent(query.trim())}`,
      );
      const data = await res.json();
      setResults(data.records ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl sm:text-3xl font-black text-teal-900">
          Tra cứu hồ sơ theo mã
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Dán mã hồ sơ (ví dụ <code className="bg-stone-100 rounded px-1">HSx9Kq2A</code>), hoặc vài
          từ trong hoàn cảnh để tìm. Kết quả giống như bạn bấm trực tiếp vào hồ sơ.
        </p>

        {/* Ô tìm kiếm */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
          }}
          className="mt-5 flex gap-2"
        >
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập mã hồ sơ hoặc từ khóa..."
              className="w-full border border-stone-200 rounded-xl pl-11 pr-10 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Xóa"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white rounded-xl px-5 py-3 text-sm font-bold"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Tìm"}
          </button>
        </form>

        {/* Kết quả */}
        <div className="mt-6">
          {!searched ? (
            <p className="text-center text-sm text-stone-400 py-8">
              Nhập mã hồ sơ để bắt đầu.
            </p>
          ) : loading ? (
            <p className="text-center text-sm text-stone-500 py-8">
              Đang tìm...
            </p>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl">🔎</div>
              <p className="mt-2 font-bold text-teal-900">Không tìm thấy hồ sơ</p>
              <p className="text-sm text-stone-500 mt-1">
                Hãy kiểm tra lại mã: cần tối thiểu 2 ký tự, không phân biệt hoa thường/dấu gạch.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3">
              {results.map((r) => {
                const goal = r.goalLimit;
                const pct = goal > 0 ? Math.min(100, Math.round((r.raised / goal) * 100)) : 0;
                return (
                  <li key={r.id}>
                    <Link
                      href={`/ho-so/${r.id}`}
                      className="block bg-white border border-stone-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono font-bold text-stone-400">
                            #{r.id.replaceAll("-", "").slice(0, 8).toUpperCase()}
                          </div>
                          <p className="mt-1 font-bold text-teal-900 line-clamp-2">
                            {r.situation ?? "Hoàn cảnh khó khăn"}
                          </p>
                          <p className="mt-1 text-[11px] text-stone-500">
                            <FontAwesomeIcon icon={faSchool} className="mr-1" />
                            {r.school?.organizationName ?? "—"}
                            {"  ·  "}
                            <FontAwesomeIcon icon={faLandmark} className="mr-1" />
                            {r.localAuth?.organizationName ?? "—"}
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-teal-700 shrink-0 self-center"
                        />
                      </div>
                      <div className="mt-3">
                        <ProgressBar raised={r.raised} goal={goal} size="sm" />
                        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                          <span>{r.donationCount} lượt quyên góp</span>
                          <span className="font-bold text-amber-700">{pct}%</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </PublicShell>
  );
}

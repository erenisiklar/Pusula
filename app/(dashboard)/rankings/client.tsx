"use client";

import { useState, useMemo } from "react";
import type { University, UniversityRanking } from "@/types";
import { Trophy, Search, ArrowUpDown, Filter, Globe } from "lucide-react";
import { COUNTRIES as countries } from "@/lib/constants";

type RankingSource = "Tümü" | "QS Europe" | "FT";

interface RankedEntry {
  university: University;
  ranking: UniversityRanking;
}

export default function RankingsClient({ universities }: { universities: University[] }) {
  const [source, setSource] = useState<RankingSource>("QS Europe");
  const [selectedCountry, setSelectedCountry] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const entries = useMemo((): RankedEntry[] => {
    const result: RankedEntry[] = [];
    for (const uni of universities) {
      if (!uni.rankings) continue;
      for (const r of uni.rankings) {
        if (source !== "Tümü" && r.source !== source) continue;
        if (selectedCountry !== "Tümü" && uni.country !== selectedCountry) continue;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !uni.name.toLowerCase().includes(q) &&
            !uni.program.toLowerCase().includes(q) &&
            !uni.city.toLowerCase().includes(q)
          ) continue;
        }
        result.push({ university: uni, ranking: r });
      }
    }
    // Deduplicate: keep only best rank per university per source
    const seen = new Map<string, RankedEntry>();
    for (const entry of result) {
      const key = `${entry.university.name}-${entry.ranking.source}`;
      const existing = seen.get(key);
      if (!existing || entry.ranking.rank < existing.ranking.rank) {
        seen.set(key, entry);
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.ranking.rank - b.ranking.rank);
  }, [source, selectedCountry, searchQuery]);

  const countBySource = useMemo(() => {
    const ftSet = new Set<string>();
    const qsSet = new Set<string>();
    for (const uni of universities) {
      if (!uni.rankings) continue;
      for (const r of uni.rankings) {
        if (r.source === "FT") ftSet.add(uni.name);
        if (r.source === "QS Europe") qsSet.add(uni.name);
      }
    }
    return { ft: ftSet.size, qs: qsSet.size };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Üniversite Sıralamaları
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        QS Europe ve Financial Times sıralamalarına göre Avrupa üniversiteleri
      </p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-xl px-5 py-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4" style={{ color: "var(--gold)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>QS Europe 2025</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--gold-light)" }}>
            {countBySource.qs}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>üniversite sıralanmış</div>
        </div>
        <div
          className="rounded-xl px-5 py-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4" style={{ color: "var(--blue)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Financial Times 2025</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--blue-light)" }}>
            {countBySource.ft}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>üniversite sıralanmış</div>
        </div>
        <div
          className="rounded-xl px-5 py-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4" style={{ color: "var(--success)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Toplam Ülke</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--success)" }}>
            {new Set(universities.map((u) => u.country)).size}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Avrupa ülkesi</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--muted)" }}
          />
          <input
            type="text"
            placeholder="Üniversite, program veya şehir ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as RankingSource)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          <option value="QS Europe">QS Europe 2025</option>
          <option value="FT">Financial Times 2025</option>
          <option value="Tümü">Tüm Sıralamalar</option>
        </select>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3 text-xs font-medium"
          style={{
            gridTemplateColumns: "60px 1fr 140px 120px 100px 100px",
            color: "var(--muted)",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--surface2)",
          }}
        >
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sıra
          </div>
          <div>Üniversite</div>
          <div>Program</div>
          <div>Ülke</div>
          <div className="text-right">Kaynak</div>
          <div className="text-right">Ücret/yıl</div>
        </div>

        {/* Rows */}
        {entries.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--muted)" }}>
            Filtrelere uygun sıralama bulunamadı.
          </div>
        )}
        {entries.map((entry, idx) => {
          const { university: uni, ranking } = entry;
          const isTop10 = ranking.rank <= 10;
          const isTop50 = ranking.rank <= 50;

          return (
            <div
              key={`${uni.id}-${ranking.source}-${idx}`}
              className="grid px-5 py-3 items-center text-sm transition-colors hover:brightness-110"
              style={{
                gridTemplateColumns: "60px 1fr 140px 120px 100px 100px",
                borderBottom: "1px solid var(--border)",
                backgroundColor: isTop10
                  ? "rgba(245,158,11,0.04)"
                  : undefined,
              }}
            >
              {/* Rank */}
              <div className="flex items-center gap-1.5">
                {isTop10 && (
                  <Trophy className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
                )}
                <span
                  className="font-bold"
                  style={{
                    color: isTop10
                      ? "var(--gold-light)"
                      : isTop50
                      ? "var(--text)"
                      : "var(--muted)",
                  }}
                >
                  #{ranking.rank}
                </span>
              </div>

              {/* University name */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{uni.flag}</span>
                  <span className="font-medium truncate" style={{ color: "var(--text)" }}>
                    {uni.name}
                  </span>
                </div>
              </div>

              {/* Program */}
              <div className="text-xs truncate" style={{ color: "var(--muted)" }}>
                {uni.program}
              </div>

              {/* Country */}
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {uni.city}, {uni.country}
              </div>

              {/* Source badge */}
              <div className="text-right">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{
                    backgroundColor:
                      ranking.source === "FT"
                        ? "var(--blue-bg)"
                        : "var(--gold-bg)",
                    border: `1px solid ${
                      ranking.source === "FT"
                        ? "var(--blue-border)"
                        : "var(--gold-border)"
                    }`,
                    color:
                      ranking.source === "FT"
                        ? "var(--blue-light)"
                        : "var(--gold-light)",
                  }}
                >
                  {ranking.source}
                </span>
              </div>

              {/* Tuition */}
              <div className="text-right text-xs font-medium" style={{ color: "var(--text)" }}>
                {uni.tuitionEUR === 0
                  ? "Ücretsiz"
                  : `€${uni.tuitionEUR.toLocaleString()}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Count */}
      <div className="mt-4 text-xs text-center" style={{ color: "var(--muted)" }}>
        {entries.length} sonuç gösteriliyor
      </div>
    </div>
  );
}

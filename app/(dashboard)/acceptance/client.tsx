"use client";

import { useState, useMemo } from "react";
import { Search, Users, TrendingUp, Award, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { AcceptanceRow } from "@/lib/supabase/queries";

type Difficulty = "Çok Rekabetçi" | "Rekabetçi" | "Orta" | "Erişilebilir";

function getDifficulty(rate: number): Difficulty {
  if (rate < 15) return "Çok Rekabetçi";
  if (rate < 30) return "Rekabetçi";
  if (rate < 45) return "Orta";
  return "Erişilebilir";
}

const difficultyConfig: Record<Difficulty, { bg: string; border: string; text: string; bar: string }> = {
  "Çok Rekabetçi": { bg: "var(--danger-bg)",  border: "rgba(239,68,68,0.25)",    text: "var(--danger)",     bar: "var(--danger)" },
  "Rekabetçi":     { bg: "var(--gold-bg)",     border: "var(--gold-border)",      text: "var(--gold-light)", bar: "var(--gold)" },
  "Orta":          { bg: "var(--blue-bg)",     border: "var(--blue-border)",      text: "var(--blue-light)", bar: "var(--blue)" },
  "Erişilebilir":  { bg: "var(--success-bg)",  border: "rgba(34,197,94,0.25)",    text: "var(--success)",    bar: "var(--success)" },
};

interface EnrichedEntry extends AcceptanceRow {
  difficulty: Difficulty;
  accepted: number;
}

function TrendBadge({ trend }: { trend: number }) {
  if (trend === 0) {
    return (
      <span className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>
        <Minus className="w-3 h-3" /> Sabit
      </span>
    );
  }
  const isUp = trend > 0;
  return (
    <span className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: isUp ? "var(--success)" : "var(--danger)" }}>
      {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {isUp ? "+" : ""}{trend}% geçen yıla göre
    </span>
  );
}

const countries = ["Tümü", "Almanya", "Hollanda", "İtalya", "Fransa", "İspanya", "İsveç"];
type SortKey = "rate-asc" | "rate-desc" | "applicants-desc" | "gpa-desc";

export default function AcceptanceClient({ stats }: { stats: AcceptanceRow[] }) {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Tümü");
  const [sortBy, setSortBy] = useState<SortKey>("rate-asc");

  const enriched = useMemo((): EnrichedEntry[] =>
    stats.map((d: AcceptanceRow) => ({
      ...d,
      difficulty: getDifficulty(d.acceptanceRate),
      accepted: Math.round((d.acceptanceRate / 100) * d.totalApplicants),
    })),
    [stats]
  );

  const filtered = useMemo((): EnrichedEntry[] => {
    let list = enriched;
    if (selectedCountry !== "Tümü") {
      list = list.filter((d: EnrichedEntry) => d.university.country === selectedCountry);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((d: EnrichedEntry) =>
        d.university.name.toLowerCase().includes(q) ||
        d.university.program.toLowerCase().includes(q) ||
        d.university.city.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a: EnrichedEntry, b: EnrichedEntry) => {
      if (sortBy === "rate-asc") return a.acceptanceRate - b.acceptanceRate;
      if (sortBy === "rate-desc") return b.acceptanceRate - a.acceptanceRate;
      if (sortBy === "applicants-desc") return b.totalApplicants - a.totalApplicants;
      if (sortBy === "gpa-desc") return b.avgGPA - a.avgGPA;
      return 0;
    });
  }, [enriched, selectedCountry, search, sortBy]);

  const avgRate = enriched.length
    ? Math.round(enriched.reduce((s: number, d: EnrichedEntry) => s + d.acceptanceRate, 0) / enriched.length)
    : 0;
  const mostCompetitive = enriched.length
    ? enriched.reduce((a: EnrichedEntry, b: EnrichedEntry) => a.acceptanceRate < b.acceptanceRate ? a : b)
    : null;
  const mostAccessible = enriched.length
    ? enriched.reduce((a: EnrichedEntry, b: EnrichedEntry) => a.acceptanceRate > b.acceptanceRate ? a : b)
    : null;
  const totalApplicants = enriched.reduce((s: number, d: EnrichedEntry) => s + d.totalApplicants, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Kabul Oranları
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Üniversitelerin geçmiş yıl kabul oranları ve başvuru istatistikleri
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--blue)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Ortalama Kabul Oranı</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--blue-light)" }}>%{avgRate}</div>
        </div>

        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4" style={{ color: "var(--danger)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>En Rekabetçi</span>
          </div>
          {mostCompetitive && <>
            <div className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{mostCompetitive.university.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--danger)" }}>%{mostCompetitive.acceptanceRate} kabul</div>
          </>}
        </div>

        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4" style={{ color: "var(--success)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>En Erişilebilir</span>
          </div>
          {mostAccessible && <>
            <div className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{mostAccessible.university.name}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--success)" }}>%{mostAccessible.acceptanceRate} kabul</div>
          </>}
        </div>

        <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: "var(--gold)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Toplam Başvuran</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--gold-light)" }}>
            {(totalApplicants / 1000).toFixed(0)}K+
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Üniversite veya program ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <option value="rate-asc">En Rekabetçi</option>
          <option value="rate-desc">En Erişilebilir</option>
          <option value="applicants-desc">En Fazla Başvuran</option>
          <option value="gpa-desc">En Yüksek Ort. GPA</option>
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--muted)" }}>Filtrelere uygun üniversite bulunamadı.</div>
        )}
        {filtered.map((d: EnrichedEntry) => {
          const cfg = difficultyConfig[d.difficulty];
          return (
            <div key={d.universityId} className="rounded-xl px-5 py-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{d.university.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{d.university.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0"
                      style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
                      {d.difficulty}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{d.university.program} · {d.university.city}</div>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface2)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${d.acceptanceRate}%`, backgroundColor: cfg.bar }} />
                    </div>
                    <span className="text-xs font-bold w-10 text-right" style={{ color: cfg.text }}>%{d.acceptanceRate}</span>
                  </div>
                  <div className="mt-1.5"><TrendBadge trend={d.trend} /></div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{d.totalApplicants.toLocaleString()}</div>
                      <div className="text-[11px]" style={{ color: "var(--muted)" }}>başvuran</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold" style={{ color: "var(--success)" }}>{d.accepted.toLocaleString()}</div>
                      <div className="text-[11px]" style={{ color: "var(--muted)" }}>kabul</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{d.avgGPA.toFixed(1)}</div>
                      <div className="text-[11px]" style={{ color: "var(--muted)" }}>ort. GPA</div>
                    </div>
                  </div>
                  <Link href="/schools"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 flex-shrink-0"
                    style={{ backgroundColor: "var(--blue-bg)", border: "1px solid var(--blue-border)", color: "var(--blue-light)" }}>
                    <ExternalLink className="w-3.5 h-3.5" /> Eligibility
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg px-4 py-3 mt-6"
        style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
        <p className="text-xs" style={{ color: "var(--gold-light)" }}>
          Bu istatistikler tahmini geçmiş yıl verilerine dayanmaktadır. Kesin bilgi için üniversitelerin resmi web sitelerini kontrol edin.
        </p>
      </div>
    </div>
  );
}

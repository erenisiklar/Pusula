"use client";

import { useState, useMemo } from "react";
import { universities } from "@/lib/universities";
import { calculateEligibility, getStatusLabel } from "@/lib/eligibility";
import type { EligibilityResult, EligibilityStatus, StudentInput } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  Search,
  GraduationCap,
  Languages,
  Wallet,
  AlertTriangle,
  Trophy,
} from "lucide-react";

const countries = [
  "Tümü", "Almanya", "Hollanda", "İtalya", "Fransa", "İspanya", "İsveç",
  "İngiltere", "İsviçre", "Belçika", "Avusturya", "Danimarka", "Norveç",
  "Finlandiya", "Portekiz", "İrlanda", "Polonya", "Çekya", "Macaristan",
];
const departments = [
  "Tümü",
  "İşletme",
  "Bilgisayar Mühendisliği",
  "Makine Mühendisliği",
  "Elektrik-Elektronik Mühendisliği",
  "Mühendislik",
  "Mimarlık",
  "Ekonomi",
  "Siyaset Bilimi",
  "Uluslararası İlişkiler",
  "Tıp",
  "Hukuk",
];
const langCerts = ["IELTS", "TOEFL", "TestDaF"];

const statusConfig: Record<
  EligibilityStatus,
  { bg: string; border: string; text: string; color: string }
> = {
  eligible: {
    bg: "var(--success-bg)",
    border: "1px solid rgba(34,197,94,0.25)",
    text: "var(--success)",
    color: "var(--success)",
  },
  possible: {
    bg: "var(--blue-bg)",
    border: "1px solid var(--blue-border)",
    text: "var(--blue-light)",
    color: "var(--blue)",
  },
  reach: {
    bg: "var(--gold-bg)",
    border: "1px solid var(--gold-border)",
    text: "var(--gold-light)",
    color: "var(--gold)",
  },
  unlikely: {
    bg: "var(--danger-bg)",
    border: "1px solid rgba(239,68,68,0.25)",
    text: "var(--danger)",
    color: "var(--danger)",
  },
};

export default function SchoolsPage() {
  const [gpa, setGpa] = useState<number>(3.0);
  const [langCert, setLangCert] = useState<string>("IELTS");
  const [langScore, setLangScore] = useState<number>(6.5);
  const [budget, setBudget] = useState<number>(5000);
  const [selectedCountry, setSelectedCountry] = useState<string>("Tümü");
  const [selectedDept, setSelectedDept] = useState<string>("Tümü");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const studentInput: StudentInput = {
    gpa,
    languageCert: langCert,
    languageScore: langScore,
    budgetEUR: budget,
    targetCountries: selectedCountry === "Tümü" ? [] : [selectedCountry],
    targetDepartment: selectedDept,
  };

  const results = useMemo(() => {
    let filtered = universities;

    if (selectedCountry !== "Tümü") {
      filtered = filtered.filter((u) => u.country === selectedCountry);
    }
    if (selectedDept !== "Tümü") {
      filtered = filtered.filter((u) => u.department === selectedDept);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.program.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)
      );
    }

    return filtered
      .map((uni) => calculateEligibility(studentInput, uni))
      .sort((a, b) => b.score - a.score);
  }, [gpa, langCert, langScore, budget, selectedCountry, selectedDept, searchQuery]);

  const counts = useMemo(() => {
    const c = { eligible: 0, possible: 0, reach: 0, unlikely: 0 };
    results.forEach((r) => c[r.status]++);
    return c;
  }, [results]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Okul Bulucu
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        GPA ve dil puanınızı girerek uygun üniversiteleri keşfedin
      </p>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["eligible", "possible", "reach", "unlikely"] as EligibilityStatus[]).map((status) => {
          const cfg = statusConfig[status];
          return (
            <div
              key={status}
              className="rounded-lg px-4 py-3 text-center"
              style={{ backgroundColor: cfg.bg, border: cfg.border }}
            >
              <div className="text-2xl font-bold" style={{ color: cfg.text }}>
                {counts[status]}
              </div>
              <div className="text-xs font-medium" style={{ color: cfg.text, opacity: 0.8 }}>
                {getStatusLabel(status)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Left panel - filters */}
        <div
          className="w-72 flex-shrink-0 rounded-xl p-5 space-y-5 h-fit sticky top-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            Profilini Gir
          </h2>

          {/* GPA */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
              <GraduationCap className="w-3.5 h-3.5" />
              GPA (4.0 üzerinden)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={gpa}
              onChange={(e) => setGpa(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Language */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
              <Languages className="w-3.5 h-3.5" />
              Dil Sertifikası
            </label>
            <select
              value={langCert}
              onChange={(e) => setLangCert(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-2"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {langCerts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.5"
              min="0"
              max="9"
              value={langScore}
              onChange={(e) => setLangScore(parseFloat(e.target.value) || 0)}
              placeholder="Puan"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
              <Wallet className="w-3.5 h-3.5" />
              Yıllık Bütçe (EUR)
            </label>
            <input
              type="number"
              step="500"
              min="0"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted)" }}>
              Ülke
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted)" }}>
              Bölüm
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right panel - results */}
        <div className="flex-1 space-y-3">
          {/* Search */}
          <div className="relative mb-4">
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

          {results.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--muted)" }}>
              Filtrelere uygun üniversite bulunamadı.
            </div>
          )}

          {results.map((result) => (
            <UniversityCard
              key={result.university.id}
              result={result}
              isExpanded={expandedId === result.university.id}
              onToggle={() =>
                setExpandedId(expandedId === result.university.id ? null : result.university.id)
              }
            />
          ))}

          {/* Disclaimer */}
          <div
            className="flex items-start gap-2 rounded-lg px-4 py-3 mt-6"
            style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
            <p className="text-xs" style={{ color: "var(--gold-light)" }}>
              Bu sonuçlar tahminidir. Kesin bilgi için üniversitelerin resmi web sitelerini kontrol
              edin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UniversityCard({
  result,
  isExpanded,
  onToggle,
}: {
  result: EligibilityResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { university, score, status, breakdown } = result;
  const cfg = statusConfig[status];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-2xl">{university.flag}</span>
          <div className="min-w-0">
            <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              {university.name}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {university.program} · {university.city}, {university.country}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Ranking badges */}
          {university.rankings && university.rankings.length > 0 && (
            <div className="flex items-center gap-1.5">
              {university.rankings.map((r) => (
                <span
                  key={r.source}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--gold-bg)",
                    border: "1px solid var(--gold-border)",
                    color: "var(--gold-light)",
                  }}
                  title={`${r.source} European Business School Ranking ${r.year}`}
                >
                  <Trophy className="w-2.5 h-2.5" />
                  {r.source} #{r.rank}
                </span>
              ))}
            </div>
          )}

          {/* Score circle */}
          <div className="text-center">
            <div
              className="text-lg font-bold"
              style={{ color: cfg.color }}
            >
              {score}
            </div>
            <div className="text-[10px]" style={{ color: "var(--muted)" }}>
              /100
            </div>
          </div>

          {/* Badge */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: cfg.bg, color: cfg.text, border: cfg.border }}
          >
            {getStatusLabel(status)}
          </span>

          {/* Tuition */}
          <div className="text-right w-20">
            <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {university.tuitionEUR === 0 ? "Ücretsiz" : `€${university.tuitionEUR.toLocaleString()}`}
            </div>
            <div className="text-[10px]" style={{ color: "var(--muted)" }}>
              /yıl
            </div>
          </div>

          {isExpanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "var(--muted)" }} />
          )}
        </div>
      </div>

      {isExpanded && (
        <div
          className="px-5 pb-4 pt-2 space-y-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="grid grid-cols-3 gap-3">
            <DetailBox
              label="GPA"
              score={breakdown.gpaScore}
              detail={breakdown.gpaDetail}
              maxScore={25}
            />
            <DetailBox
              label="Dil"
              score={breakdown.languageScore}
              detail={breakdown.languageDetail}
              maxScore={25}
            />
            <DetailBox
              label="Bütçe"
              score={breakdown.budgetScore}
              detail={breakdown.budgetDetail}
              maxScore={10}
            />
          </div>

          {university.rankings && university.rankings.length > 0 && (
            <div
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
            >
              <Trophy className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--gold)" }} />
              <div className="flex gap-4 text-xs">
                {university.rankings.map((r) => (
                  <span key={r.source} style={{ color: "var(--gold-light)" }}>
                    {r.source === "FT" ? "Financial Times" : "QS"} Avrupa Sıralaması:{" "}
                    <strong style={{ color: "var(--white)" }}>#{r.rank}</strong>
                    <span style={{ color: "var(--gold)", opacity: 0.7 }}> ({r.year})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
            <span>
              Gerekli GPA: <strong style={{ color: "var(--text)" }}>{university.requiredGPA}/100</strong>
            </span>
            <span>
              Dil: <strong style={{ color: "var(--text)" }}>{university.requiredLanguage} {university.requiredLanguageScore}</strong>
            </span>
            {university.deadline && (
              <span>
                Son başvuru: <strong style={{ color: "var(--text)" }}>{university.deadline}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailBox({
  label,
  score,
  detail,
  maxScore,
}: {
  label: string;
  score: number;
  detail: string;
  maxScore: number;
}) {
  const isPositive = score > 0;
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ backgroundColor: "var(--surface2)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span
          className="text-xs font-bold"
          style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
        >
          {score > 0 ? "+" : ""}
          {score}
        </span>
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
        {detail}
      </p>
    </div>
  );
}

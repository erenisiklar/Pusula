"use client";

import { useMemo } from "react";
import { School, FileText, Calendar, CheckCircle, ArrowRight, GraduationCap, Target, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/lib/profile-context";
import { calculateEligibility } from "@/lib/eligibility";
import type { University, EligibilityStatus } from "@/types";

interface DashboardProps {
  universities: University[];
  totalPrograms: number;
  totalCountries: number;
  freePrograms: number;
  upcomingDeadlines: number;
}

const statusLabels: Record<EligibilityStatus, string> = {
  eligible: "Uygun",
  possible: "Olası",
  reach: "Zor",
  unlikely: "Düşük İhtimal",
};

const statusColors: Record<EligibilityStatus, string> = {
  eligible: "var(--success)",
  possible: "var(--blue)",
  reach: "var(--gold)",
  unlikely: "var(--danger)",
};

const statusBgs: Record<EligibilityStatus, string> = {
  eligible: "var(--success-bg)",
  possible: "var(--blue-bg)",
  reach: "var(--gold-bg)",
  unlikely: "var(--danger-bg)",
};

export default function DashboardClient({
  universities,
  totalPrograms,
  totalCountries,
  freePrograms,
  upcomingDeadlines,
}: DashboardProps) {
  const { profile } = useProfile();

  // Calculate eligibility for all universities based on profile
  const eligibilityResults = useMemo(() => {
    if (!profile) return [];
    const input = {
      gpa: profile.gpa,
      languageCert: profile.languageCert || null,
      languageScore: profile.languageScore || null,
      budgetEUR: profile.budgetEUR,
      targetCountries: profile.targetCountries,
      targetDepartments: profile.targetDepartments,
    };
    return universities
      .map((u) => calculateEligibility(input, u))
      .sort((a, b) => b.score - a.score);
  }, [universities, profile]);

  const eligibleCount = eligibilityResults.filter((r) => r.status === "eligible").length;
  const possibleCount = eligibilityResults.filter((r) => r.status === "possible").length;
  const reachCount = eligibilityResults.filter((r) => r.status === "reach").length;

  // Top 5 best-matching universities — filtered by profile preferences
  const topMatches = useMemo(() => {
    if (!profile) return [];
    const filtered = eligibilityResults.filter((r) => {
      // Filter by target countries
      if (profile.targetCountries.length > 0 && !profile.targetCountries.includes(r.university.country)) {
        return false;
      }
      // Filter by target departments (skip if none specified)
      if (profile.targetDepartments.length > 0 && !profile.targetDepartments.includes(r.university.department)) {
        return false;
      }
      return true;
    });
    return filtered.slice(0, 5);
  }, [eligibilityResults, profile]);

  // Progress calculation
  const progressSteps = [
    profile !== null, // Profile completed
    eligibleCount > 0, // Has eligible schools
    false, // Motivation letter (TODO: track)
    false, // CV created (TODO: track)
    false, // Calendar checked (TODO: track)
  ];
  const progress = Math.round((progressSteps.filter(Boolean).length / progressSteps.length) * 100);

  const todos = [
    { text: "Profilini oluştur", done: profile !== null, href: "/onboarding" },
    { text: "Uygun programları keşfet", done: eligibleCount > 0, href: "/schools" },
    { text: "Motivasyon mektubu oluştur", done: false, href: "/motivasyon" },
    { text: "Başvuru takvimini kontrol et", done: false, href: "/takvim" },
    { text: "CV'ni hazırla", done: false, href: "/cv" },
  ];

  const stats = profile
    ? [
        { label: "Uygun Program", value: String(eligibleCount), icon: CheckCircle, color: "var(--success)" },
        { label: "Olası Program", value: String(possibleCount), icon: TrendingUp, color: "var(--blue)" },
        { label: "Yaklaşan Deadline", value: String(upcomingDeadlines), icon: Calendar, color: "var(--danger)" },
        { label: "Ücretsiz Program", value: String(freePrograms), icon: GraduationCap, color: "var(--gold)" },
      ]
    : [
        { label: "Lisans Programı", value: String(totalPrograms), icon: School, color: "var(--blue)" },
        { label: "Ülke", value: String(totalCountries), icon: CheckCircle, color: "var(--success)" },
        { label: "Yaklaşan Deadline", value: String(upcomingDeadlines), icon: Calendar, color: "var(--danger)" },
        { label: "Ücretsiz Program", value: String(freePrograms), icon: GraduationCap, color: "var(--gold)" },
      ];

  return (
    <div>
      {/* Hero */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #0f1d3d 0%, #1e3a6e 100%)",
        }}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#ffffff" }}>
          {profile ? `Merhaba, ${profile.fullName.split(" ")[0]}!` : "Hos geldin!"}
        </h1>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
          {profile
            ? `${eligibleCount} programa uygunsun, ${possibleCount} program da olası. Hadi başvuru hazırlıklarına başlayalım.`
            : "Liseden sonra Avrupa'da lisans okumak icin dogru yerdesin."}
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #3b82f6, var(--gold))",
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            %{progress}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl px-5 py-4 animate-float-up"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {/* Top matches — only if profile exists */}
          {profile && topMatches.length > 0 && (
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                  <Target className="w-4 h-4 inline-block mr-1.5 -mt-0.5" style={{ color: "var(--blue)" }} />
                  Sana En Uygun Programlar
                </h2>
                <Link
                  href="/schools"
                  className="text-[11px] font-medium hover:opacity-80"
                  style={{ color: "var(--blue)" }}
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="space-y-2">
                {topMatches.map((result) => (
                  <div
                    key={result.university.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                        {result.university.flag} {result.university.name}
                      </div>
                      <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                        {result.university.program} — {result.university.city}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: statusBgs[result.status],
                          color: statusColors[result.status],
                        }}
                      >
                        {result.score}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: statusColors[result.status] }}
                      >
                        {statusLabels[result.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Todo list */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
              Yapılacaklar
            </h2>
            <div className="space-y-2">
              {todos.map((todo) => (
                <Link
                  key={todo.text}
                  href={todo.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: todo.done ? "var(--success)" : "var(--border)",
                        backgroundColor: todo.done ? "var(--success)" : "transparent",
                      }}
                    >
                      {todo.done && <CheckCircle className="w-3 h-3" style={{ color: "#fff" }} />}
                    </div>
                    <span
                      className="text-sm"
                      style={{
                        color: todo.done ? "var(--muted)" : "var(--text)",
                        textDecoration: todo.done ? "line-through" : "none",
                      }}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          {/* Eligibility summary bars */}
          {profile && (
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
                Uygunluk Dağılımı
              </h2>
              {(["eligible", "possible", "reach", "unlikely"] as EligibilityStatus[]).map((status) => {
                const count = eligibilityResults.filter((r) => r.status === status).length;
                const pct = eligibilityResults.length > 0 ? (count / eligibilityResults.length) * 100 : 0;
                return (
                  <div key={status} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span style={{ color: statusColors[status] }} className="font-medium">
                        {statusLabels[status]}
                      </span>
                      <span style={{ color: "var(--muted)" }}>{count} program</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface2)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: statusColors[status] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick actions */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
              Hızlı Erişim
            </h2>
            <div className="space-y-3">
              <Link
                href="/schools"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--blue-bg)", border: "1px solid var(--blue-border)" }}
              >
                <School className="w-5 h-5" style={{ color: "var(--blue-light)" }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--blue-light)" }}>
                    Okul Bulucu
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {profile ? `${eligibleCount + possibleCount} uygun program seni bekliyor` : "GPA'nıza uygun okulları keşfedin"}
                  </div>
                </div>
              </Link>
              <Link
                href="/motivasyon"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "var(--gold-light)" }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--gold-light)" }}>
                    Motivasyon Mektubu
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    AI ile mektup oluşturun
                  </div>
                </div>
              </Link>
              <Link
                href="/cv"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--success-bg)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: "var(--success)" }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--success)" }}>
                    CV Oluşturucu
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    AI ile CV&apos;nizi optimize edin
                  </div>
                </div>
              </Link>
              <Link
                href="/takvim"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--danger-bg)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <Calendar className="w-5 h-5" style={{ color: "var(--danger)" }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--danger)" }}>
                    Başvuru Takvimi
                  </div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    Deadline&apos;ları takip edin
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Bu tahmindir, üniversitenin resmi sitesini kontrol edin. Uygunluk skorları yönlendirici niteliktedir, kesin kabul garantisi vermez.
        </p>
      </div>
    </div>
  );
}

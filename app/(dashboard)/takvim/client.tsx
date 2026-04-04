"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CalendarDays, Filter, Download, ExternalLink } from "lucide-react";
import type { University } from "@/types";

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const monthMap: Record<string, number> = {
  Ocak: 0, Şubat: 1, Mart: 2, Nisan: 3, Mayıs: 4, Haziran: 5,
  Temmuz: 6, Ağustos: 7, Eylül: 8, Ekim: 9, Kasım: 10, Aralık: 11,
};

const COUNTRY_FILTERS = [
  { label: "Tümü", value: "all" },
  { label: "🇳🇱 Hollanda", value: "Hollanda" },
  { label: "🇩🇪 Almanya", value: "Almanya" },
  { label: "🇮🇹 İtalya", value: "İtalya" },
  { label: "🇬🇧 İngiltere", value: "İngiltere" },
  { label: "🇫🇷 Fransa", value: "Fransa" },
  { label: "🇸🇪 İsveç", value: "İsveç" },
  { label: "🇩🇰 Danimarka", value: "Danimarka" },
  { label: "🇫🇮 Finlandiya", value: "Finlandiya" },
  { label: "🇮🇪 İrlanda", value: "İrlanda" },
  { label: "🇧🇪 Belçika", value: "Belçika" },
  { label: "🇪🇸 İspanya", value: "İspanya" },
  { label: "🇵🇹 Portekiz", value: "Portekiz" },
  { label: "🇨🇭 İsviçre", value: "İsviçre" },
  { label: "🇳🇴 Norveç", value: "Norveç" },
  { label: "🇦🇹 Avusturya", value: "Avusturya" },
];

interface DeadlineEntry {
  university: University;
  month: number;
  day: number | null;
  label?: string;
  sortKey: number; // month * 100 + (day ?? 99)
}

function parseDeadlines(uni: University): DeadlineEntry[] {
  if (!uni.deadline) return [];
  // Skip rolling deadlines from calendar view
  if (uni.deadline.toLowerCase().startsWith("rolling")) return [];
  const results: DeadlineEntry[] = [];

  const parts = uni.deadline.split(",").map((p) => p.trim());

  for (const part of parts) {
    const labelMatch = part.match(/\(([^)]+)\)/);
    const label = labelMatch ? labelMatch[1] : undefined;
    const clean = part.replace(/\([^)]+\)/, "").trim();

    // "15 Ocak" or "1 Nisan" format
    const dayMonthMatch = clean.match(/^(\d+)\s+(\S+)$/);
    if (dayMonthMatch) {
      const day = parseInt(dayMonthMatch[1]);
      const month = monthMap[dayMonthMatch[2]];
      if (month !== undefined) {
        results.push({ university: uni, month, day, label, sortKey: month * 100 + day });
      }
      continue;
    }

    // "Ocak" month-only format
    const month = monthMap[clean];
    if (month !== undefined) {
      results.push({ university: uni, month, day: null, label, sortKey: month * 100 + 99 });
    }
  }

  return results;
}

function daysRemaining(today: Date, month: number, day: number | null): number | null {
  if (day === null) return null;
  const year = today.getFullYear();
  const deadlineDate = new Date(year, month, day);
  const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatCountdown(days: number | null): string | null {
  if (days === null) return null;
  if (days < 0) return "Geçti";
  if (days === 0) return "Bugün!";
  if (days === 1) return "Yarın!";
  if (days <= 7) return `${days} gün kaldı`;
  if (days <= 30) return `${Math.ceil(days / 7)} hafta kaldı`;
  return null;
}

function generateICS(deadlines: DeadlineEntry[], year: number): string {
  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pusula//Deadline Calendar//TR\nCALSCALE:GREGORIAN\n`;
  for (const d of deadlines) {
    if (d.day === null) continue;
    const m = String(d.month + 1).padStart(2, "0");
    const dy = String(d.day).padStart(2, "0");
    const uid = `${d.university.id}-${d.month}-${d.day}@pusula`;
    const summary = `${d.university.name} — ${d.university.program}${d.label ? ` (${d.label})` : ""}`;
    ics += `BEGIN:VEVENT\nDTSTART;VALUE=DATE:${year}${m}${dy}\nSUMMARY:${summary}\nDESCRIPTION:Son başvuru tarihi\\nProgram: ${d.university.program}\nUID:${uid}\nEND:VEVENT\n`;
  }
  ics += `END:VCALENDAR`;
  return ics;
}

export default function TakvimClient({ universities }: { universities: University[] }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [countryFilter, setCountryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredUniversities = useMemo(
    () => countryFilter === "all" ? universities : universities.filter((u) => u.country === countryFilter),
    [universities, countryFilter]
  );

  const allDeadlines = useMemo(
    () => filteredUniversities.flatMap(parseDeadlines).sort((a, b) => a.sortKey - b.sortKey),
    [filteredUniversities]
  );

  const monthDeadlines = useMemo(
    () => allDeadlines.filter((d) => d.month === currentMonth),
    [allDeadlines, currentMonth]
  );

  // Map from day number → deadline entries for current month
  const deadlineDays = useMemo(() => {
    const map: Record<number, DeadlineEntry[]> = {};
    monthDeadlines.forEach((d) => {
      if (d.day !== null) {
        if (!map[d.day]) map[d.day] = [];
        map[d.day].push(d);
      }
    });
    return map;
  }, [monthDeadlines]);

  // Month-only deadlines (no specific day)
  const monthOnlyDeadlines = useMemo(
    () => monthDeadlines.filter((d) => d.day === null),
    [monthDeadlines]
  );

  // Sidebar shows selected-day deadlines, or all month deadlines
  const sidebarDeadlines = useMemo(() => {
    if (selectedDay !== null && deadlineDays[selectedDay]) {
      return deadlineDays[selectedDay];
    }
    return monthDeadlines;
  }, [selectedDay, deadlineDays, monthDeadlines]);

  // Upcoming deadlines from today onward
  const todaySortKey = today.getMonth() * 100 + today.getDate();
  const upcomingDeadlines = useMemo(
    () => allDeadlines.filter((d) => d.sortKey >= todaySortKey).slice(0, 8),
    [allDeadlines, todaySortKey]
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  function prevMonth() {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    setSelectedDay(null);
  }
  function nextMonth() {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    setSelectedDay(null);
  }

  function handleExportICS() {
    const ics = generateICS(allDeadlines, currentYear);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pusula-deadlines.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Count unique countries in current filter results
  const activeCountries = useMemo(() => {
    const set = new Set(filteredUniversities.map((u) => u.country));
    return set.size;
  }, [filteredUniversities]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Başvuru Takvimi
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: countryFilter !== "all" ? "var(--blue-bg)" : "var(--surface2)",
              border: `1px solid ${countryFilter !== "all" ? "var(--blue-border)" : "var(--border)"}`,
              color: countryFilter !== "all" ? "var(--blue)" : "var(--muted)",
            }}
          >
            <Filter className="w-3.5 h-3.5" />
            {countryFilter !== "all" ? COUNTRY_FILTERS.find((f) => f.value === countryFilter)?.label : "Filtrele"}
          </button>
          <button
            onClick={handleExportICS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--gold-bg)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Takvime Aktar
          </button>
        </div>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        Üniversite başvuru tarihlerini takip edin
        {countryFilter !== "all" && (
          <span className="ml-2 text-[11px]" style={{ color: "var(--blue)" }}>
            · {filteredUniversities.length} program gösteriliyor
          </span>
        )}
      </p>

      {/* Country Filters */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-1.5 mb-4 p-3 rounded-xl"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {COUNTRY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setCountryFilter(f.value); setSelectedDay(null); }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: countryFilter === f.value ? "var(--blue-bg)" : "var(--surface2)",
                border: `1px solid ${countryFilter === f.value ? "var(--blue-border)" : "var(--border)"}`,
                color: countryFilter === f.value ? "var(--blue)" : "var(--muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div
          className="lg:col-span-2 rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--surface2)" }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "var(--muted)" }} />
            </button>
            <h2 className="font-semibold" style={{ color: "var(--text)" }}>
              {months[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--surface2)" }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: "var(--muted)" }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium py-2"
                style={{ color: "var(--muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: adjustedFirstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const deadlines = deadlineDays[day];
              const count = deadlines?.length || 0;
              const hasDeadline = count > 0;
              const isSelected = selectedDay === day;
              const isTodayDay = todayMonth === currentMonth && todayDate === day;
              const isPast = currentMonth < todayMonth || (currentMonth === todayMonth && day < todayDate);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="h-12 flex flex-col items-center justify-center rounded-lg text-sm relative transition-all cursor-pointer hover:opacity-80"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--blue)"
                      : isTodayDay
                      ? "var(--blue-bg)"
                      : hasDeadline
                      ? isPast ? "var(--surface2)" : "var(--danger-bg)"
                      : "transparent",
                    color: isSelected
                      ? "var(--white)"
                      : isPast && !isTodayDay
                      ? "var(--muted)"
                      : isTodayDay
                      ? "var(--blue-light)"
                      : "var(--text)",
                    border: isSelected
                      ? "1px solid var(--blue)"
                      : isTodayDay
                      ? "1px solid var(--blue-border)"
                      : "1px solid transparent",
                    opacity: isPast && !hasDeadline ? 0.4 : 1,
                  }}
                >
                  {day}
                  {hasDeadline && (
                    <div className="flex items-center gap-0.5 absolute bottom-1">
                      {count <= 3 ? (
                        Array.from({ length: count }).map((_, j) => (
                          <div
                            key={j}
                            className="w-1 h-1 rounded-full"
                            style={{
                              backgroundColor: isSelected ? "var(--white)" : isPast ? "var(--muted)" : "var(--danger)",
                            }}
                          />
                        ))
                      ) : (
                        <span
                          className="text-[8px] font-bold leading-none"
                          style={{ color: isSelected ? "var(--white)" : isPast ? "var(--muted)" : "var(--danger)" }}
                        >
                          {count}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Month-only deadlines banner */}
          {monthOnlyDeadlines.length > 0 && (
            <div
              className="mt-3 px-3 py-2 rounded-lg text-xs"
              style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
            >
              <span className="font-medium" style={{ color: "var(--gold)" }}>
                {months[currentMonth]} ayı içinde (gün belirtilmemiş):
              </span>
              <span style={{ color: "var(--text)" }}>
                {" "}{monthOnlyDeadlines.map((d) => d.university.name).join(", ")}
              </span>
            </div>
          )}

          {/* Legend */}
          <div
            className="flex items-center gap-5 mt-4 pt-3 text-xs"
            style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--danger)" }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--danger)" }} />
              </div>
              Deadline sayısı
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: "var(--blue-bg)",
                  border: "1px solid var(--blue-border)",
                }}
              />
              Bugün
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "var(--blue)" }}
              />
              Seçili gün
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ opacity: 0.4, backgroundColor: "var(--surface2)" }}
              />
              Geçmiş
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Month / selected day deadlines */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2
              className="font-semibold text-sm mb-3 flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <CalendarDays className="w-4 h-4" style={{ color: "var(--blue)" }} />
              {selectedDay !== null && deadlineDays[selectedDay]
                ? `${selectedDay} ${months[currentMonth]}`
                : `${months[currentMonth]} Deadline'ları`}
              {sidebarDeadlines.length > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto"
                  style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
                >
                  {sidebarDeadlines.length}
                </span>
              )}
            </h2>

            {sidebarDeadlines.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Bu {selectedDay !== null ? "gün" : "ay"} için deadline yok.
              </p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {sidebarDeadlines.map((d, idx) => {
                  const days = daysRemaining(today, d.month, d.day);
                  const countdown = formatCountdown(days);
                  const isPast = days !== null && days < 0;

                  return (
                    <Link
                      href={`/schools?highlight=${d.university.id}`}
                      key={`${d.university.id}-${idx}`}
                      className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-all hover:opacity-80 block"
                      style={{
                        backgroundColor: "var(--surface2)",
                        opacity: isPast ? 0.5 : 1,
                      }}
                    >
                      <span className="text-base flex-shrink-0">{d.university.flag}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span
                            className="text-xs font-medium truncate"
                            style={{ color: "var(--text)" }}
                          >
                            {d.university.name}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "var(--muted)", opacity: 0.5 }} />
                        </div>
                        <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                          {d.university.program}
                          {d.label ? ` · ${d.label}` : ""}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-[11px] font-medium"
                            style={{ color: isPast ? "var(--muted)" : "var(--gold)" }}
                          >
                            {d.day !== null
                              ? `${d.day} ${months[d.month]}`
                              : months[d.month]}
                          </span>
                          {countdown && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={{
                                backgroundColor: isPast
                                  ? "var(--danger-bg)"
                                  : days !== null && days <= 7
                                  ? "var(--danger-bg)"
                                  : days !== null && days <= 30
                                  ? "var(--gold-bg)"
                                  : "var(--success-bg)",
                                color: isPast
                                  ? "var(--danger)"
                                  : days !== null && days <= 7
                                  ? "var(--danger)"
                                  : days !== null && days <= 30
                                  ? "var(--gold)"
                                  : "var(--success)",
                              }}
                            >
                              {countdown}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming deadlines */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2
              className="font-semibold text-sm mb-3 flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <Clock className="w-4 h-4" style={{ color: "var(--danger)" }} />
              Yaklaşan Deadline&apos;lar
            </h2>
            <div className="space-y-2">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Yaklaşan deadline yok.
                </p>
              ) : (
                upcomingDeadlines.map((d, idx) => {
                  const days = daysRemaining(today, d.month, d.day);
                  const countdown = formatCountdown(days);
                  return (
                    <div
                      key={`upcoming-${d.university.id}-${idx}`}
                      className="px-3 py-2 rounded-lg text-xs"
                      style={{ backgroundColor: "var(--surface2)" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0">{d.university.flag}</span>
                          <span className="truncate" style={{ color: "var(--text)" }}>
                            {d.university.name}
                          </span>
                        </div>
                        <span
                          className="flex-shrink-0 ml-2 font-medium"
                          style={{ color: days !== null && days <= 7 ? "var(--danger)" : "var(--gold)" }}
                        >
                          {d.day !== null ? `${d.day} ${months[d.month]}` : months[d.month]}
                        </span>
                      </div>
                      {countdown && (
                        <div className="mt-1 text-[10px] font-medium" style={{
                          color: days !== null && days <= 7 ? "var(--danger)" : "var(--gold)",
                        }}>
                          {countdown}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs"
            style={{
              backgroundColor: "var(--gold-bg)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>
              Tarihler resmi kaynaklardan alınmıştır ancak yıllık değişiklik gösterebilir.
              Üniversitenin resmi sitesini mutlaka kontrol edin.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

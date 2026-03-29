"use client";

import { useState, useMemo } from "react";
import { universities } from "@/lib/universities";
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CalendarDays } from "lucide-react";
import type { University } from "@/types";

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const monthMap: Record<string, number> = {
  Ocak: 0, Şubat: 1, Mart: 2, Nisan: 3, Mayıs: 4, Haziran: 5,
  Temmuz: 6, Ağustos: 7, Eylül: 8, Ekim: 9, Kasım: 10, Aralık: 11,
};

interface DeadlineEntry {
  university: University;
  month: number;
  day: number | null;
  label?: string;
  sortKey: number; // month * 100 + (day ?? 99)
}

function parseDeadlines(uni: University): DeadlineEntry[] {
  if (!uni.deadline) return [];
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

export default function TakvimPage() {
  // Today: 2026-03-29
  const today = new Date(2026, 2, 29);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const allDeadlines = useMemo(
    () => universities.flatMap(parseDeadlines).sort((a, b) => a.sortKey - b.sortKey),
    []
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
    () => allDeadlines.filter((d) => d.sortKey >= todaySortKey).slice(0, 6),
    [allDeadlines, todaySortKey]
  );

  const daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();
  const firstDay = new Date(2026, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  function prevMonth() {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    setSelectedDay(null);
  }
  function nextMonth() {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    setSelectedDay(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Başvuru Takvimi
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Üniversite başvuru tarihlerini takip edin
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar */}
        <div
          className="col-span-2 rounded-xl p-5"
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
              {months[currentMonth]} 2026
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
              const hasDeadline = day in deadlineDays;
              const isSelected = selectedDay === day;
              const isTodayDay =
                today.getMonth() === currentMonth && today.getDate() === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="h-12 flex flex-col items-center justify-center rounded-lg text-sm relative transition-all"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--blue)"
                      : isTodayDay
                      ? "var(--blue-bg)"
                      : hasDeadline
                      ? "var(--surface2)"
                      : "transparent",
                    color: isSelected
                      ? "var(--white)"
                      : isTodayDay
                      ? "var(--blue-light)"
                      : "var(--text)",
                    border: isSelected
                      ? "1px solid var(--blue)"
                      : isTodayDay
                      ? "1px solid var(--blue-border)"
                      : "1px solid transparent",
                    cursor: hasDeadline ? "pointer" : "default",
                  }}
                >
                  {day}
                  {hasDeadline && (
                    <div
                      className="w-1.5 h-1.5 rounded-full absolute bottom-1.5"
                      style={{
                        backgroundColor: isSelected ? "var(--white)" : "var(--danger)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            className="flex items-center gap-5 mt-4 pt-3 text-xs"
            style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--danger)" }}
              />
              Deadline var
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
              {selectedDay !== null
                ? `${selectedDay} ${months[currentMonth]}`
                : `${months[currentMonth]} Deadline'ları`}
            </h2>

            {sidebarDeadlines.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Bu {selectedDay !== null ? "gün" : "ay"} için deadline yok.
              </p>
            ) : (
              <div className="space-y-2">
                {sidebarDeadlines.map((d, idx) => (
                  <div
                    key={`${d.university.id}-${idx}`}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
                    <span className="text-base flex-shrink-0">{d.university.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {d.university.name}
                      </div>
                      <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                        {d.university.program}
                        {d.label ? ` · ${d.label}` : ""}
                      </div>
                      <div
                        className="text-[11px] mt-0.5 font-medium"
                        style={{ color: "var(--gold)" }}
                      >
                        {d.day !== null
                          ? `${d.day} ${months[d.month]}`
                          : months[d.month]}
                      </div>
                    </div>
                  </div>
                ))}
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
              Yaklaşan Deadline'lar
            </h2>
            <div className="space-y-2">
              {upcomingDeadlines.map((d, idx) => {
                const isThisMonth = d.month === today.getMonth();
                return (
                  <div
                    key={`upcoming-${d.university.id}-${idx}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex-shrink-0">{d.university.flag}</span>
                      <span className="truncate" style={{ color: "var(--text)" }}>
                        {d.university.name}
                      </span>
                    </div>
                    <span
                      className="flex-shrink-0 ml-2 font-medium"
                      style={{ color: isThisMonth ? "var(--danger)" : "var(--gold)" }}
                    >
                      {d.day !== null ? `${d.day} ${months[d.month]}` : months[d.month]}
                    </span>
                  </div>
                );
              })}
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
              Tarihler tahminidir. Üniversitenin resmi sitesini kontrol edin.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

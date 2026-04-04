"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";

import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CalendarDays, Filter, Download, ExternalLink, Plus, X, Pencil, Trash2, Star, Search } from "lucide-react";
import type { University } from "@/types";

// ─── Personal Event Types ───────────────────────────────────
interface PersonalEvent {
  id: string;
  title: string;
  description: string;
  month: number; // 0-11
  day: number;
  year: number;
  color: string; // "blue" | "gold" | "success" | "danger"
  createdAt: string;
}

const EVENT_COLORS = [
  { value: "blue", label: "Mavi", bg: "var(--blue-bg)", border: "var(--blue-border)", text: "var(--blue)" },
  { value: "gold", label: "Sarı", bg: "var(--gold-bg)", border: "var(--gold-border)", text: "var(--gold)" },
  { value: "success", label: "Yeşil", bg: "var(--success-bg)", border: "1px solid rgba(22,163,74,0.15)", text: "var(--success)" },
  { value: "danger", label: "Kırmızı", bg: "var(--danger-bg)", border: "1px solid rgba(220,38,38,0.15)", text: "var(--danger)" },
];

const STORAGE_KEY = "pusula-personal-events";

function loadEvents(): PersonalEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEvents(events: PersonalEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

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
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ─── Personal Events State ──────────────────────────────
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PersonalEvent | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", description: "", color: "blue", day: 1, month: 0, year: 2026 });

  // Load events from localStorage on mount
  useEffect(() => {
    setPersonalEvents(loadEvents());
  }, []);

  // Events for current month
  const monthEvents = useMemo(
    () => personalEvents.filter((e) => e.month === currentMonth && e.year === currentYear),
    [personalEvents, currentMonth, currentYear]
  );

  // Map day → events for current month
  const eventDays = useMemo(() => {
    const map: Record<number, PersonalEvent[]> = {};
    monthEvents.forEach((e) => {
      if (!map[e.day]) map[e.day] = [];
      map[e.day].push(e);
    });
    return map;
  }, [monthEvents]);

  // Events for selected day
  const selectedDayEvents = useMemo(
    () => (selectedDay !== null ? eventDays[selectedDay] || [] : []),
    [selectedDay, eventDays]
  );

  function openAddEvent(day?: number) {
    setEditingEvent(null);
    const defaultDay = day || selectedDay || today.getDate();
    setEventForm({ title: "", description: "", color: "blue", day: defaultDay, month: currentMonth, year: currentYear });
    setShowEventModal(true);
  }

  function openEditEvent(event: PersonalEvent) {
    setEditingEvent(event);
    setEventForm({ title: event.title, description: event.description, color: event.color, day: event.day, month: event.month, year: event.year });
    setShowEventModal(true);
  }

  function handleSaveEvent() {
    if (!eventForm.title.trim() || !eventForm.day) return;
    let updated: PersonalEvent[];
    if (editingEvent) {
      updated = personalEvents.map((e) =>
        e.id === editingEvent.id
          ? { ...e, title: eventForm.title.trim(), description: eventForm.description.trim(), color: eventForm.color, day: eventForm.day, month: eventForm.month, year: eventForm.year }
          : e
      );
    } else {
      const newEvent: PersonalEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        month: eventForm.month,
        day: eventForm.day,
        year: eventForm.year,
        color: eventForm.color,
        createdAt: new Date().toISOString(),
      };
      updated = [...personalEvents, newEvent];
    }
    setPersonalEvents(updated);
    saveEvents(updated);
    setShowEventModal(false);
    setEditingEvent(null);
  }

  // Mini calendar helpers for modal
  const pickerDaysInMonth = new Date(eventForm.year, eventForm.month + 1, 0).getDate();
  const pickerFirstDay = new Date(eventForm.year, eventForm.month, 1).getDay();
  const pickerAdjustedFirst = pickerFirstDay === 0 ? 6 : pickerFirstDay - 1;

  function pickerPrevMonth() {
    setEventForm((f) => {
      if (f.month === 0) return { ...f, month: 11, year: f.year - 1, day: 1 };
      return { ...f, month: f.month - 1, day: 1 };
    });
  }
  function pickerNextMonth() {
    setEventForm((f) => {
      if (f.month === 11) return { ...f, month: 0, year: f.year + 1, day: 1 };
      return { ...f, month: f.month + 1, day: 1 };
    });
  }
  function pickerGoToday() {
    setEventForm((f) => ({ ...f, day: today.getDate(), month: today.getMonth(), year: today.getFullYear() }));
  }

  function handleDeleteEvent(id: string) {
    const updated = personalEvents.filter((e) => e.id !== id);
    setPersonalEvents(updated);
    saveEvents(updated);
  }

  // Dynamic department list from data
  const departments = useMemo(() => {
    const set = new Set(universities.map((u) => u.department));
    return Array.from(set).sort();
  }, [universities]);

  const filteredUniversities = useMemo(() => {
    let result = universities;
    if (countryFilter !== "all") result = result.filter((u) => u.country === countryFilter);
    if (departmentFilter !== "all") result = result.filter((u) => u.department === departmentFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.program.toLowerCase().includes(q)
      );
    }
    return result;
  }, [universities, countryFilter, departmentFilter, searchQuery]);

  const hasActiveFilters = countryFilter !== "all" || departmentFilter !== "all" || searchQuery.trim() !== "";

  function clearAllFilters() {
    setCountryFilter("all");
    setDepartmentFilter("all");
    setSearchQuery("");
    setSelectedDay(null);
  }

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
              backgroundColor: hasActiveFilters ? "var(--blue-bg)" : "var(--surface2)",
              border: `1px solid ${hasActiveFilters ? "var(--blue-border)" : "var(--border)"}`,
              color: hasActiveFilters ? "var(--blue)" : "var(--muted)",
            }}
          >
            <Filter className="w-3.5 h-3.5" />
            {hasActiveFilters ? `Filtre aktif (${filteredUniversities.length})` : "Filtrele"}
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
        {hasActiveFilters && (
          <span className="ml-2 text-[11px]" style={{ color: "var(--blue)" }}>
            · {filteredUniversities.length} program gösteriliyor
          </span>
        )}
      </p>

      {/* Filters Panel */}
      {showFilters && (
        <div
          className="mb-4 p-4 rounded-xl space-y-3"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedDay(null); }}
              placeholder="Üniversite veya program ara..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Country chips */}
          <div>
            <div className="text-[11px] font-medium mb-1.5" style={{ color: "var(--muted)" }}>Ülke</div>
            <div className="flex flex-wrap gap-1.5">
              {COUNTRY_FILTERS.map((f) => {
                const isActive = countryFilter === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => { setCountryFilter(f.value); setSelectedDay(null); }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? "var(--blue)" : "var(--surface2)",
                      border: `1px solid ${isActive ? "var(--blue)" : "var(--border)"}`,
                      color: isActive ? "var(--white)" : "var(--muted)",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Department select */}
          <div>
            <div className="text-[11px] font-medium mb-1.5" style={{ color: "var(--muted)" }}>Program / Departman</div>
            <select
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setSelectedDay(null); }}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              <option value="all">Tüm Departmanlar</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--danger)" }}
            >
              Filtreleri Temizle
            </button>
          )}
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
              const dayEvts = eventDays[day] || [];
              const hasEvent = dayEvts.length > 0;
              const hasContent = hasDeadline || hasEvent;
              const isSelected = selectedDay === day;
              const isTodayDay = todayMonth === currentMonth && todayDate === day;
              const isPast = currentMonth < todayMonth || (currentMonth === todayMonth && day < todayDate);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className="h-12 flex flex-col items-center justify-center rounded-lg text-sm relative transition-all group"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--blue)"
                      : isTodayDay
                      ? "var(--blue-bg)"
                      : hasDeadline
                      ? isPast ? "var(--surface2)" : "var(--danger-bg)"
                      : hasEvent
                      ? "var(--blue-bg)"
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
                      : hasEvent && !hasDeadline
                      ? "1px solid var(--blue-border)"
                      : "1px solid transparent",
                    cursor: "pointer",
                    opacity: isPast && !hasContent ? 0.4 : 1,
                  }}
                >
                  {day}
                  <div className="flex items-center gap-0.5 absolute bottom-1">
                    {hasDeadline && (
                      count <= 3 ? (
                        Array.from({ length: count }).map((_, j) => (
                          <div
                            key={`d-${j}`}
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
                      )
                    )}
                    {hasEvent && (
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isSelected ? "var(--white)" : `var(--${dayEvts[0].color})`,
                        }}
                      />
                    )}
                  </div>
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
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--blue)" }}
              />
              Kişisel not
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Personal Events Section — EN ÜSTTE */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2
                className="font-semibold text-sm flex items-center gap-2"
                style={{ color: "var(--text)" }}
              >
                <Star className="w-4 h-4" style={{ color: "var(--gold)" }} />
                Kişisel Notlarım
                {monthEvents.length > 0 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "var(--gold-bg)", color: "var(--gold)" }}
                  >
                    {monthEvents.length}
                  </span>
                )}
              </h2>
              <button
                onClick={() => openAddEvent(selectedDay || undefined)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--blue-bg)",
                  border: "1px solid var(--blue-border)",
                  color: "var(--blue)",
                }}
              >
                <Plus className="w-3 h-3" />
                Ekle
              </button>
            </div>

            {/* Show events for selected day, or all month events */}
            {(selectedDay !== null ? selectedDayEvents : monthEvents).length === 0 ? (
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {selectedDay !== null
                  ? "Bu gün için not yok."
                  : "Bu ay için not yok."}
                <button
                  onClick={() => openAddEvent(selectedDay || undefined)}
                  className="ml-1 underline"
                  style={{ color: "var(--blue)" }}
                >
                  Ekle
                </button>
              </p>
            ) : (
              <div className="space-y-2">
                {(selectedDay !== null ? selectedDayEvents : monthEvents).map((evt) => {
                  const colorDef = EVENT_COLORS.find((c) => c.value === evt.color) || EVENT_COLORS[0];
                  return (
                    <div
                      key={evt.id}
                      className="px-3 py-2.5 rounded-lg"
                      style={{
                        backgroundColor: colorDef.bg,
                        borderLeft: `3px solid ${colorDef.text}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-xs font-medium"
                            style={{ color: "var(--text)" }}
                          >
                            {evt.title}
                          </div>
                          {evt.description && (
                            <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                              {evt.description}
                            </div>
                          )}
                          <div
                            className="text-[10px] mt-1 font-medium"
                            style={{ color: colorDef.text }}
                          >
                            {evt.day} {months[evt.month]}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditEvent(evt); }}
                            className="p-1 rounded hover:opacity-70 transition-opacity"
                          >
                            <Pencil className="w-3 h-3" style={{ color: "var(--muted)" }} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteEvent(evt.id); }}
                            className="p-1 rounded hover:opacity-70 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" style={{ color: "var(--danger)" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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

      {/* ─── Add/Edit Event Modal ──────────────────────────── */}
      {showEventModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowEventModal(false)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                {editingEvent ? "Notu Düzenle" : "Yeni Not Ekle"}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: "var(--muted)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mini Calendar Picker */}
            <div
              className="mb-4 rounded-lg p-3"
              style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {months[eventForm.month]} {eventForm.year}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={pickerPrevMonth}
                    className="p-1 rounded hover:opacity-70 transition-opacity"
                    style={{ color: "var(--muted)" }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={pickerNextMonth}
                    className="p-1 rounded hover:opacity-70 transition-opacity"
                    style={{ color: "var(--muted)" }}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
                  <div key={d} className="text-center text-[10px] font-medium py-1" style={{ color: "var(--muted)" }}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: pickerAdjustedFirst }).map((_, i) => (
                  <div key={`pe-${i}`} className="h-7" />
                ))}
                {Array.from({ length: pickerDaysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const isPickerToday = d === today.getDate() && eventForm.month === today.getMonth() && eventForm.year === today.getFullYear();
                  const isSelected = d === eventForm.day;
                  return (
                    <button
                      key={d}
                      onClick={() => setEventForm({ ...eventForm, day: d })}
                      className="h-7 rounded-full text-xs font-medium flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: isSelected ? "var(--blue)" : "transparent",
                        color: isSelected ? "var(--white)" : isPickerToday ? "var(--blue)" : "var(--text)",
                        border: isPickerToday && !isSelected ? "1px solid var(--blue-border)" : "1px solid transparent",
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={pickerGoToday}
                className="mt-2 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--blue)" }}
              >
                Bugün
              </button>
            </div>

            {/* Title */}
            <div className="mb-3">
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--text)" }}>
                Başlık *
              </label>
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Örn: IELTS sınavı, Belge gönder..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                maxLength={100}
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--text)" }}>
                Açıklama
              </label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Detaylar (opsiyonel)"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                rows={2}
                style={{
                  backgroundColor: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                maxLength={300}
              />
            </div>

            {/* Color picker */}
            <div className="mb-5">
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text)" }}>
                Renk
              </label>
              <div className="flex gap-2">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setEventForm({ ...eventForm, color: c.value })}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: c.bg,
                      border: eventForm.color === c.value
                        ? `2px solid ${c.text}`
                        : "2px solid transparent",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: c.text }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                }}
              >
                İptal
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={!eventForm.title.trim() || !eventForm.day}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{
                  backgroundColor: "var(--blue)",
                  color: "var(--white)",
                }}
              >
                {editingEvent ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

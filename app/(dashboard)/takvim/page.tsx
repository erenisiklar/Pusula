"use client";

import { useState } from "react";
import { universities } from "@/lib/universities";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const deadlines = [
  { uni: "KTH Stockholm", date: "15 Ocak", month: 0, urgent: true },
  { uni: "Bocconi (Erken)", date: "Ocak", month: 0, urgent: true },
  { uni: "Sciences Po", date: "Şubat", month: 1, urgent: true },
  { uni: "Politecnico Milano (Erken)", date: "Şubat", month: 1, urgent: false },
  { uni: "RWTH Aachen", date: "1 Mart", month: 2, urgent: false },
  { uni: "Politecnico Milano (Geç)", date: "Nisan", month: 3, urgent: false },
  { uni: "TU Delft CS", date: "1 Nisan", month: 3, urgent: false },
  { uni: "TU Delft Architecture", date: "1 Nisan", month: 3, urgent: false },
  { uni: "Bocconi (Geç)", date: "Nisan", month: 3, urgent: false },
  { uni: "ESSEC", date: "Nisan", month: 3, urgent: false },
  { uni: "Groningen Business", date: "1 Mayıs", month: 4, urgent: false },
  { uni: "Bologna Engineering", date: "Mayıs", month: 4, urgent: false },
  { uni: "TU München CS", date: "31 Mayıs", month: 4, urgent: false },
  { uni: "TU München Elektrik", date: "31 Mayıs", month: 4, urgent: false },
  { uni: "IE University", date: "Haziran", month: 5, urgent: false },
  { uni: "LMU München", date: "15 Temmuz", month: 6, urgent: false },
];

export default function TakvimPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();
  const firstDay = new Date(2026, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const monthDeadlines = deadlines.filter((d) => d.month === currentMonth);

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
              onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}
              className="p-1.5 rounded-lg hover:opacity-80"
              style={{ backgroundColor: "var(--surface2)" }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "var(--muted)" }} />
            </button>
            <h2 className="font-semibold" style={{ color: "var(--text)" }}>
              {months[currentMonth]} 2026
            </h2>
            <button
              onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}
              className="p-1.5 rounded-lg hover:opacity-80"
              style={{ backgroundColor: "var(--surface2)" }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: "var(--muted)" }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
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
              <div key={`empty-${i}`} className="h-10" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const today = new Date();
              const isToday =
                today.getMonth() === currentMonth &&
                today.getDate() === day &&
                today.getFullYear() === 2026;

              return (
                <div
                  key={day}
                  className="h-10 flex items-center justify-center rounded-lg text-sm"
                  style={{
                    backgroundColor: isToday ? "var(--blue-bg)" : "transparent",
                    color: isToday ? "var(--blue-light)" : "var(--text)",
                    border: isToday ? "1px solid var(--blue-border)" : "1px solid transparent",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadline list */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>
            {months[currentMonth]} Deadline&apos;ları
          </h2>

          {monthDeadlines.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Bu ay için deadline yok.
            </p>
          ) : (
            <div className="space-y-2">
              {monthDeadlines.map((d) => (
                <div
                  key={d.uni}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <Clock
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: d.urgent ? "var(--danger)" : "var(--gold)" }}
                  />
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {d.uni}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {d.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="font-semibold text-sm mt-6 mb-4" style={{ color: "var(--text)" }}>
            Tüm Deadline&apos;lar
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {deadlines.map((d) => (
              <div
                key={d.uni}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                style={{ backgroundColor: "var(--surface2)" }}
              >
                <span style={{ color: "var(--text)" }}>{d.uni}</span>
                <span style={{ color: "var(--muted)" }}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { School, FileText, Calendar, CheckCircle, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Lisans Programı", value: "106", icon: School, color: "var(--blue)" },
  { label: "Y.Lisans Programı", value: "50", icon: GraduationCap, color: "var(--gold)" },
  { label: "Yaklaşan Deadline", value: "3", icon: Calendar, color: "var(--danger)" },
  { label: "Ülke", value: "18", icon: CheckCircle, color: "var(--success)" },
];

const todos = [
  { text: "Lise notunu ve dil puanını gir", done: false, href: "/schools" },
  { text: "Lisans programlarını keşfet", done: false, href: "/schools" },
  { text: "Motivasyon mektubu oluştur", done: false, href: "/motivasyon" },
  { text: "Başvuru takvimini kontrol et", done: false, href: "/takvim" },
  { text: "CV'ni hazırla", done: false, href: "/cv" },
];

export default function DashboardPage() {
  const progress = 10;

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
          Hoş geldin! 👋
        </h1>
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
          Liseden sonra Avrupa&apos;da lisans veya yüksek lisans okumak için doğru yerdesin.
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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl px-5 py-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
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

      <div className="grid grid-cols-2 gap-6">
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
                  />
                  <span
                    className="text-sm"
                    style={{ color: todo.done ? "var(--muted)" : "var(--text)" }}
                  >
                    {todo.text}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
              </Link>
            ))}
          </div>
        </div>

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
                  GPA&apos;nıza uygun okulları keşfedin
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
                  CV Olusturucu
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
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import {
  GraduationCap,
  LayoutDashboard,
  School,
  FileText,
  Calendar,
  Users,
  BookOpen,
  Globe,
  Trophy,
  CheckCircle,
  Map,
  Compass,
  User,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schools", label: "Okullar", icon: School },
  { href: "/motivasyon", label: "Motivasyon Mektubu", icon: FileText },
  { href: "/cv", label: "CV", icon: GraduationCap },
  { href: "/takvim", label: "Takvim", icon: Calendar },
  { href: "/baglanti", label: "Bağlantı", icon: Users },
  { href: "/dersler", label: "Dersler", icon: BookOpen },
  { href: "/kulturel", label: "Kültürel Rehber", icon: Globe },
  { href: "/rankings", label: "Sıralamalar", icon: Trophy },
  { href: "/acceptance", label: "Kabul Oranları", icon: CheckCircle },
  { href: "/map", label: "Harita", icon: Map },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, hasProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to onboarding if no profile
  useEffect(() => {
    if (!hasProfile) {
      router.replace("/onboarding");
    }
  }, [hasProfile, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 md:hidden"
        style={{ backgroundColor: "#0f1d3d" }}
      >
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5" style={{ color: "var(--gold)" }} />
          <span className="text-base font-bold" style={{ color: "#ffffff" }}>
            Pusula
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg"
          style={{ color: "#ffffff" }}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{
          width: 220,
          backgroundColor: "#0f1d3d",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5">
          <Compass className="w-6 h-6" style={{ color: "var(--gold)" }} />
          <span className="text-lg font-bold tracking-tight" style={{ color: "#ffffff" }}>
            Pusula
            <span
              className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 mb-2"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                  borderLeft: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile mini card */}
        {profile && (
          <Link
            href="/profil"
            className="block mx-3 mb-2 px-3 py-2.5 rounded-lg transition-all hover:opacity-80"
            style={{ backgroundColor: pathname === "/profil" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(59,130,246,0.25)" }}
              >
                <User className="w-3 h-3" style={{ color: "#60a5fa" }} />
              </div>
              <span className="text-xs font-medium truncate" style={{ color: "#fff" }}>
                {profile.fullName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              <span>GPA: {profile.gpa}</span>
              <span>•</span>
              <span>
                {profile.languageCerts && profile.languageCerts.length > 0
                  ? profile.languageCerts.map((c) => `${c.cert} ${c.score}`).join(", ")
                  : profile.languageCert
                    ? `${profile.languageCert} ${profile.languageScore > 0 ? profile.languageScore : ""}`
                    : "Dil yok"}
              </span>
            </div>
          </Link>
        )}

        {/* Footer */}
        <div
          className="px-4 py-3 text-xs border-t hidden md:block"
          style={{ color: "rgba(255,255,255,0.35)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p>Pusula v1.0 MVP</p>
          <div className="mt-1 opacity-70 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div
              className="flex gap-4 whitespace-nowrap"
              style={{
                animation: "ticker 30s linear infinite",
                width: "max-content",
              }}
            >
              {[
                "Almanya", "Avusturya", "Belçika", "Çekya", "Danimarka",
                "Estonya", "Finlandiya", "Fransa", "Hollanda", "İngiltere",
                "İrlanda", "İspanya", "İsveç", "İsviçre", "İtalya",
                "Macaristan", "Norveç", "Polonya", "Portekiz",
              ].map((c) => (
                <span key={c}>{c}</span>
              ))}
              {[
                "Almanya", "Avusturya", "Belçika", "Çekya", "Danimarka",
                "Estonya", "Finlandiya", "Fransa", "Hollanda", "İngiltere",
                "İrlanda", "İspanya", "İsveç", "İsviçre", "İtalya",
                "Macaristan", "Norveç", "Polonya", "Portekiz",
              ].map((c) => (
                <span key={`dup-${c}`}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1" style={{ marginLeft: 220 }}>
        <div key={pathname} className="p-6 max-w-7xl mx-auto animate-fade-in-up">{children}</div>
      </main>
    </div>
  );
}

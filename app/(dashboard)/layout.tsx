"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  UserCircle,
  LogOut,
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
  { href: "/profil", label: "Profil", icon: UserCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? "");
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen flex flex-col border-r"
        style={{
          width: 220,
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5">
          <Compass className="w-6 h-6" style={{ color: "var(--gold)" }} />
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
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
                  backgroundColor: isActive ? "var(--blue-bg)" : "transparent",
                  color: isActive ? "var(--blue-light)" : "var(--muted)",
                  borderLeft: isActive ? "2px solid var(--blue)" : "2px solid transparent",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {userEmail && (
            <p
              className="text-xs mb-2 truncate"
              style={{ color: "var(--muted)" }}
              title={userEmail}
            >
              {userEmail}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs w-full px-2 py-1.5 rounded"
            style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1" style={{ marginLeft: 220 }}>
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

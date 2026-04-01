"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Save } from "lucide-react";

interface Profile {
  full_name: string;
  gpa: string;
  language: string;
  language_score: string;
  budget: string;
}

const LANGUAGES = ["IELTS", "TOEFL", "TestDaF", "Duolingo", "Yok"];

export default function ProfilPage() {
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    gpa: "",
    language: "IELTS",
    language_score: "",
    budget: "",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/giris");
        return;
      }
      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name ?? user.user_metadata?.full_name ?? "",
          gpa: data.gpa?.toString() ?? "",
          language: data.language ?? "IELTS",
          language_score: data.language_score ?? "",
          budget: data.budget?.toString() ?? "",
        });
      } else {
        setProfile((p) => ({
          ...p,
          full_name: user.user_metadata?.full_name ?? "",
        }));
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      gpa: profile.gpa ? parseInt(profile.gpa) : null,
      language: profile.language === "Yok" ? null : profile.language,
      language_score: profile.language === "Yok" ? null : profile.language_score,
      budget: profile.budget ? parseInt(profile.budget) : null,
    });

    if (error) {
      setError("Kaydedilemedi. Tekrar dene.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  }

  if (loading) {
    return (
      <div style={{ color: "var(--muted)", padding: 40, textAlign: "center" }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "var(--blue-bg)",
            border: "1px solid var(--blue-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User style={{ color: "var(--blue-light)", width: 20, height: 20 }} />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            Profil
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>{email}</p>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <label style={{ display: "block", color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>
            Ad Soyad
          </label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Adın Soyadın"
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>
            GPA (100 üzerinden)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={profile.gpa}
            onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
            placeholder="örn: 78"
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>
              Dil Sınavı
            </label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>
              Puan
            </label>
            <input
              type="text"
              value={profile.language_score}
              onChange={(e) =>
                setProfile({ ...profile, language_score: e.target.value })
              }
              placeholder={profile.language === "Yok" ? "—" : "örn: 6.5"}
              disabled={profile.language === "Yok"}
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: profile.language === "Yok" ? "var(--muted)" : "var(--text)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                opacity: profile.language === "Yok" ? 0.5 : 1,
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>
            Yıllık Bütçe (EUR)
          </label>
          <input
            type="number"
            min="0"
            value={profile.budget}
            onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
            placeholder="örn: 15000"
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <p
            style={{
              color: "var(--danger)",
              fontSize: 13,
              backgroundColor: "var(--danger-bg)",
              padding: "8px 12px",
              borderRadius: 6,
            }}
          >
            {error}
          </p>
        )}

        {saved && (
          <p
            style={{
              color: "var(--success)",
              fontSize: 13,
              backgroundColor: "var(--success-bg)",
              padding: "8px 12px",
              borderRadius: 6,
            }}
          >
            Profil kaydedildi.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "11px 16px",
            backgroundColor: "var(--blue)",
            color: "var(--white)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Save style={{ width: 16, height: 16 }} />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          backgroundColor: "transparent",
          color: "var(--muted)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          fontSize: 13,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

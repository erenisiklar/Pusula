"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass } from "lucide-react";

export default function KayitPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // If email confirmation is disabled, user is logged in immediately
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 32,
          backgroundColor: "var(--surface)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
        <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: 8 }}>
          E-postanı kontrol et
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          <strong style={{ color: "var(--text)" }}>{email}</strong> adresine
          doğrulama linki gönderdik. Linke tıklayarak hesabını aktifleştir.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        padding: 32,
        backgroundColor: "var(--surface)",
        borderRadius: 12,
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
        <Compass style={{ color: "var(--gold)", width: 24, height: 24 }} />
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
          Pusula
        </span>
      </div>

      <h1
        style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}
      >
        Kayıt Ol
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        Ücretsiz hesap oluştur, Avrupa'ya adımını at.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label
            style={{
              display: "block",
              color: "var(--muted)",
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            Ad Soyad
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
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
          <label
            style={{
              display: "block",
              color: "var(--muted)",
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ornek@email.com"
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
          <label
            style={{
              display: "block",
              color: "var(--muted)",
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="En az 6 karakter"
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

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "11px 16px",
            backgroundColor: "var(--blue)",
            color: "var(--white)",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginTop: 4,
          }}
        >
          {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
        </button>
      </form>

      <p
        style={{
          color: "var(--muted)",
          fontSize: 13,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Zaten hesabın var mı?{" "}
        <Link href="/giris" style={{ color: "var(--blue-light)" }}>
          Giriş yap
        </Link>
      </p>
    </div>
  );
}

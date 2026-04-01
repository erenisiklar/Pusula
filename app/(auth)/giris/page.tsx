"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass } from "lucide-react";

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
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
        Giriş Yap
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        Hesabına giriş yap ve başvurularını yönet.
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
            placeholder="••••••••"
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
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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
        Hesabın yok mu?{" "}
        <Link href="/kayit" style={{ color: "var(--blue-light)" }}>
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}

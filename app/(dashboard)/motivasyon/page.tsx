"use client";

import { useState } from "react";
import { universities } from "@/lib/universities";
import { FileText, Loader2, Copy, Check } from "lucide-react";

export default function MotivasyonPage() {
  const [studentName, setStudentName] = useState("");
  const [selectedUni, setSelectedUni] = useState(universities[0].id);
  const [gpa, setGpa] = useState(3.0);
  const [strengths, setStrengths] = useState("");
  const [motivation, setMotivation] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const uni = universities.find((u) => u.id === selectedUni)!;

  async function handleGenerate() {
    if (!studentName || !strengths || !motivation) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    setError("");
    setLoading(true);
    setLetter("");
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          university: uni.name,
          program: uni.program,
          country: uni.country,
          gpa,
          strengths,
          motivation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
      setLetter(data.letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Motivasyon Mektubu
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        AI destekli motivasyon mektubu oluşturun — İngilizce, ~500 kelime
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Adınız Soyadınız
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Örn: Eren Işıklar"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Hedef Üniversite & Program
            </label>
            <select
              value={selectedUni}
              onChange={(e) => setSelectedUni(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.flag} {u.name} — {u.program}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              GPA (4.0 üzerinden)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={gpa}
              onChange={(e) => setGpa(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Güçlü Yönleriniz
            </label>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Stajlar, projeler, başarılar..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Motivasyonunuz
            </label>
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Bu üniversiteyi ve programı neden seçtiniz..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Oluşturuluyor...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" /> Mektup Oluştur
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div
          className="rounded-xl p-5 relative"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Oluşturulan Mektup
            </h2>
            {letter && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            )}
          </div>

          {letter ? (
            <div
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: "var(--text)" }}
            >
              {letter}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-10 h-10 mb-3" style={{ color: "var(--muted)", opacity: 0.3 }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Sol taraftaki formu doldurup &quot;Mektup Oluştur&quot; butonuna tıklayın.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
                Claude AI ile ~500 kelimelik İngilizce motivasyon mektubu üretilecektir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

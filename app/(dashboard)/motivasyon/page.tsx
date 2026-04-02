"use client";

import { useState, useRef, useCallback } from "react";
import { universities } from "@/lib/universities";
import {
  FileText,
  Loader2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PenLine,
  X,
} from "lucide-react";

interface LetterSection {
  key: string;
  label: string;
  content: string;
}

const SECTION_LABELS: Record<string, string> = {
  OPENING: "Giriş",
  ACADEMIC_BACKGROUND: "Akademik Geçmiş",
  WHY_THIS_PROGRAM: "Neden Bu Program",
  EXPERIENCE: "Deneyim & Aktiviteler",
  CAREER_GOALS: "Kariyer Hedefleri",
  CLOSING: "Kapanış",
};

const TIPS = [
  "Motivasyon mektubunu kişiselleştirin — genel ifadelerden kaçının, spesifik olun.",
  "Üniversitenin web sitesinden spesifik profesör isimleri veya araştırma grupları ekleyin.",
  "Neden sadece bu üniversite ve bu program olduğunu somut nedenlerle açıklayın.",
  "Güçlü yönlerinizi somut örneklerle destekleyin — staj, proje, yarışma sonuçları.",
  "Kariyer hedeflerinizi programla doğrudan ilişkilendirin.",
  "Son paragrafta güçlü bir izlenim bırakın — tutkunuzu ve kararlılığınızı gösterin.",
  "Mektubu en az 2-3 kez gözden geçirin ve bir başkasına okutun.",
  "Kelime sınırına dikkat edin — çoğu üniversite 500-750 kelime bekler.",
];

function parseSections(text: string): LetterSection[] {
  const sectionKeys = Object.keys(SECTION_LABELS);
  const sections: LetterSection[] = [];

  // Find all section markers and their positions
  const markers: { key: string; index: number }[] = [];
  for (const key of sectionKeys) {
    const marker = `[${key}]`;
    const idx = text.indexOf(marker);
    if (idx !== -1) {
      markers.push({ key, index: idx });
    }
  }

  if (markers.length === 0) {
    // No markers found — return whole text as single section
    return [{ key: "FULL", label: "Mektup", content: text.trim() }];
  }

  markers.sort((a, b) => a.index - b.index);

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index + `[${markers[i].key}]`.length;
    const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
    const content = text.slice(start, end).trim();
    sections.push({
      key: markers[i].key,
      label: SECTION_LABELS[markers[i].key] || markers[i].key,
      content,
    });
  }

  return sections;
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export default function MotivasyonPage() {
  // Form state
  const [studentName, setStudentName] = useState("");
  const [selectedUni, setSelectedUni] = useState(universities[0].id);
  const [gpa, setGpa] = useState(75);
  const [strengths, setStrengths] = useState("");
  const [motivation, setMotivation] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [tone, setTone] = useState("balanced");
  const [targetWordCount, setTargetWordCount] = useState(500);

  // Output state
  const [rawLetter, setRawLetter] = useState("");
  const [sections, setSections] = useState<LetterSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Section regeneration
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // UI state
  const [showTips, setShowTips] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const uni = universities.find((u) => u.id === selectedUni)!;

  const getPlainText = useCallback(() => {
    if (sections.length === 0) return rawLetter;
    return sections.map((s) => s.content).join("\n\n");
  }, [sections, rawLetter]);

  async function handleGenerate() {
    if (!studentName || !strengths || !motivation) {
      setError("Lütfen Ad Soyad, Güçlü Yönler ve Motivasyon alanlarını doldurun.");
      return;
    }
    setError("");
    setLoading(true);
    setRawLetter("");
    setSections([]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate-letter-stream", {
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
          languageLevel,
          extracurriculars,
          careerGoals,
          tone,
          wordCount: targetWordCount,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream okunamadı");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                setError(parsed.error);
                setLoading(false);
                return;
              }
              if (parsed.text) {
                accumulated += parsed.text;
                setRawLetter(accumulated);
              }
            } catch (parseErr) {
              // skip malformed JSON chunks only
            }
          }
        }
      }

      // Parse sections after stream completes
      const parsed = parseSections(accumulated);
      setSections(parsed);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled
      } else {
        // Fallback: streaming failed, try non-streaming endpoint
        console.warn("Streaming failed, trying fallback:", err);
        try {
          const fallbackRes = await fetch("/api/generate-letter", {
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
          const fallbackData = await fallbackRes.json();
          if (!fallbackRes.ok) throw new Error(fallbackData.error || "Hata oluştu");
          setRawLetter(fallbackData.letter);
          const parsed = parseSections(fallbackData.letter);
          setSections(parsed);
        } catch (fallbackErr) {
          setError(fallbackErr instanceof Error ? fallbackErr.message : "Mektup oluşturulamadı. Lütfen tekrar deneyin.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setLoading(false);
    if (rawLetter) {
      const parsed = parseSections(rawLetter);
      setSections(parsed);
    }
  }

  async function handleRegenerateSection(sectionKey: string) {
    setRegeneratingSection(sectionKey);
    try {
      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionKey,
          fullLetter: getPlainText(),
          studentInfo: {
            studentName,
            university: uni.name,
            program: uni.program,
            gpa,
          },
          instruction: editInstruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSections((prev) =>
        prev.map((s) => (s.key === sectionKey ? { ...s, content: data.text } : s))
      );
      setEditingSection(null);
      setEditInstruction("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bölüm yeniden oluşturulamadı");
    } finally {
      setRegeneratingSection(null);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadDocx() {
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx");
    const plainText = getPlainText();
    const paragraphs = plainText.split("\n\n").filter(Boolean);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Motivation Letter",
                  bold: true,
                  size: 28,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: `${uni.name} — ${uni.program}`,
                  size: 22,
                  font: "Calibri",
                  color: "666666",
                }),
              ],
            }),
            ...paragraphs.map(
              (p) =>
                new Paragraph({
                  spacing: { after: 200, line: 360 },
                  children: [
                    new TextRun({
                      text: p,
                      size: 22,
                      font: "Calibri",
                    }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `motivation-letter-${uni.name.replace(/\s+/g, "-").toLowerCase()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentWordCount = wordCount(sections.length > 0 ? getPlainText() : rawLetter);
  const hasLetter = rawLetter.length > 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
            Motivasyon Mektubu
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            AI destekli motivasyon mektubu oluşturun — bölüm bölüm düzenleyin, indirin
          </p>
        </div>
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{
            backgroundColor: showTips ? "var(--gold-bg)" : "var(--surface2)",
            color: showTips ? "var(--gold)" : "var(--muted)",
            border: `1px solid ${showTips ? "var(--gold-border)" : "var(--border)"}`,
          }}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          İpuçları
        </button>
      </div>

      {/* Tips Panel */}
      {showTips && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)" }}
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--gold)" }}>
            <Lightbulb className="w-4 h-4" />
            Motivasyon Mektubu İpuçları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text)" }}>
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: "var(--gold-border)", color: "var(--gold)" }}
                >
                  {i + 1}
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form — 2/5 width on large screens */}
        <div
          className="lg:col-span-2 rounded-xl p-5 space-y-4 h-fit"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Name */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Adınız Soyadınız *
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Örn: Eren Işıklar"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* University */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Hedef Üniversite & Program *
            </label>
            <select
              value={selectedUni}
              onChange={(e) => setSelectedUni(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
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

          {/* GPA */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              GPA (100 üzerinden)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={gpa}
              onChange={(e) => setGpa(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Strengths */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Güçlü Yönleriniz *
            </label>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="Stajlar, projeler, başarılar, teknik beceriler..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Motivation */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Motivasyonunuz *
            </label>
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Bu üniversiteyi ve programı neden seçtiniz, sizi ne heyecanlandırıyor..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--blue)" }}
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Gelişmiş Seçenekler
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-1">
              {/* Language Level */}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  Dil Seviyeniz
                </label>
                <input
                  type="text"
                  value={languageLevel}
                  onChange={(e) => setLanguageLevel(e.target.value)}
                  placeholder="Örn: IELTS 7.0, TOEFL 95, B2 Almanca"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                  style={{
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              {/* Extracurriculars */}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  Ders Dışı Aktiviteler
                </label>
                <textarea
                  value={extracurriculars}
                  onChange={(e) => setExtracurriculars(e.target.value)}
                  placeholder="Kulüpler, gönüllülük, spor, sanat..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                  style={{
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              {/* Career Goals */}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  Kariyer Hedefleriniz
                </label>
                <textarea
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  placeholder="Mezuniyet sonrası planlarınız, hedef sektör..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                  style={{
                    backgroundColor: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>

              {/* Tone & Word Count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                    Yazım Tonu
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                    style={{
                      backgroundColor: "var(--surface2)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    <option value="formal">Formal</option>
                    <option value="balanced">Dengeli</option>
                    <option value="creative">Yaratıcı</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                    Hedef Kelime
                  </label>
                  <select
                    value={targetWordCount}
                    onChange={(e) => setTargetWordCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                    style={{
                      backgroundColor: "var(--surface2)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    <option value={300}>~300 kelime</option>
                    <option value={500}>~500 kelime</option>
                    <option value={750}>~750 kelime</option>
                    <option value={1000}>~1000 kelime</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          {/* Generate / Stop button */}
          {loading ? (
            <button
              onClick={handleStop}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--danger)", color: "var(--white)" }}
            >
              <X className="w-4 h-4" /> Durdur
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
            >
              <Sparkles className="w-4 h-4" />
              {hasLetter ? "Yeniden Oluştur" : "Mektup Oluştur"}
            </button>
          )}

          <p className="text-[10px] text-center" style={{ color: "var(--muted)", opacity: 0.6 }}>
            Bu bir AI tahminidir. Oluşturulan mektubu mutlaka gözden geçirin ve kişiselleştirin.
          </p>
        </div>

        {/* Output — 3/5 width on large screens */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header bar */}
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Oluşturulan Mektup
              </h2>
              {hasLetter && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor:
                      currentWordCount >= targetWordCount * 0.85 && currentWordCount <= targetWordCount * 1.15
                        ? "var(--success-bg)"
                        : "var(--gold-bg)",
                    color:
                      currentWordCount >= targetWordCount * 0.85 && currentWordCount <= targetWordCount * 1.15
                        ? "var(--success)"
                        : "var(--gold)",
                  }}
                >
                  {currentWordCount} / ~{targetWordCount} kelime
                </span>
              )}
              {loading && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--blue)" }}>
                  <Loader2 className="w-3 h-3 animate-spin" /> Yazılıyor...
                </span>
              )}
            </div>
            {hasLetter && !loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Kopyalandı" : "Kopyala"}
                </button>
                <button
                  onClick={handleDownloadDocx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
                >
                  <Download className="w-3.5 h-3.5" /> Word
                </button>
              </div>
            )}
          </div>

          {/* Letter content */}
          {hasLetter ? (
            <div className="space-y-3">
              {sections.length > 0
                ? sections.map((section) => (
                    <div
                      key={section.key}
                      className="rounded-xl p-4 group relative transition-all"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: `1px solid ${
                          editingSection === section.key ? "var(--blue-border)" : "var(--border)"
                        }`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--muted)" }}
                        >
                          {section.label}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingSection === section.key ? (
                            <button
                              onClick={() => {
                                setEditingSection(null);
                                setEditInstruction("");
                              }}
                              className="p-1 rounded hover:opacity-80"
                              style={{ color: "var(--muted)" }}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingSection(section.key)}
                                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
                                title="Yönlendirmeli yeniden yaz"
                              >
                                <PenLine className="w-3 h-3" /> Düzenle
                              </button>
                              <button
                                onClick={() => handleRegenerateSection(section.key)}
                                disabled={regeneratingSection === section.key}
                                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                                style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
                                title="Bu bölümü yeniden oluştur"
                              >
                                {regeneratingSection === section.key ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3 h-3" />
                                )}
                                Yeniden Yaz
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Edit instruction input */}
                      {editingSection === section.key && (
                        <div className="mb-3 flex gap-2">
                          <input
                            type="text"
                            value={editInstruction}
                            onChange={(e) => setEditInstruction(e.target.value)}
                            placeholder="Nasıl değiştirilsin? Örn: Daha kısa yaz, daha somut örnekler ekle..."
                            className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                            style={{
                              backgroundColor: "var(--surface2)",
                              border: "1px solid var(--blue-border)",
                              color: "var(--text)",
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRegenerateSection(section.key);
                            }}
                          />
                          <button
                            onClick={() => handleRegenerateSection(section.key)}
                            disabled={regeneratingSection === section.key}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
                          >
                            {regeneratingSection === section.key ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Uygula"
                            )}
                          </button>
                        </div>
                      )}

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "var(--text)",
                          opacity: regeneratingSection === section.key ? 0.5 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {section.content}
                      </p>
                    </div>
                  ))
                : /* While streaming, show raw text */
                  <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: "var(--text)" }}
                    >
                      {rawLetter}
                      {loading && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm" style={{ backgroundColor: "var(--blue)" }} />
                      )}
                    </div>
                  </div>
              }
            </div>
          ) : (
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--blue-bg)" }}
                >
                  <FileText className="w-8 h-8" style={{ color: "var(--blue)", opacity: 0.5 }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
                  Henüz mektup oluşturulmadı
                </p>
                <p className="text-xs max-w-xs" style={{ color: "var(--muted)" }}>
                  Sol taraftaki formu doldurun. AI, seçtiğiniz üniversite ve programa özel
                  İngilizce motivasyon mektubu oluşturacak.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  {[
                    { icon: Sparkles, label: "AI Destekli" },
                    { icon: RefreshCw, label: "Bölüm Düzenleme" },
                    { icon: Download, label: "Word İndirme" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--muted)" }}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

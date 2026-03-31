"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Loader2,
  Upload,
  X,
  Briefcase,
  Cpu,
  GraduationCap,
  AlertTriangle,
  Database,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
} from "lucide-react";
import type { CVData } from "@/lib/gemini";

type TargetField = "business" | "engineering" | "other";

export default function CVPage() {
  const [rawContent, setRawContent] = useState("");
  const [targetField, setTargetField] = useState<TargetField>("other");
  const [extractedData, setExtractedData] = useState<CVData | null>(null);
  const [showExtracted, setShowExtracted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF blob URLs for both variants
  const [onePagePdfUrl, setOnePagePdfUrl] = useState<string | null>(null);
  const [harvardPdfUrl, setHarvardPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (onePagePdfUrl) URL.revokeObjectURL(onePagePdfUrl);
      if (harvardPdfUrl) URL.revokeObjectURL(harvardPdfUrl);
    };
  }, [onePagePdfUrl, harvardPdfUrl]);

  async function fetchPdfBlob(
    data: CVData,
    variant: "onepage" | "harvard"
  ): Promise<string | null> {
    try {
      const res = await fetch("/api/generate-cv-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedData: data, variant }),
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  function handleDownload(url: string, variant: "onepage" | "harvard") {
    const safeName = (extractedData?.personalInfo.fullName || "CV")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = url;
    a.download =
      variant === "harvard"
        ? `${safeName}_Harvard.pdf`
        : `${safeName}_OnePage.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleOpenPdf(url: string) {
    window.open(url, "_blank");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".md") &&
      !file.name.endsWith(".csv")
    ) {
      setError("Desteklenen dosya turleri: .txt, .md, .csv");
      return;
    }

    if (file.size > 100 * 1024) {
      setError("Dosya boyutu 100KB'dan kucuk olmalidir.");
      return;
    }

    try {
      const text = await file.text();
      setRawContent(text);
      setFileName(file.name);
      setError("");
    } catch {
      setError("Dosya okunamadi. Lutfen tekrar deneyin.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearFile() {
    setFileName("");
    setRawContent("");
  }

  async function handleGenerate() {
    if (!rawContent.trim()) {
      setError("Lutfen CV iceriginizi girin veya bir dosya yukleyin.");
      return;
    }
    if (rawContent.trim().length < 50) {
      setError(
        "Yeterli icerik bulunamadi. Lutfen daha fazla bilgi girin (en az 50 karakter)."
      );
      return;
    }

    setError("");
    setLoading(true);
    setExtractedData(null);
    setShowExtracted(false);

    // Cleanup old blob URLs
    if (onePagePdfUrl) URL.revokeObjectURL(onePagePdfUrl);
    if (harvardPdfUrl) URL.revokeObjectURL(harvardPdfUrl);
    setOnePagePdfUrl(null);
    setHarvardPdfUrl(null);

    try {
      // Step 1: Generate CV data via AI
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawContent, targetField }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata olustu");

      setExtractedData(data.extractedData);

      // Step 2: Generate both PDFs in parallel
      setPdfLoading(true);
      const [onepageUrl, harvardUrl] = await Promise.all([
        fetchPdfBlob(data.extractedData, "onepage"),
        fetchPdfBlob(data.extractedData, "harvard"),
      ]);
      setOnePagePdfUrl(onepageUrl);
      setHarvardPdfUrl(harvardUrl);
      setPdfLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu");
    } finally {
      setLoading(false);
      setPdfLoading(false);
    }
  }

  const hasResults = onePagePdfUrl || harvardPdfUrl;

  const fieldOptions: {
    value: TargetField;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "business",
      label: "Business / Ekonomi",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      value: "engineering",
      label: "Muhendislik / STEM",
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      value: "other",
      label: "Diger / Genel",
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        CV Olusturucu
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        CV iceriginizi girin — Gemini AI ile analiz edilip iki farkli formatta
        PDF olusturulur
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5 space-y-4"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Target Field Selector */}
            <div>
              <label
                className="text-xs font-medium block mb-2"
                style={{ color: "var(--muted)" }}
              >
                Hedef Alan
              </label>
              <div className="flex gap-2">
                {fieldOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTargetField(opt.value)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor:
                        targetField === opt.value
                          ? "var(--blue-bg)"
                          : "var(--surface2)",
                      border:
                        targetField === opt.value
                          ? "1px solid var(--blue-border)"
                          : "1px solid var(--border)",
                      color:
                        targetField === opt.value
                          ? "var(--blue)"
                          : "var(--muted)",
                    }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={{ color: "var(--muted)" }}
              >
                Dosya Yukle (opsiyonel)
              </label>
              {fileName ? (
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: "var(--blue-bg)",
                    border: "1px solid var(--blue-border)",
                    color: "var(--blue)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {fileName}
                  </span>
                  <button
                    onClick={clearFile}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: "var(--surface2)",
                    border: "1px dashed var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  <Upload className="w-4 h-4" />
                  .txt, .md veya .csv dosyasi secin
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Text Input */}
            <div>
              <label
                className="text-xs font-medium block mb-1.5"
                style={{ color: "var(--muted)" }}
              >
                CV Icerigi
              </label>
              <textarea
                value={rawContent}
                onChange={(e) => {
                  setRawContent(e.target.value);
                  if (fileName) setFileName("");
                }}
                placeholder={`Mevcut CV'nizi buraya yapistirin veya bilgilerinizi serbest formatta yazin...

Ornek:
Ad: Eren Isiklar
Egitim: Istanbul Teknik Universitesi, Bilgisayar Muhendisligi, 3.6 GPA (2022-2026)
Staj: ABC Teknoloji - Yazilim Muhendisi Stajyeri (Yaz 2025)
- React ve Node.js ile e-ticaret platformu gelistirdim
- Kullanici sayisini %30 artiran ozellikler ekledim
Projeler: Makine ogrenmesi ile duygu analizi projesi, Python, TensorFlow
Beceriler: Python, JavaScript, SQL, Git, Docker
Sertifikalar: IELTS 7.0, AWS Cloud Practitioner
Liderlik: Yazilim Kulubu Baskani (2024-2025)`}
                rows={12}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                style={{
                  backgroundColor: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
              <div className="flex justify-end mt-1">
                <span
                  className="text-xs"
                  style={{
                    color:
                      rawContent.trim().length < 50
                        ? "var(--muted)"
                        : "var(--success)",
                  }}
                >
                  {rawContent.trim().length} karakter
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs" style={{ color: "var(--danger)" }}>
                {error}
              </p>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--blue)",
                color: "var(--white)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> CV
                  Olusturuluyor...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" /> CV Olustur
                </>
              )}
            </button>
          </div>

          {/* Extracted Data Panel */}
          {extractedData && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setShowExtracted(!showExtracted)}
                className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--muted)" }}
              >
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  Cikarilan Veriler (JSON)
                </span>
                {showExtracted ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {showExtracted && (
                <div
                  className="px-5 pb-4 overflow-auto"
                  style={{ maxHeight: 300 }}
                >
                  <pre
                    className="text-xs leading-relaxed whitespace-pre-wrap"
                    style={{ color: "var(--text)" }}
                  >
                    {JSON.stringify(extractedData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

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
              Bu bir AI tahminidir. Olusturulan CV&apos;yi gonderim oncesi
              mutlaka kontrol edin. Universitenin resmi gereksinimlerini
              dogrulayin.
            </span>
          </div>
        </div>

        {/* Right: PDF Previews */}
        <div className="space-y-4">
          {hasResults ? (
            <>
              {/* One-Page CV Preview */}
              <PdfPreviewCard
                title="Tek Sayfa CV"
                subtitle="Modern iki kolonlu tasarim"
                accentColor="var(--blue)"
                accentBg="var(--blue-bg)"
                accentBorder="var(--blue-border)"
                pdfUrl={onePagePdfUrl}
                loading={pdfLoading}
                onDownload={() =>
                  onePagePdfUrl && handleDownload(onePagePdfUrl, "onepage")
                }
                onOpen={() => onePagePdfUrl && handleOpenPdf(onePagePdfUrl)}
              />

              {/* Harvard CV Preview */}
              <PdfPreviewCard
                title="Harvard CV"
                subtitle="Akademik ve detayli format"
                accentColor="var(--gold)"
                accentBg="var(--gold-bg)"
                accentBorder="var(--gold-border)"
                pdfUrl={harvardPdfUrl}
                loading={pdfLoading}
                onDownload={() =>
                  harvardPdfUrl && handleDownload(harvardPdfUrl, "harvard")
                }
                onOpen={() => harvardPdfUrl && handleOpenPdf(harvardPdfUrl)}
              />
            </>
          ) : (
            <div
              className="rounded-xl p-5 flex flex-col items-center justify-center min-h-[500px]"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    className="w-10 h-10 mb-3 animate-spin"
                    style={{ color: "var(--blue)", opacity: 0.6 }}
                  />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    CV&apos;niz olusturuluyor...
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--muted)", opacity: 0.6 }}
                  >
                    Icerik analiz ediliyor, veriler yapilandiriliyor ve PDF&apos;ler
                    uretiliyor.
                  </p>
                  <div
                    className="flex flex-col gap-1.5 mt-4 text-xs"
                    style={{ color: "var(--muted)", opacity: 0.5 }}
                  >
                    <span>1. Veri cikarimi ve yapilandirma...</span>
                    <span>2. Tek Sayfa CV PDF uretimi...</span>
                    <span>3. Harvard CV PDF uretimi...</span>
                  </div>
                </>
              ) : (
                <>
                  <FileText
                    className="w-10 h-10 mb-3"
                    style={{ color: "var(--muted)", opacity: 0.3 }}
                  />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Sol taraftaki alana CV iceriginizi girin ve &quot;CV
                    Olustur&quot; butonuna tiklayin.
                  </p>
                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--muted)", opacity: 0.6 }}
                  >
                    Iki farkli PDF formati otomatik olusturulacaktir:
                  </p>
                  <div
                    className="flex flex-col gap-2 mt-4 text-xs text-left"
                    style={{ color: "var(--muted)", opacity: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--blue)" }}
                      />
                      Tek Sayfa CV — Modern iki kolonlu tasarim
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                      Harvard CV — Akademik ve detayli
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====== PDF Preview Card Component ====== */
function PdfPreviewCard({
  title,
  subtitle,
  accentColor,
  accentBg,
  accentBorder,
  pdfUrl,
  loading,
  onDownload,
  onOpen,
}: {
  title: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  pdfUrl: string | null;
  loading: boolean;
  onDownload: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        border: `1px solid var(--border)`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {subtitle}
            </p>
          </div>
        </div>
        {pdfUrl && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: accentBg,
                border: `1px solid ${accentBorder}`,
                color: accentColor,
              }}
            >
              <ExternalLink className="w-3 h-3" />
              Ac
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: accentColor,
                color: "var(--white)",
              }}
            >
              <Download className="w-3 h-3" />
              Indir
            </button>
          </div>
        )}
      </div>

      {/* PDF Preview Area */}
      <div
        className="relative cursor-pointer"
        onClick={onOpen}
        style={{ height: 320 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2
              className="w-6 h-6 animate-spin mb-2"
              style={{ color: accentColor, opacity: 0.6 }}
            />
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              PDF olusturuluyor...
            </p>
          </div>
        ) : pdfUrl ? (
          <>
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 pointer-events-none"
              title={title}
              style={{ backgroundColor: "#f5f5f5" }}
            />
            {/* Clickable overlay */}
            <div
              className="absolute inset-0 transition-colors hover:bg-black/5"
              style={{ cursor: "pointer" }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText
              className="w-8 h-8 mb-2"
              style={{ color: "var(--muted)", opacity: 0.3 }}
            />
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              PDF olusturulamadi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

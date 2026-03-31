"use client";

import { useState, useRef } from "react";
import {
  FileText,
  Loader2,
  Copy,
  Check,
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
} from "lucide-react";
import type { CVData } from "@/lib/gemini";

type TargetField = "business" | "engineering" | "other";
type ActiveTab = "onepage" | "harvard";

export default function CVPage() {
  const [rawContent, setRawContent] = useState("");
  const [targetField, setTargetField] = useState<TargetField>("other");
  const [activeTab, setActiveTab] = useState<ActiveTab>("onepage");
  const [onePageCV, setOnePageCV] = useState("");
  const [harvardCV, setHarvardCV] = useState("");
  const [extractedData, setExtractedData] = useState<CVData | null>(null);
  const [showExtracted, setShowExtracted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleDownloadPDF(variant: "onepage" | "harvard") {
    if (!extractedData) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/generate-cv-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedData, variant }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "PDF olusturulamadi");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = (extractedData.personalInfo.fullName || "CV")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "_");
      a.download =
        variant === "harvard"
          ? `${safeName}_Harvard.pdf`
          : `${safeName}_OnePage.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF indirilemedi");
    } finally {
      setPdfLoading(false);
    }
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
    setOnePageCV("");
    setHarvardCV("");
    setExtractedData(null);
    setShowExtracted(false);

    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawContent, targetField }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata olustu");
      setOnePageCV(data.onePageCV);
      setHarvardCV(data.harvardCV);
      setExtractedData(data.extractedData);
      setActiveTab("onepage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const text = activeTab === "onepage" ? onePageCV : harvardCV;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const currentCV = activeTab === "onepage" ? onePageCV : harvardCV;
  const hasResults = onePageCV || harvardCV;

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
        optimize edilir
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
Egitim: Istanbul Teknik Universitesi, Bilgisayar Muhendisligi, 85/100 GPA (2022-2026)
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

        {/* Right: Output */}
        <div
          className="rounded-xl p-5 flex flex-col"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Tabs + Copy */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("onepage")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    activeTab === "onepage"
                      ? "var(--blue-bg)"
                      : "transparent",
                  border:
                    activeTab === "onepage"
                      ? "1px solid var(--blue-border)"
                      : "1px solid transparent",
                  color:
                    activeTab === "onepage"
                      ? "var(--blue)"
                      : "var(--muted)",
                }}
              >
                Tek Sayfa CV
              </button>
              <button
                onClick={() => setActiveTab("harvard")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    activeTab === "harvard"
                      ? "var(--gold-bg)"
                      : "transparent",
                  border:
                    activeTab === "harvard"
                      ? "1px solid var(--gold-border)"
                      : "1px solid transparent",
                  color:
                    activeTab === "harvard"
                      ? "var(--gold)"
                      : "var(--muted)",
                }}
              >
                Harvard CV
              </button>
            </div>
            {hasResults && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadPDF(activeTab === "harvard" ? "harvard" : "onepage")}
                  disabled={pdfLoading || !extractedData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--blue)",
                    color: "var(--white)",
                  }}
                >
                  {pdfLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  PDF Indir
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: "var(--surface2)",
                    color: "var(--muted)",
                  }}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Kopyalandi" : "Kopyala"}
                </button>
              </div>
            )}
          </div>

          {/* CV Content */}
          {currentCV ? (
            <div
              className="text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto flex-1"
              style={{
                color: "var(--text)",
                maxHeight: "calc(100vh - 280px)",
              }}
            >
              {currentCV}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center min-h-[400px]">
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
                    Icerik analiz ediliyor, veriler yapilandiriliyor ve iki CV
                    formati uretiliyor.
                  </p>
                  <div
                    className="flex flex-col gap-1.5 mt-4 text-xs"
                    style={{ color: "var(--muted)", opacity: 0.5 }}
                  >
                    <span>1. Veri cikarimi ve yapilandirma...</span>
                    <span>2. Tek sayfa CV uretimi...</span>
                    <span>3. Harvard CV uretimi...</span>
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
                    3 adimli pipeline ile iki farkli format olusturulacaktir:
                  </p>
                  <div
                    className="flex flex-col gap-2 mt-4 text-xs text-left"
                    style={{ color: "var(--muted)", opacity: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5" />
                      Adim 1: Icerik analizi ve veri cikarimi (JSON)
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--blue)" }}
                      />
                      Adim 2: Tek Sayfa CV — Modern ve ozlu
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                      Adim 3: Harvard CV — Akademik ve detayli
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

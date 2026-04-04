"use client";

import { useState, useCallback } from "react";
import type { University } from "@/types";
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
  Globe,
  ScanSearch,
  Info,
  Zap,
} from "lucide-react";

interface LetterSection {
  key: string;
  label: string;
  content: string;
}

interface UniversityInsights {
  mission?: string;
  keywords?: string[];
  values?: string[];
  uniqueAspects?: string[];
}

const SECTION_LABELS: Record<string, string> = {
  OPENING: "Giriş",
  ACADEMIC_BACKGROUND: "Akademik Geçmiş",
  WHY_THIS_PROGRAM: "Neden Bu Program",
  EXPERIENCE: "Deneyim & Aktiviteler",
  CAREER_GOALS: "Kariyer Hedefleri",
  CLOSING: "Kapanış",
};

const LETTER_TYPE_LABELS: Record<string, string> = {
  motivation_letter: "Motivasyon Mektubu",
  personal_statement: "Personal Statement",
  statement_of_purpose: "Statement of Purpose",
  cover_letter: "Cover Letter",
};

const LETTER_TYPE_DESCRIPTIONS: Record<string, string> = {
  motivation_letter: "Kişisel motivasyonunuzu ve akademik hedeflerinizi açıklayan standart mektup formatı",
  personal_statement: "Konu hakkındaki tutkunuzu ve entelektüel yolculuğunuzu anlatan kişisel deneme (UCAS formatı)",
  statement_of_purpose: "Akademik hedeflerinizi, deneyimlerinizi ve kariyer planlarınızı özetleyen profesyonel belge",
  cover_letter: "Resmi selamlama ve kapanışlı, kısa ve öz profesyonel mektup formatı",
};

const MOTIVATION_LANGUAGE_LABELS: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  fr: { label: "Français", flag: "🇫🇷" },
  it: { label: "Italiano", flag: "🇮🇹" },
  nl: { label: "Nederlands", flag: "🇳🇱" },
};

const TONE_LABELS: Record<string, string> = {
  academic: "Akademik Odaklı",
  personal: "Kişisel & Samimi",
  research_focused: "Araştırma Odaklı",
  project_focused: "Proje & Uygulama Odaklı",
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

interface DemoData {
  studentName: string;
  gpa: number;
  strengths: string;
  motivation: string;
  languageLevel: string;
  extracurriculars: string;
  careerGoals: string;
}

function getDemoData(): DemoData {
  return {
    studentName: "Ayşe Kaya",
    gpa: 88,
    strengths: "TED Ankara Koleji'nde 4 yıl boyunca onur listesinde yer aldım. AP Physics C ve Statistics sınavlarından 5/5, Chemistry'den 4/5 aldım. Siemens Türkiye'de mühendislik departmanında staj yaptım — endüstriyel otomasyon ürünlerinde kalite kontrol süreçlerine katkıda bulundum ve haftalık üretim verimlilik raporları hazırladım. Python ve veri analizi konusunda deneyimliyim, Boğaziçi Üniversitesi yaz araştırma programında yenilenebilir enerji sistemleri üzerine çalıştım.",
    motivation: "Küçük yaşlardan itibaren teknolojinin toplumu nasıl dönüştürdüğünü gözlemlemek beni mühendislik alanına yöneltti. Özellikle sürdürülebilir enerji ve akıllı sistemler konusunda çalışmak istiyorum. Avrupa'daki güçlü araştırma altyapısı ve uluslararası iş birliği fırsatları beni çekiyor. Bu programın sunduğu pratik proje deneyimi ve endüstri bağlantıları, kariyer hedeflerime ulaşmam için ideal bir zemin oluşturuyor.",
    languageLevel: "IELTS 7.0",
    extracurriculars: "MUN Kulübü Genel Sekreteri — 15 okuldan 200+ katılımcıyla TEDMUN konferansı organize ettim. Bilim ve Teknoloji Kulübü Başkan Yardımcısı — robotik, kodlama ve bilimsel araştırma yöntemleri üzerine haftalık atölyeler düzenledim. 5 yıldır yarışmalı voleybol oynuyorum, okul takımı kaptanıyım. 8 yıldır piyano çalıyorum (ABRSM Grade 7).",
    careerGoals: "Mezuniyet sonrası yenilenebilir enerji veya akıllı şehir teknolojileri alanında Ar-Ge mühendisi olarak çalışmak istiyorum. Uzun vadede Türkiye'nin sürdürülebilir enerji dönüşümüne katkıda bulunacak projeler geliştirmeyi hedefliyorum. Yüksek lisans yapmayı da planlıyorum.",
  };
}

export default function MotivasyonClient({ universities }: { universities: University[] }) {
  // Form state
  const [studentName, setStudentName] = useState("");
  const [selectedUni, setSelectedUni] = useState(universities[0]?.id ?? "");
  const [gpa, setGpa] = useState(75);
  const [strengths, setStrengths] = useState("");
  const [motivation, setMotivation] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [tone, setTone] = useState("balanced");
  const [letterLanguage, setLetterLanguage] = useState("en");
  const [targetWordCount, setTargetWordCount] = useState(500);

  // Output state
  const [rawLetter, setRawLetter] = useState("");
  const [sections, setSections] = useState<LetterSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Section regeneration & inline editing
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [editInstruction, setEditInstruction] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [inlineEditingSection, setInlineEditingSection] = useState<string | null>(null);
  const [inlineEditText, setInlineEditText] = useState("");

  // Validation
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  // University scraping
  const [universityUrl, setUniversityUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");    // hard error (red)
  const [scrapeWarning, setScrapeWarning] = useState(""); // soft warning (gold)
  const [robotsBlocked, setRobotsBlocked] = useState(false);
  const [universityInsights, setUniversityInsights] = useState<UniversityInsights | null>(null);

  // UI state
  const [showTips, setShowTips] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  function handleFillDemo() {
    const demo = getDemoData();
    setStudentName(demo.studentName);
    setGpa(demo.gpa);
    setStrengths(demo.strengths);
    setMotivation(demo.motivation);
    setLanguageLevel(demo.languageLevel);
    setExtracurriculars(demo.extracurriculars);
    setCareerGoals(demo.careerGoals);
    setShowAdvanced(true);
    setFieldErrors({});
    setError("");
  }

  const uni = universities.find((u) => u.id === selectedUni)!;

  // Auto-set letter language and word count when university changes
  const handleUniChange = useCallback((uniId: string) => {
    setSelectedUni(uniId);
    const selected = universities.find((u) => u.id === uniId);
    if (selected) {
      if (selected.motivationLanguage) {
        setLetterLanguage(selected.motivationLanguage);
      }
      if (selected.motivationMaxWords) {
        // Map to nearest available option
        const options = [300, 500, 750, 1000];
        const closest = options.reduce((prev, curr) =>
          Math.abs(curr - (selected.motivationMaxWords || 500)) < Math.abs(prev - (selected.motivationMaxWords || 500)) ? curr : prev
        );
        setTargetWordCount(closest);
      }
    }
    // Reset scrape data when university changes
    setUniversityInsights(null);
    setScrapeError("");
    setScrapeWarning("");
  }, [universities]);

  const getPlainText = useCallback(() => {
    if (sections.length === 0) return rawLetter;
    return sections.map((s) => s.content).join("\n\n");
  }, [sections, rawLetter]);

  async function handleScrape() {
    if (!universityUrl) return;
    setScraping(true);
    setScrapeError("");
    setScrapeWarning("");
    setRobotsBlocked(false);
    setUniversityInsights(null);
    try {
      const res = await fetch("/api/scrape-university", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: universityUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Hard errors: robots blocked, network issues, invalid URL
        if (data.robotsBlocked) setRobotsBlocked(true);
        setScrapeError(data.error || "Site taranamadı.");
        return;
      }
      // Successful response (possibly with a soft warning)
      setUniversityInsights(data.insights);
      if (data.warning) setScrapeWarning(data.warning);
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "Site taranamadı.");
    } finally {
      setScraping(false);
    }
  }

  function handleStartInlineEdit(sectionKey: string, content: string) {
    setInlineEditingSection(sectionKey);
    setInlineEditText(content);
  }

  function handleSaveInlineEdit(sectionKey: string) {
    setSections((prev) =>
      prev.map((s) => (s.key === sectionKey ? { ...s, content: inlineEditText } : s))
    );
    setInlineEditingSection(null);
    setInlineEditText("");
  }

  async function handleGenerate() {
    const errors: Record<string, boolean> = {};
    if (!studentName) errors.studentName = true;
    if (!strengths) errors.strengths = true;
    if (!motivation) errors.motivation = true;
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }
    setError("");
    setLoading(true);
    setRawLetter("");
    setSections([]);

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
          letterLanguage,
          wordCount: targetWordCount,
          universityInsights: universityInsights || undefined,
          motivationLetterType: uni.motivationLetterType || undefined,
          motivationGuidelines: uni.motivationGuidelines || undefined,
          motivationTonePreference: uni.motivationTonePreference || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu");

      setRawLetter(data.letter);
      const parsed = parseSections(data.letter);
      setSections(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mektup oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
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
          letterLanguage,
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
                  text: uni.motivationLetterType
                    ? (LETTER_TYPE_LABELS[uni.motivationLetterType] || "Motivation Letter")
                    : (letterLanguage === "fr" ? "Lettre de Motivation" : "Motivation Letter"),
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleFillDemo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--gold-bg)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Demo ile Doldur
          </button>
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
              onChange={(e) => { setStudentName(e.target.value); setFieldErrors((p) => ({ ...p, studentName: false })); }}
              placeholder="Örn: Eren Işıklar"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: `1px solid ${fieldErrors.studentName ? "var(--danger)" : "var(--border)"}`,
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
              onChange={(e) => handleUniChange(e.target.value)}
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

          {/* University Motivation Requirements */}
          {uni && (uni.motivationLetterType || uni.motivationGuidelines) && (
            <div
              className="rounded-lg p-3 space-y-2"
              style={{ backgroundColor: "var(--blue-bg)", border: "1px solid var(--blue-border)" }}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--blue)" }}>
                <Info className="w-3.5 h-3.5" />
                Bu Üniversitenin Beklentileri
              </div>
              <div className="flex flex-wrap gap-2">
                {uni.motivationLetterType && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "var(--blue-border)", color: "var(--blue)" }}
                  >
                    {LETTER_TYPE_LABELS[uni.motivationLetterType] || uni.motivationLetterType}
                  </span>
                )}
                {uni.motivationLanguage && MOTIVATION_LANGUAGE_LABELS[uni.motivationLanguage] && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "var(--blue-border)", color: "var(--blue)" }}
                  >
                    {MOTIVATION_LANGUAGE_LABELS[uni.motivationLanguage].flag} {MOTIVATION_LANGUAGE_LABELS[uni.motivationLanguage].label}
                  </span>
                )}
                {uni.motivationTonePreference && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "var(--gold-bg)", color: "var(--gold)" }}
                  >
                    {TONE_LABELS[uni.motivationTonePreference] || uni.motivationTonePreference}
                  </span>
                )}
                {uni.motivationMaxWords && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
                  >
                    Maks. {uni.motivationMaxWords} kelime
                  </span>
                )}
              </div>
              {uni.motivationLetterType && LETTER_TYPE_DESCRIPTIONS[uni.motivationLetterType] && (
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {LETTER_TYPE_DESCRIPTIONS[uni.motivationLetterType]}
                </p>
              )}
              {uni.motivationGuidelines && (
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text)" }}>
                  {uni.motivationGuidelines}
                </p>
              )}
            </div>
          )}

          {/* University URL Scraper */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Program Sayfası URL&apos;si
              <span
                className="ml-1.5 text-[10px] font-normal px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
              >
                AI kişiselleştirme
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={universityUrl}
                onChange={(e) => {
                  setUniversityUrl(e.target.value);
                  setUniversityInsights(null);
                  setScrapeError("");
                  setScrapeWarning("");
                  setRobotsBlocked(false);
                }}
                placeholder="https://www.university.edu/program"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                style={{
                  backgroundColor: "var(--surface2)",
                  border: `1px solid ${universityInsights ? "var(--blue-border)" : "var(--border)"}`,
                  color: "var(--text)",
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleScrape(); }}
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={!universityUrl || scraping}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-40 flex-shrink-0"
                style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)", border: "1px solid var(--blue-border)" }}
              >
                {scraping ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ScanSearch className="w-3.5 h-3.5" />
                )}
                {scraping ? "Tarıyor..." : "Tara"}
              </button>
            </div>

            {scrapeError && (
              <div
                className="mt-1.5 rounded-lg px-3 py-2 text-[11px] leading-relaxed"
                style={{
                  backgroundColor: "var(--danger-bg)",
                  border: "1px solid var(--danger)",
                  color: "var(--danger)",
                }}
              >
                {scrapeError}
              </div>
            )}
            {scrapeWarning && (
              <div
                className="mt-1.5 rounded-lg px-3 py-2 text-[11px] leading-relaxed"
                style={{
                  backgroundColor: "var(--gold-bg)",
                  border: "1px solid var(--gold-border)",
                  color: "var(--gold-light)",
                }}
              >
                {scrapeWarning}
              </div>
            )}

            {universityInsights && (
              <div
                className="mt-2 rounded-lg p-3 space-y-2"
                style={{ backgroundColor: "var(--blue-bg)", border: "1px solid var(--blue-border)" }}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "var(--blue)" }}>
                  <Globe className="w-3.5 h-3.5" />
                  Site tarandı — mektup kişiselleştirilecek
                </div>
                {universityInsights.mission && (
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text)" }}>
                    {universityInsights.mission}
                  </p>
                )}
                {universityInsights.keywords && universityInsights.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {universityInsights.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: "var(--blue-border)", color: "var(--blue)" }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                {universityInsights.uniqueAspects && universityInsights.uniqueAspects.length > 0 && (
                  <ul className="space-y-0.5">
                    {universityInsights.uniqueAspects.map((aspect) => (
                      <li key={aspect} className="text-[11px] flex items-start gap-1" style={{ color: "var(--muted)" }}>
                        <span style={{ color: "var(--blue)" }}>•</span> {aspect}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
              onChange={(e) => { setStrengths(e.target.value); setFieldErrors((p) => ({ ...p, strengths: false })); }}
              placeholder="Stajlar, projeler, başarılar, teknik beceriler..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: `1px solid ${fieldErrors.strengths ? "var(--danger)" : "var(--border)"}`,
                color: "var(--text)",
              }}
            />
            {strengths && (
              <p className="text-[10px] text-right mt-0.5" style={{ color: "var(--muted)" }}>
                {wordCount(strengths)} kelime
              </p>
            )}
          </div>

          {/* Motivation */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Motivasyonunuz *
            </label>
            <textarea
              value={motivation}
              onChange={(e) => { setMotivation(e.target.value); setFieldErrors((p) => ({ ...p, motivation: false })); }}
              placeholder="Bu üniversiteyi ve programı neden seçtiniz, sizi ne heyecanlandırıyor..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{
                backgroundColor: "var(--surface2)",
                border: `1px solid ${fieldErrors.motivation ? "var(--danger)" : "var(--border)"}`,
                color: "var(--text)",
              }}
            />
            {motivation && (
              <p className="text-[10px] text-right mt-0.5" style={{ color: "var(--muted)" }}>
                {wordCount(motivation)} kelime
              </p>
            )}
          </div>

          {/* Letter Language */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              Mektup Dili
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "en", label: "English", flag: "🇬🇧" },
                { value: "de", label: "Deutsch", flag: "🇩🇪" },
                { value: "fr", label: "Français", flag: "🇫🇷" },
                { value: "it", label: "Italiano", flag: "🇮🇹" },
                { value: "nl", label: "Nederlands", flag: "🇳🇱" },
              ].map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLetterLanguage(lang.value)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: letterLanguage === lang.value ? "var(--blue-bg)" : "var(--surface2)",
                    border: `1px solid ${letterLanguage === lang.value ? "var(--blue-border)" : "var(--border)"}`,
                    color: letterLanguage === lang.value ? "var(--blue)" : "var(--muted)",
                  }}
                >
                  <span>{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
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
                  placeholder={letterLanguage === "fr" ? "Örn: DELF B2, DALF C1, TCF B2" : "Örn: IELTS 7.0, TOEFL 95, B2, C1"}
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
                    Kelime Üst Sınırı
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
                    <option value={300}>300 kelime</option>
                    <option value={500}>500 kelime</option>
                    <option value={750}>750 kelime</option>
                    <option value={1000}>1000 kelime</option>
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
                <Sparkles className="w-4 h-4" />
                {hasLetter ? "Yeniden Oluştur" : "Mektup Oluştur"}
              </>
            )}
          </button>

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
                      currentWordCount > targetWordCount
                        ? "var(--danger-bg)"
                        : currentWordCount >= targetWordCount * 0.8
                          ? "var(--success-bg)"
                          : "var(--gold-bg)",
                    color:
                      currentWordCount > targetWordCount
                        ? "var(--danger)"
                        : currentWordCount >= targetWordCount * 0.8
                          ? "var(--success)"
                          : "var(--gold)",
                  }}
                >
                  {currentWordCount} / {targetWordCount} kelime
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
                                onClick={() => handleStartInlineEdit(section.key, section.content)}
                                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
                                title="Metni elle düzenle"
                              >
                                <PenLine className="w-3 h-3" /> Elle Düzenle
                              </button>
                              <button
                                onClick={() => setEditingSection(section.key)}
                                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: "var(--gold-bg)", color: "var(--gold)" }}
                                title="AI ile yönlendirmeli yeniden yaz"
                              >
                                <Sparkles className="w-3 h-3" /> AI Düzenle
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

                      {inlineEditingSection === section.key ? (
                        <div className="space-y-2">
                          <textarea
                            value={inlineEditText}
                            onChange={(e) => setInlineEditText(e.target.value)}
                            rows={Math.max(4, inlineEditText.split("\n").length + 2)}
                            className="w-full px-3 py-2 rounded-lg text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-200 transition-shadow resize-y"
                            style={{
                              backgroundColor: "var(--surface2)",
                              border: "1px solid var(--blue-border)",
                              color: "var(--text)",
                            }}
                            autoFocus
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                              {wordCount(inlineEditText)} kelime
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setInlineEditingSection(null); setInlineEditText(""); }}
                                className="px-3 py-1 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
                              >
                                Vazgeç
                              </button>
                              <button
                                onClick={() => handleSaveInlineEdit(section.key)}
                                className="px-3 py-1 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
                              >
                                Kaydet
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p
                          className="text-sm leading-relaxed cursor-text rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors hover:bg-[var(--surface2)]"
                          style={{
                            color: "var(--text)",
                            opacity: regeneratingSection === section.key ? 0.5 : 1,
                            transition: "opacity 0.2s",
                          }}
                          onClick={() => handleStartInlineEdit(section.key, section.content)}
                          title="Metni düzenlemek için tıklayın"
                        >
                          {section.content}
                        </p>
                      )}
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
                  Sol taraftaki formu doldurun. AI, seçtiğiniz üniversite ve programa özel{" "}
                  {letterLanguage === "fr" ? "Fransızca" : "İngilizce"} motivasyon mektubu oluşturacak.
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

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Users,
  Wrench,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  AlertTriangle,
  Check,
} from "lucide-react";
import type { CVData } from "@/lib/gemini";

/* ====== Step definitions ====== */
const STEPS = [
  { label: "Kişisel Bilgiler", icon: User },
  { label: "Eğitim", icon: GraduationCap },
  { label: "İş Deneyimi", icon: Briefcase },
  { label: "Projeler", icon: FolderOpen },
  { label: "Aktiviteler", icon: Users },
  { label: "Beceriler & Diller", icon: Wrench },
  { label: "Ödüller", icon: Award },
  { label: "Önizleme", icon: Eye },
];

/* ====== Helpers ====== */
function emptyEducation() {
  return { institution: "", degree: "", field: "", gpa: "", startDate: "", endDate: "", highlights: [] as string[] };
}
function emptyExperience() {
  return { company: "", role: "", startDate: "", endDate: "", bullets: [] as string[] };
}
function emptyProject() {
  return { name: "", description: "", technologies: "", highlights: [] as string[] };
}
function emptyLeadership() {
  return { role: "", organization: "", period: "", description: "" };
}
function emptyAward() {
  return { title: "", issuer: "", date: "", description: "" };
}

function initialCVData(): CVData {
  return {
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", website: "" },
    education: [emptyEducation()],
    experience: [],
    projects: [],
    skills: { technical: [], languages: [], certifications: [], other: [] },
    leadership: [],
    awards: [],
    detectedField: "other",
  };
}

/* ====== Shared input styles ====== */
const inputClass = "w-full px-3 py-2 rounded-lg text-sm outline-none";
const inputStyle = {
  backgroundColor: "var(--surface2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
};
const labelClass = "text-xs font-medium block mb-1";
const labelStyle = { color: "var(--muted)" };

/* ====== Input Component ====== */
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  fullWidth,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <label className={labelClass} style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
        style={inputStyle}
      />
    </div>
  );
}

/* ====== Entry Card Wrapper ====== */
function EntryCard({
  children,
  onRemove,
  index,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  index: number;
}) {
  return (
    <div
      className="rounded-lg p-4 mb-3 relative"
      style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
    >
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 p-1 rounded hover:opacity-70 transition-opacity"
        style={{ color: "var(--danger)" }}
        title="Kaldır"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs font-medium mb-3 block" style={{ color: "var(--muted)" }}>
        #{index + 1}
      </span>
      {children}
    </div>
  );
}

/* ====== Add Button ====== */
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
      style={{
        backgroundColor: "var(--blue-bg)",
        border: "1px solid var(--blue-border)",
        color: "var(--blue)",
      }}
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ====== Bullet/Highlight List ====== */
function StringListField({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="col-span-2 mt-1">
      <label className={labelClass} style={labelStyle}>{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-1.5">
          <input
            value={item}
            onChange={(e) => {
              const copy = [...items];
              copy[i] = e.target.value;
              onChange(copy);
            }}
            placeholder={placeholder}
            className={`${inputClass} flex-1`}
            style={inputStyle}
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="px-2 rounded hover:opacity-70"
            style={{ color: "var(--danger)" }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="text-xs mt-1 hover:opacity-70 transition-opacity"
        style={{ color: "var(--blue)" }}
      >
        + Ekle
      </button>
    </div>
  );
}

/* ============================================ */
/* MAIN PAGE COMPONENT                          */
/* ============================================ */
export default function CVPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CVData>(initialCVData);
  const [enhancedData, setEnhancedData] = useState<CVData | null>(null);

  // PDF preview state
  const [onePageUrl, setOnePageUrl] = useState<string | null>(null);
  const [harvardUrl, setHarvardUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (onePageUrl) URL.revokeObjectURL(onePageUrl);
      if (harvardUrl) URL.revokeObjectURL(harvardUrl);
    };
  }, [onePageUrl, harvardUrl]);

  // Helper: update a top-level field
  function update<K extends keyof CVData>(key: K, value: CVData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  // Helper: update personalInfo field
  function updatePersonal(field: keyof CVData["personalInfo"], value: string) {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }

  // Enhance + Generate PDFs
  const generatePdfs = useCallback(async () => {
    if (onePageUrl) URL.revokeObjectURL(onePageUrl);
    if (harvardUrl) URL.revokeObjectURL(harvardUrl);
    setOnePageUrl(null);
    setHarvardUrl(null);
    setEnhanceError("");
    setEnhancing(true);
    setPdfLoading(true);

    try {
      // Step 1: AI Enhancement
      let finalData = data;
      try {
        const enhanceRes = await fetch("/api/enhance-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvData: data }),
        });
        if (enhanceRes.ok) {
          const { enhancedData: ed } = await enhanceRes.json();
          if (ed) {
            finalData = ed;
            setEnhancedData(ed);
          }
        }
      } catch {
        // Enhancement failed — use raw data
      }
      setEnhancing(false);

      // Step 2: Generate both PDFs in parallel
      const [op, hv] = await Promise.all([
        fetchPdf(finalData, "onepage"),
        fetchPdf(finalData, "harvard"),
      ]);
      setOnePageUrl(op);
      setHarvardUrl(hv);
    } catch {
      setEnhanceError("PDF oluşturulurken bir hata oluştu.");
    } finally {
      setEnhancing(false);
      setPdfLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Navigate
  function goNext() {
    if (step < STEPS.length - 1) {
      const next = step + 1;
      setStep(next);
      if (next === STEPS.length - 1) generatePdfs();
    }
  }
  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  const StepIcon = STEPS[step].icon;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        CV Oluşturucu
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Bilgilerinizi adım adım girin — profesyonel PDF CV&apos;ler otomatik oluşturulur
      </p>

      {/* Progress Bar */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <button
              key={i}
              onClick={() => {
                setStep(i);
                if (i === STEPS.length - 1) generatePdfs();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive
                  ? "var(--blue-bg)"
                  : isDone
                    ? "var(--success-bg)"
                    : "transparent",
                border: isActive
                  ? "1px solid var(--blue-border)"
                  : isDone
                    ? "1px solid rgba(34,197,94,0.25)"
                    : "1px solid var(--border)",
                color: isActive
                  ? "var(--blue)"
                  : isDone
                    ? "var(--success)"
                    : "var(--muted)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Step Header */}
        {step < STEPS.length - 1 && (
          <div className="flex items-center gap-2 mb-5">
            <StepIcon className="w-5 h-5" style={{ color: "var(--blue)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
              {STEPS[step].label}
            </h2>
            <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>
              Adım {step + 1} / {STEPS.length}
            </span>
          </div>
        )}

        {/* STEP 0: Personal Info */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ad Soyad *" value={data.personalInfo.fullName} onChange={(v) => updatePersonal("fullName", v)} placeholder="Elif Yılmaz" fullWidth />
            <Field label="E-posta" value={data.personalInfo.email || ""} onChange={(v) => updatePersonal("email", v)} placeholder="elif@email.com" />
            <Field label="Telefon" value={data.personalInfo.phone || ""} onChange={(v) => updatePersonal("phone", v)} placeholder="+90 532 111 2233" />
            <Field label="Konum" value={data.personalInfo.location || ""} onChange={(v) => updatePersonal("location", v)} placeholder="İstanbul, Türkiye" fullWidth />
            <Field label="LinkedIn" value={data.personalInfo.linkedin || ""} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/..." />
            <Field label="Web Sitesi" value={data.personalInfo.website || ""} onChange={(v) => updatePersonal("website", v)} placeholder="github.com/..." />

            {/* Target Field */}
            <div className="col-span-2 mt-2">
              <label className={labelClass} style={labelStyle}>Hedef Alan</label>
              <div className="flex gap-2">
                {([
                  { value: "business" as const, label: "Business / Ekonomi" },
                  { value: "engineering" as const, label: "Mühendislik / STEM" },
                  { value: "other" as const, label: "Diğer / Genel" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("detectedField", opt.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: data.detectedField === opt.value ? "var(--blue-bg)" : "var(--surface2)",
                      border: data.detectedField === opt.value ? "1px solid var(--blue-border)" : "1px solid var(--border)",
                      color: data.detectedField === opt.value ? "var(--blue)" : "var(--muted)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Education */}
        {step === 1 && (
          <div>
            {data.education.map((edu, i) => (
              <EntryCard key={i} index={i} onRemove={() => update("education", data.education.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Kurum" value={edu.institution} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], institution: v }; update("education", copy);
                  }} placeholder="Robert Kolej" fullWidth />
                  <Field label="Derece" value={edu.degree || ""} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], degree: v }; update("education", copy);
                  }} placeholder="Lise / Lisans" />
                  <Field label="Bölüm / Alan" value={edu.field || ""} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], field: v }; update("education", copy);
                  }} placeholder="Fen Bilimleri" />
                  <Field label="GPA" value={edu.gpa || ""} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], gpa: v }; update("education", copy);
                  }} placeholder="3.8/4.0" />
                  <Field label="Başlangıç" value={edu.startDate || ""} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], startDate: v }; update("education", copy);
                  }} placeholder="2022" />
                  <Field label="Bitiş" value={edu.endDate || ""} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], endDate: v }; update("education", copy);
                  }} placeholder="2026" />
                  <StringListField label="Başarılar / Notlar" items={edu.highlights || []} onChange={(items) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], highlights: items }; update("education", copy);
                  }} placeholder="Onur listesi, AP dersleri..." />
                </div>
              </EntryCard>
            ))}
            <AddButton label="Eğitim Ekle" onClick={() => update("education", [...data.education, emptyEducation()])} />
          </div>
        )}

        {/* STEP 2: Experience */}
        {step === 2 && (
          <div>
            {data.experience.length === 0 && (
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Henüz iş deneyimi eklenmedi. Yoksa bu adımı atlayabilirsiniz.
              </p>
            )}
            {data.experience.map((exp, i) => (
              <EntryCard key={i} index={i} onRemove={() => update("experience", data.experience.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Şirket / Kurum" value={exp.company} onChange={(v) => {
                    const copy = [...data.experience]; copy[i] = { ...copy[i], company: v }; update("experience", copy);
                  }} placeholder="TurkTech Yazılım" fullWidth />
                  <Field label="Pozisyon" value={exp.role} onChange={(v) => {
                    const copy = [...data.experience]; copy[i] = { ...copy[i], role: v }; update("experience", copy);
                  }} placeholder="Yazılım Stajyeri" fullWidth />
                  <Field label="Başlangıç" value={exp.startDate || ""} onChange={(v) => {
                    const copy = [...data.experience]; copy[i] = { ...copy[i], startDate: v }; update("experience", copy);
                  }} placeholder="Haziran 2025" />
                  <Field label="Bitiş" value={exp.endDate || ""} onChange={(v) => {
                    const copy = [...data.experience]; copy[i] = { ...copy[i], endDate: v }; update("experience", copy);
                  }} placeholder="Ağustos 2025" />
                  <StringListField label="Görevler / Başarılar" items={exp.bullets || []} onChange={(items) => {
                    const copy = [...data.experience]; copy[i] = { ...copy[i], bullets: items }; update("experience", copy);
                  }} placeholder="React ile portal geliştirdim..." />
                </div>
              </EntryCard>
            ))}
            <AddButton label="Deneyim Ekle" onClick={() => update("experience", [...data.experience, emptyExperience()])} />
          </div>
        )}

        {/* STEP 3: Projects */}
        {step === 3 && (
          <div>
            {data.projects.length === 0 && (
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Henüz proje eklenmedi. Yoksa bu adımı atlayabilirsiniz.
              </p>
            )}
            {data.projects.map((proj, i) => (
              <EntryCard key={i} index={i} onRemove={() => update("projects", data.projects.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Proje Adı" value={proj.name} onChange={(v) => {
                    const copy = [...data.projects]; copy[i] = { ...copy[i], name: v }; update("projects", copy);
                  }} placeholder="Duygu Analizi Uygulaması" fullWidth />
                  <Field label="Teknolojiler" value={proj.technologies || ""} onChange={(v) => {
                    const copy = [...data.projects]; copy[i] = { ...copy[i], technologies: v }; update("projects", copy);
                  }} placeholder="Python, TensorFlow" fullWidth />
                  <div className="col-span-2">
                    <label className={labelClass} style={labelStyle}>Açıklama</label>
                    <textarea
                      value={proj.description || ""}
                      onChange={(e) => {
                        const copy = [...data.projects]; copy[i] = { ...copy[i], description: e.target.value }; update("projects", copy);
                      }}
                      placeholder="Projenin kısa açıklaması..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                    />
                  </div>
                  <StringListField label="Detaylar" items={proj.highlights || []} onChange={(items) => {
                    const copy = [...data.projects]; copy[i] = { ...copy[i], highlights: items }; update("projects", copy);
                  }} placeholder="Proje detayı..." />
                </div>
              </EntryCard>
            ))}
            <AddButton label="Proje Ekle" onClick={() => update("projects", [...data.projects, emptyProject()])} />
          </div>
        )}

        {/* STEP 4: Leadership & Activities */}
        {step === 4 && (
          <div>
            {data.leadership.length === 0 && (
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Henüz aktivite eklenmedi. Yoksa bu adımı atlayabilirsiniz.
              </p>
            )}
            {data.leadership.map((lead, i) => (
              <EntryCard key={i} index={i} onRemove={() => update("leadership", data.leadership.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Organizasyon" value={lead.organization} onChange={(v) => {
                    const copy = [...data.leadership]; copy[i] = { ...copy[i], organization: v }; update("leadership", copy);
                  }} placeholder="Yazılım Kulübü" fullWidth />
                  <Field label="Rol" value={lead.role} onChange={(v) => {
                    const copy = [...data.leadership]; copy[i] = { ...copy[i], role: v }; update("leadership", copy);
                  }} placeholder="Başkan" />
                  <Field label="Dönem" value={lead.period || ""} onChange={(v) => {
                    const copy = [...data.leadership]; copy[i] = { ...copy[i], period: v }; update("leadership", copy);
                  }} placeholder="2024 - 2025" />
                  <div className="col-span-2">
                    <label className={labelClass} style={labelStyle}>Açıklama</label>
                    <textarea
                      value={lead.description || ""}
                      onChange={(e) => {
                        const copy = [...data.leadership]; copy[i] = { ...copy[i], description: e.target.value }; update("leadership", copy);
                      }}
                      placeholder="Görev ve başarılarınız..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </EntryCard>
            ))}
            <AddButton label="Aktivite Ekle" onClick={() => update("leadership", [...data.leadership, emptyLeadership()])} />
          </div>
        )}

        {/* STEP 5: Skills & Languages */}
        {step === 5 && (
          <div className="space-y-4">
            <SkillsTextarea
              label="Teknik Beceriler"
              placeholder="Python, JavaScript, React, SQL, Git, Docker..."
              items={data.skills.technical || []}
              onChange={(items) => update("skills", { ...data.skills, technical: items })}
            />
            <SkillsTextarea
              label="Diller"
              placeholder="Turkce (Ana dil), Ingilizce (C1 - IELTS 7.0), Almanca (B1)..."
              items={data.skills.languages || []}
              onChange={(items) => update("skills", { ...data.skills, languages: items })}
            />
            <SkillsTextarea
              label="Sertifikalar"
              placeholder="IELTS 7.0, AWS Cloud Practitioner, Cambridge FCE..."
              items={data.skills.certifications || []}
              onChange={(items) => update("skills", { ...data.skills, certifications: items })}
            />
            <SkillsTextarea
              label="Diğer Beceriler"
              placeholder="Takım çalışması, Proje yönetimi, Sunum..."
              items={data.skills.other || []}
              onChange={(items) => update("skills", { ...data.skills, other: items })}
            />
          </div>
        )}

        {/* STEP 6: Awards */}
        {step === 6 && (
          <div>
            {data.awards.length === 0 && (
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Henüz ödül eklenmedi. Yoksa bu adımı atlayabilirsiniz.
              </p>
            )}
            {data.awards.map((award, i) => (
              <EntryCard key={i} index={i} onRemove={() => update("awards", data.awards.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ödül Adı" value={award.title} onChange={(v) => {
                    const copy = [...data.awards]; copy[i] = { ...copy[i], title: v }; update("awards", copy);
                  }} placeholder="TÜBİTAK Proje Yarışması Birincilik" fullWidth />
                  <Field label="Veren Kurum" value={award.issuer || ""} onChange={(v) => {
                    const copy = [...data.awards]; copy[i] = { ...copy[i], issuer: v }; update("awards", copy);
                  }} placeholder="TÜBİTAK" />
                  <Field label="Tarih" value={award.date || ""} onChange={(v) => {
                    const copy = [...data.awards]; copy[i] = { ...copy[i], date: v }; update("awards", copy);
                  }} placeholder="2025" />
                  <div className="col-span-2">
                    <label className={labelClass} style={labelStyle}>Açıklama</label>
                    <textarea
                      value={award.description || ""}
                      onChange={(e) => {
                        const copy = [...data.awards]; copy[i] = { ...copy[i], description: e.target.value }; update("awards", copy);
                      }}
                      placeholder="Ödül hakkında kısa bilgi..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </EntryCard>
            ))}
            <AddButton label="Ödül Ekle" onClick={() => update("awards", [...data.awards, emptyAward()])} />
          </div>
        )}

        {/* STEP 7: Preview */}
        {step === 7 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Eye className="w-5 h-5" style={{ color: "var(--blue)" }} />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                CV Önizleme
              </h2>
              <button
                onClick={generatePdfs}
                disabled={pdfLoading || enhancing}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--blue-bg)",
                  border: "1px solid var(--blue-border)",
                  color: "var(--blue)",
                }}
              >
                {(pdfLoading || enhancing) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                Yeniden Oluştur
              </button>
            </div>

            {/* AI Enhancement Status */}
            {enhancing && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs mb-4"
                style={{
                  backgroundColor: "var(--blue-bg)",
                  border: "1px solid var(--blue-border)",
                  color: "var(--blue)",
                }}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI içeriğinizi profesyonelleştiriyor — yazım düzeltme, İngilizce&apos;ye çeviri, aksiyon fiilleri ekleniyor...</span>
              </div>
            )}

            {enhancedData && !enhancing && !pdfLoading && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs mb-4"
                style={{
                  backgroundColor: "var(--success-bg)",
                  border: "1px solid rgba(22,163,74,0.25)",
                  color: "var(--success)",
                }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>İçerik AI tarafından optimize edildi — yazım düzeltildi, profesyonel dil kullanıldı, tarih formatları standartlaştırıldı.</span>
              </div>
            )}

            {enhanceError && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs mb-4"
                style={{
                  backgroundColor: "var(--danger-bg)",
                  border: "1px solid rgba(220,38,38,0.25)",
                  color: "var(--danger)",
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{enhanceError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <PdfCard
                title="Tek Sayfa CV"
                subtitle="Modern iki kolonlu tasarım"
                accentColor="var(--blue)"
                accentBg="var(--blue-bg)"
                accentBorder="var(--blue-border)"
                pdfUrl={onePageUrl}
                loading={pdfLoading || enhancing}
                extractedData={enhancedData || data}
                variant="onepage"
              />
              <PdfCard
                title="Harvard CV"
                subtitle="Akademik ve detaylı format"
                accentColor="var(--gold)"
                accentBg="var(--gold-bg)"
                accentBorder="var(--gold-border)"
                pdfUrl={harvardUrl}
                loading={pdfLoading || enhancing}
                extractedData={enhancedData || data}
                variant="harvard"
              />
            </div>

            {/* Disclaimer */}
            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs mt-4"
              style={{
                backgroundColor: "var(--gold-bg)",
                border: "1px solid var(--gold-border)",
                color: "var(--gold)",
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                Oluşturulan CV&apos;yi gönderim öncesi mutlaka kontrol edin.
                Üniversitenin resmi gereksinimlerini doğrulayın.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < STEPS.length - 1 && (
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            {step > 0 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Geri
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={goNext}
              disabled={step === 0 && !data.personalInfo.fullName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
            >
              {step === STEPS.length - 2 ? "Önizle" : "İleri"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === STEPS.length - 1 && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Düzenle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== Skills Comma Input ====== */
function SkillsTextarea({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [text, setText] = useState(items.join(", "));

  function handleBlur() {
    const parsed = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(parsed);
  }

  // Sync from outside
  useEffect(() => {
    setText(items.join(", "));
  }, [items]);

  return (
    <div>
      <label className={labelClass} style={labelStyle}>{label}</label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={inputClass}
        style={inputStyle}
      />
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: "var(--blue-bg)",
                border: "1px solid var(--blue-border)",
                color: "var(--blue)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====== PDF Preview Card ====== */
function PdfCard({
  title,
  subtitle,
  accentColor,
  accentBg,
  accentBorder,
  pdfUrl,
  loading,
  extractedData,
  variant,
}: {
  title: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  pdfUrl: string | null;
  loading: boolean;
  extractedData: CVData;
  variant: "onepage" | "harvard";
}) {
  function handleDownload() {
    if (!pdfUrl) return;
    const safeName = (extractedData.personalInfo.fullName || "CV")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = variant === "harvard" ? `${safeName}_Harvard.pdf` : `${safeName}_OnePage.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleOpen() {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{title}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{subtitle}</p>
          </div>
        </div>
        {pdfUrl && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpen}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
            >
              <ExternalLink className="w-3 h-3" />
              Ac
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentColor, color: "var(--white)" }}
            >
              <Download className="w-3 h-3" />
              Indir
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="relative cursor-pointer" onClick={handleOpen} style={{ height: 380 }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin mb-2" style={{ color: accentColor, opacity: 0.6 }} />
            <p className="text-xs" style={{ color: "var(--muted)" }}>PDF oluşturuluyor...</p>
          </div>
        ) : pdfUrl ? (
          <>
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 pointer-events-none"
              title={title}
              style={{ backgroundColor: "#f5f5f5" }}
            />
            <div className="absolute inset-0 transition-colors hover:bg-black/5" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="w-8 h-8 mb-2" style={{ color: "var(--muted)", opacity: 0.3 }} />
            <p className="text-xs" style={{ color: "var(--muted)" }}>PDF oluşturulamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== PDF Fetch Helper ====== */
async function fetchPdf(data: CVData, variant: "onepage" | "harvard"): Promise<string | null> {
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

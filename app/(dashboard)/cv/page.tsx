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
  Zap,
  Search,
  X,
} from "lucide-react";
import type { CVData } from "@/lib/gemini";

/* ====== Step definitions ====== */
const STEPS = [
  { label: "Kişisel Bilgiler", icon: User },
  { label: "Eğitim", icon: GraduationCap },
  { label: "İş Deneyimi", icon: Briefcase },
  { label: "Programlar & Konferanslar", icon: FolderOpen },
  { label: "Kulüpler & Sosyal Sorumluluk", icon: Users },
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
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", website: "", photo: "" },
    education: [emptyEducation()],
    experience: [],
    projects: [],
    skills: { technical: [], languages: [], certifications: [], other: [] },
    leadership: [],
    awards: [],
    detectedField: "other",
  };
}

function demoCVData(): CVData {
  return {
    personalInfo: {
      fullName: "Ayşe Kaya",
      email: "ayse.kaya@email.com",
      phone: "+90 535 222 3344",
      location: "Ankara, Turkey",
      linkedin: "linkedin.com/in/aysekaya",
      website: "",
      photo: "",
    },
    education: [
      {
        institution: "TED Ankara College",
        degree: "High School Diploma",
        field: "Science & Math",
        gpa: "92/100",
        startDate: "Sep 2021",
        endDate: "Jun 2025",
        highlights: [
          "Honor roll for 4 consecutive years",
          "AP Results: Physics C 5/5, Chemistry 4/5, Statistics 5/5",
        ],
      },
    ],
    experience: [
      {
        company: "Siemens Turkey, Ankara",
        role: "Summer Intern – Engineering Department",
        startDate: "Jul 2024",
        endDate: "Aug 2024",
        bullets: [
          "Assisted in quality control processes for industrial automation products",
          "Prepared weekly reports analyzing production efficiency metrics",
          "Collaborated with the R&D team on prototype testing procedures",
        ],
      },
      {
        company: "Decathlon, Ankara",
        role: "Part-time Sales Associate",
        startDate: "Jun 2023",
        endDate: "Sep 2023",
        bullets: [
          "Provided customer service and product recommendations in the cycling department",
          "Managed inventory tracking using the internal POS system",
        ],
      },
    ],
    projects: [
      {
        name: "Bogazici University Summer Research Program",
        description: "Participated in a 3-week research program focusing on renewable energy systems and sustainability.",
        technologies: "",
        highlights: [],
      },
      {
        name: "ODTU Science Olympiad Training Camp",
        description: "Intensive physics and mathematics training camp for national science olympiad preparation.",
        technologies: "",
        highlights: [],
      },
    ],
    skills: {
      technical: ["Leadership", "Public Speaking", "Data Analysis", "Problem Solving", "Team Collaboration", "Excel", "PowerPoint", "Python"],
      languages: ["Turkish: Native", "English: Advanced (IELTS C1 – 7.0/9)", "German: Intermediate (Goethe B1)"],
      certifications: ["IELTS Academic – 7.0/9 – October 2024", "Goethe-Zertifikat B1 – June 2024", "SAT 1350/1600 (Math: 780, Reading: 570)"],
      other: ["Volleyball – 5 years competitive, school team captain", "Piano – 8 years, Grade 7 ABRSM", "Debate", "Coding"],
    },
    leadership: [
      {
        organization: "MUN Club – TED Ankara College",
        role: "Secretary General",
        period: "2024 – Present",
        description: "Led organization of TEDMUN conference with 200+ participants from 15 schools.",
      },
      {
        organization: "Science & Technology Club",
        role: "Vice President",
        period: "2023 – 2024",
        description: "Organized weekly workshops on robotics, coding, and scientific research methods.",
      },
      {
        organization: "Community Service – Koruncuk Foundation",
        role: "Volunteer Tutor",
        period: "2022 – Present",
        description: "Provided weekly math and science tutoring to underprivileged middle school students.",
      },
    ],
    awards: [
      {
        title: "TÜBİTAK Science Project Competition – Regional 2nd Place",
        issuer: "TÜBİTAK",
        date: "2024",
        description: "Developed a solar-powered water purification prototype for rural areas.",
      },
      {
        title: "Best Delegate – ODTÜMUN Conference",
        issuer: "ODTÜ MUN Society",
        date: "2023",
        description: "Awarded Best Delegate in the UN Environment Programme committee.",
      },
      {
        title: "National Science Olympiad – Bronze Medal (Physics)",
        issuer: "TÜBİTAK",
        date: "2024",
        description: "",
      },
    ],
    detectedField: "engineering",
  };
}

/* ====== Skill Presets ====== */
const SKILL_CATEGORIES: Record<string, string[]> = {
  "Liderlik & İletişim": ["Leadership", "Public Speaking", "Team Player", "Communication", "Negotiation", "Conflict Resolution", "Mentoring", "Coaching", "Networking"],
  "Analitik & Düşünme": ["Critical Thinking", "Problem Solving", "Data Analysis", "Research", "Strategic Planning", "Decision Making", "Analytical Thinking"],
  "Organizasyon": ["Project Management", "Time Management", "Event Planning", "Organizing", "Multitasking", "Detail-Oriented"],
  "Yaratıcılık": ["Creativity", "Design Thinking", "Innovation", "Content Creation", "Storytelling", "Writing"],
  "Ofis & Yazılım": ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Google Workspace", "Adobe Photoshop", "Adobe Illustrator", "Canva", "Notion", "Trello"],
  "Programlama": ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "HTML/CSS", "React", "Node.js", "SQL", "Git", "R", "MATLAB"],
  "Veri & AI": ["Machine Learning", "Data Science", "TensorFlow", "Pandas", "Tableau", "Power BI", "Statistical Analysis"],
  "Diğer": ["Social Media Management", "Marketing", "Sales", "Customer Service", "Volunteering", "Fundraising", "Teaching", "Translation"],
};
const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

/* ====== Language & Exam Data ====== */
const LANGUAGES_LIST = ["Türkçe", "İngilizce", "Almanca", "Fransızca", "İspanyolca", "İtalyanca", "Hollandaca", "Arapça", "Rusça", "Çince", "Japonca", "Korece", "Portekizce"];

interface ExamInfo {
  label: string;
  maxScore: number;
  scoreHint: string;
  sections?: string[];
  levelFromScore?: (score: number) => string;
  levelSelect?: string[]; // for exams where you pick the level (DELF A1/B2 etc.)
}

// CEFR auto-detection helpers
function ieltsLevel(s: number): string {
  if (s >= 8.5) return "C2";
  if (s >= 7.0) return "C1";
  if (s >= 5.5) return "B2";
  if (s >= 4.0) return "B1";
  if (s >= 3.0) return "A2";
  return "A1";
}
function toeflLevel(s: number): string {
  if (s >= 110) return "C2";
  if (s >= 95) return "C1"; // was previously listed as 1-6, but current iBT is 0-120
  if (s >= 72) return "B2";
  if (s >= 42) return "B1";
  return "A2";
}
function cambridgeLevel(s: number): string {
  if (s >= 200) return "C2";
  if (s >= 180) return "C1";
  if (s >= 160) return "B2";
  if (s >= 140) return "B1";
  return "A2";
}
function pteLevel(s: number): string {
  if (s >= 85) return "C2";
  if (s >= 76) return "C1";
  if (s >= 59) return "B2";
  if (s >= 43) return "B1";
  return "A2";
}
function duolingoLevel(s: number): string {
  if (s >= 140) return "C2";
  if (s >= 120) return "C1";
  if (s >= 100) return "B2";
  if (s >= 85) return "B1";
  return "A2";
}
function tcfLevel(s: number): string {
  if (s >= 600) return "C2";
  if (s >= 500) return "C1";
  if (s >= 400) return "B2";
  if (s >= 300) return "B1";
  if (s >= 200) return "A2";
  return "A1";
}
function tefLevel(s: number): string {
  if (s >= 600) return "C2";
  if (s >= 500) return "C1";
  if (s >= 400) return "B2";
  if (s >= 300) return "B1";
  if (s >= 200) return "A2";
  return "A1";
}

const LANGUAGE_EXAMS: Record<string, ExamInfo[]> = {
  "İngilizce": [
    { label: "IELTS", maxScore: 9, scoreHint: "0 – 9 (örn: 7.5)", sections: ["Listening", "Reading", "Writing", "Speaking"], levelFromScore: ieltsLevel },
    { label: "TOEFL iBT", maxScore: 120, scoreHint: "0 – 120", sections: ["Reading", "Listening", "Speaking", "Writing"], levelFromScore: toeflLevel },
    { label: "Cambridge (FCE/CAE/CPE)", maxScore: 230, scoreHint: "90 – 230", levelFromScore: cambridgeLevel },
    { label: "Duolingo English Test", maxScore: 160, scoreHint: "10 – 160", levelFromScore: duolingoLevel },
    { label: "PTE Academic", maxScore: 90, scoreHint: "10 – 90", levelFromScore: pteLevel },
  ],
  "Almanca": [
    { label: "Goethe-Zertifikat", maxScore: 100, scoreHint: "0 – 100 (Geçme: 60+)", levelSelect: ["A1", "A2", "B1", "B2", "C1", "C2"] },
    { label: "TestDaF", maxScore: 5, scoreHint: "TDN 3 – 5", sections: ["Lesen", "Hören", "Schreiben", "Sprechen"], levelFromScore: (s) => s >= 5 ? "C1" : s >= 4 ? "B2" : "B2" },
    { label: "DSH", maxScore: 3, scoreHint: "1 / 2 / 3", levelFromScore: (s) => s >= 3 ? "C1" : s >= 2 ? "B2" : "B2" },
    { label: "telc Deutsch", maxScore: 300, scoreHint: "0 – 300", levelSelect: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  ],
  "Fransızca": [
    { label: "DELF", maxScore: 100, scoreHint: "0 – 100 (Geçme: 50+)", sections: ["Compréhension Orale", "Compréhension Écrite", "Production Orale", "Production Écrite"], levelSelect: ["A1", "A2", "B1", "B2"] },
    { label: "DALF", maxScore: 100, scoreHint: "0 – 100 (Geçme: 50+)", sections: ["Compréhension Orale", "Compréhension Écrite", "Production Orale", "Production Écrite"], levelSelect: ["C1", "C2"] },
    { label: "TCF", maxScore: 699, scoreHint: "100 – 699", levelFromScore: tcfLevel },
    { label: "TEF", maxScore: 699, scoreHint: "0 – 699", levelFromScore: tefLevel },
  ],
  "İspanyolca": [
    { label: "DELE", maxScore: 100, scoreHint: "0 – 100 (Geçme: 60%)", levelSelect: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  ],
  "İtalyanca": [
    { label: "CILS", maxScore: 100, scoreHint: "0 – 100", levelSelect: ["A1", "A2", "B1", "B2", "C1", "C2"] },
    { label: "CELI", maxScore: 120, scoreHint: "0 – 120 (Geçme: 70%)", levelSelect: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  ],
  "Hollandaca": [
    { label: "NT2", maxScore: 900, scoreHint: "500 – 900 (Geçme: 500+)", levelFromScore: (s) => s >= 700 ? "B2" : "B1" },
    { label: "CNaVT", maxScore: 0, scoreHint: "Geçti / Kaldı", levelSelect: ["A2", "B1", "B2", "C1"] },
  ],
};

interface LanguageEntry {
  language: string;
  level: string;
  examName: string;
  examLevel: string; // for DELF B2, Goethe B1 etc.
  examScore: string;
  examDate: string;
  sectionScores: string;
  showScore: boolean;
  showSections: boolean;
  sectionEntries: { name: string; score: string }[];
}

function emptyLanguageEntry(): LanguageEntry {
  return { language: "", level: "", examName: "", examLevel: "", examScore: "", examDate: "", sectionScores: "", showScore: false, showSections: false, sectionEntries: [] };
}

function detectLevel(examInfo: ExamInfo | undefined, score: string, examLevel: string): string {
  if (!examInfo) return "";
  if (examInfo.levelSelect && examLevel) return examLevel;
  if (examInfo.levelFromScore && score) {
    const num = parseFloat(score);
    if (!isNaN(num)) return examInfo.levelFromScore(num);
  }
  return "";
}

function formatLanguageString(entry: LanguageEntry, examInfo: ExamInfo | undefined): string {
  const detectedLvl = detectLevel(examInfo, entry.examScore, entry.examLevel);
  let s = entry.language;
  if (detectedLvl) {
    s += `: ${detectedLvl}`;
  } else if (entry.level) {
    s += `: ${entry.level}`;
  }
  if (entry.examName) {
    const parts: string[] = [entry.examName];
    if (entry.examLevel) parts.push(entry.examLevel);
    if (entry.showScore && entry.examScore) {
      parts.push(`${entry.examScore}/${examInfo?.maxScore || "?"}`);
    }
    s += ` (${parts.join(" ")})`;
  }
  return s;
}

function formatCertString(entry: LanguageEntry, examInfo: ExamInfo | undefined): string {
  const parts: string[] = [entry.examName];
  if (entry.examLevel) parts.push(entry.examLevel);
  if (entry.examScore) {
    parts.push(`– ${entry.examScore}/${examInfo?.maxScore || "?"}`);
  }
  if (entry.sectionScores) parts.push(`(${entry.sectionScores})`);
  if (entry.examDate) parts.push(`– ${entry.examDate}`);
  return parts.join(" ");
}

/* ====== Standardized Exam Data ====== */
interface StandardExam {
  name: string;
  maxScore: number | string;
  scoreHint: string;
  subjects?: string[];
  sections?: { name: string; maxScore: number }[];
}

const STANDARDIZED_EXAMS: StandardExam[] = [
  {
    name: "AP (Advanced Placement)",
    maxScore: 5,
    scoreHint: "1 – 5",
    subjects: [
      "Calculus AB", "Calculus BC", "Statistics", "Precalculus",
      "Physics 1", "Physics 2", "Physics C: Mechanics", "Physics C: E&M",
      "Chemistry", "Biology", "Environmental Science",
      "Computer Science A", "Computer Science Principles",
      "Macroeconomics", "Microeconomics",
      "US History", "European History", "World History",
      "English Language", "English Literature",
      "Psychology", "Human Geography",
      "US Government", "Comparative Government",
      "Spanish Language", "French Language", "German Language",
      "Chinese Language", "Japanese Language", "Italian Language", "Latin",
      "Art History", "Music Theory",
      "Studio Art: 2D", "Studio Art: 3D", "Studio Art: Drawing",
      "Seminar", "Research",
    ],
  },
  {
    name: "SAT",
    maxScore: 1600,
    scoreHint: "400 – 1600",
    sections: [
      { name: "Math", maxScore: 800 },
      { name: "Reading & Writing", maxScore: 800 },
    ],
  },
  {
    name: "ACT",
    maxScore: 36,
    scoreHint: "1 – 36",
    sections: [
      { name: "English", maxScore: 36 },
      { name: "Math", maxScore: 36 },
      { name: "Reading", maxScore: 36 },
      { name: "Science", maxScore: 36 },
    ],
  },
  {
    name: "IB (International Baccalaureate)",
    maxScore: 45,
    scoreHint: "1 – 45 toplam (ders başı 1-7)",
    subjects: [
      "Mathematics AA HL", "Mathematics AA SL", "Mathematics AI HL", "Mathematics AI SL",
      "Physics HL", "Physics SL", "Chemistry HL", "Chemistry SL", "Biology HL", "Biology SL",
      "Computer Science HL", "Computer Science SL",
      "Economics HL", "Economics SL", "Business Management HL", "Business Management SL",
      "History HL", "History SL", "Geography HL", "Geography SL", "Psychology HL", "Psychology SL",
      "English A HL", "English A SL", "English B HL", "English B SL",
      "French B HL", "French B SL", "German B HL", "German B SL",
      "Spanish B HL", "Spanish B SL", "Turkish A HL", "Turkish A SL",
      "Visual Arts HL", "Visual Arts SL", "Music HL", "Music SL", "Theatre HL", "Theatre SL",
    ],
  },
  {
    name: "A-Level",
    maxScore: "A*",
    scoreHint: "A* – E",
    subjects: [
      "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology",
      "Computer Science", "Economics", "Business", "Accounting",
      "English Literature", "English Language", "History", "Geography", "Psychology", "Sociology",
      "French", "German", "Spanish", "Art & Design", "Music",
    ],
  },
];

interface ExamScoreEntry {
  examName: string;
  totalScore: string;
  subjects: { name: string; score: string }[];
  sections: { name: string; score: string }[];
  date: string;
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

/* ====== Photo Upload Component ====== */
function PhotoUpload({
  photo,
  onChange,
}: {
  photo: string;
  onChange: (dataUrl: string) => void;
}) {
  async function handleFile(file: File) {
    // Resize and compress to keep localStorage manageable
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    await new Promise((resolve) => { img.onload = resolve; });
    URL.revokeObjectURL(url);

    const canvas = document.createElement("canvas");
    const size = 300; // 300x300 max
    let w = img.width;
    let h = img.height;
    if (w > h) { h = (h / w) * size; w = size; }
    else { w = (w / h) * size; h = size; }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onChange(dataUrl);
  }

  return (
    <div className="col-span-2 flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: photo ? "transparent" : "var(--blue-bg)",
          border: `2px dashed ${photo ? "var(--blue-border)" : "var(--border)"}`,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="CV Fotoğrafı" className="w-full h-full object-cover" />
        ) : (
          <User className="w-6 h-6" style={{ color: "var(--muted)", opacity: 0.4 }} />
        )}
      </div>
      <div className="flex-1">
        <label className={labelClass} style={labelStyle}>
          CV Fotoğrafı
          <span className="font-normal ml-1">(opsiyonel — tek sayfa CV&apos;de görünür)</span>
        </label>
        <div className="flex items-center gap-2">
          <label
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--blue-bg)",
              border: "1px solid var(--blue-border)",
              color: "var(--blue)",
            }}
          >
            <Plus className="w-3 h-3" />
            {photo ? "Değiştir" : "Fotoğraf Yükle"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          {photo && (
            <button
              onClick={() => onChange("")}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--danger)" }}
            >
              <Trash2 className="w-3 h-3" />
              Kaldır
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
const LOCAL_STORAGE_KEY = "pusula-cv-data";
const LOCAL_STORAGE_STEP_KEY = "pusula-cv-step";

function loadSavedData(): CVData | null {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function loadSavedStep(): number {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_STEP_KEY);
    if (saved) return parseInt(saved, 10) || 0;
  } catch {}
  return 0;
}

function hasStepContent(data: CVData, stepIndex: number): boolean {
  switch (stepIndex) {
    case 0: return !!data.personalInfo.fullName.trim();
    case 1: return data.education.some((e) => !!e.institution.trim());
    case 2: return data.experience.some((e) => !!e.company.trim());
    case 3: return data.projects.some((p) => !!p.name.trim());
    case 4: return data.leadership.some((l) => !!l.organization.trim());
    case 5: return (data.skills.technical?.length || 0) > 0 || (data.skills.languages?.length || 0) > 0;
    case 6: return data.awards.some((a) => !!a.title.trim());
    default: return false;
  }
}

export default function CVPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CVData>(initialCVData);
  const [enhancedData, setEnhancedData] = useState<CVData | null>(null);
  const [restored, setRestored] = useState(false);

  // PDF preview state
  const [onePageUrl, setOnePageUrl] = useState<string | null>(null);
  const [harvardUrl, setHarvardUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadSavedData();
    if (saved && saved.personalInfo?.fullName) {
      setData(saved);
      setStep(loadSavedStep());
      setRestored(true);
      setTimeout(() => setRestored(false), 3000);
    }
  }, []);

  // Autosave to localStorage on data/step change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LOCAL_STORAGE_STEP_KEY, String(step));
    } catch {}
  }, [data, step]);

  function clearSavedData() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
    setData(initialCVData());
    setStep(0);
    setEnhancedData(null);
    setOnePageUrl(null);
    setHarvardUrl(null);
  }

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
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          CV Oluşturucu
        </h1>
        <div className="flex items-center gap-2">
          {data.personalInfo.fullName.trim() && (
            <button
              onClick={clearSavedData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--danger-bg)",
                border: "1px solid rgba(220,38,38,0.15)",
                color: "var(--danger)",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Sıfırla
            </button>
          )}
          <button
            onClick={() => { setData(demoCVData()); setStep(0); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--gold-bg)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Demo ile Doldur
          </button>
        </div>
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Bilgilerinizi adım adım girin — profesyonel PDF CV&apos;ler otomatik oluşturulur
        <span className="ml-2 text-[10px] opacity-60">otomatik kaydedilir</span>
      </p>

      {/* Restored notification */}
      {restored && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs mb-4 animate-pulse"
          style={{
            backgroundColor: "var(--success-bg)",
            border: "1px solid rgba(22,163,74,0.25)",
            color: "var(--success)",
          }}
        >
          <Check className="w-3.5 h-3.5" />
          Önceki CV veriniz geri yüklendi. Kaldığınız yerden devam edebilirsiniz.
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          const hasFilled = i < STEPS.length - 1 && hasStepContent(data, i);
          return (
            <button
              key={i}
              onClick={() => {
                setStep(i);
                if (i === STEPS.length - 1) generatePdfs();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap relative"
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
              {hasFilled && !isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5"
                  style={{ backgroundColor: "var(--success)" }}
                />
              )}
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
            <PhotoUpload photo={data.personalInfo.photo || ""} onChange={(v) => updatePersonal("photo", v)} />
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
                  }} placeholder="Türkçe-Matematik / Fen / Eşit Ağırlık" />
                  <Field label="GPA" value={edu.gpa || ""} onChange={(v) => {
                    const copy = [...data.education]; copy[i] = { ...copy[i], gpa: v }; update("education", copy);
                  }} placeholder="87/100" />
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
                Henüz program veya konferans eklenmedi. Yoksa bu adımı atlayabilirsiniz.
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
            <AddButton label="Program / Konferans Ekle" onClick={() => update("projects", [...data.projects, emptyProject()])} />
          </div>
        )}

        {/* STEP 4: Leadership & Activities */}
        {step === 4 && (
          <div>
            {data.leadership.length === 0 && (
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Henüz kulüp veya sosyal sorumluluk eklenmedi. Yoksa bu adımı atlayabilirsiniz.
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
            <AddButton label="Kulüp / Aktivite Ekle" onClick={() => update("leadership", [...data.leadership, emptyLeadership()])} />
          </div>
        )}

        {/* STEP 5: Skills & Languages */}
        {step === 5 && (
          <div className="space-y-6">
            {/* === Teknik Beceriler Picker === */}
            <SkillsPicker
              selected={data.skills.technical || []}
              onChange={(items) => update("skills", { ...data.skills, technical: items })}
            />

            {/* === Diller === */}
            <LanguagesSection
              languages={data.skills.languages || []}
              certifications={data.skills.certifications || []}
              onChange={(langs, certs) => update("skills", { ...data.skills, languages: langs, certifications: certs })}
            />

            {/* === Sınav Notları === */}
            <ExamScoresSection
              highlights={data.education?.[0]?.highlights || []}
              onChange={(highlights) => {
                if (data.education.length > 0) {
                  const copy = [...data.education];
                  copy[0] = { ...copy[0], highlights };
                  update("education", copy);
                }
              }}
            />

            {/* === Diğer Beceriler === */}
            <SkillsTextarea
              label="Diğer Beceriler & Hobiler"
              placeholder="Basketbol – 5 yıl, Gitar – 3 yıl, Münazara, Gönüllülük..."
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

            {/* Quick Edit Links */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {STEPS.slice(0, -1).map((s, i) => {
                const Icon = s.icon;
                const filled = hasStepContent(data, i);
                return (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: filled ? "var(--success-bg)" : "var(--surface2)",
                      border: `1px solid ${filled ? "rgba(22,163,74,0.25)" : "var(--border)"}`,
                      color: filled ? "var(--success)" : "var(--muted)",
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {s.label}
                  </button>
                );
              })}
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

/* ====== Skills Picker with Search ====== */
function SkillsPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (items: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? ALL_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(search.toLowerCase()) &&
          !selected.includes(s)
      )
    : [];

  function addSkill(skill: string) {
    if (!selected.includes(skill)) onChange([...selected, skill]);
    setSearch("");
  }

  function removeSkill(skill: string) {
    onChange(selected.filter((s) => s !== skill));
  }

  function addCustom() {
    const trimmed = search.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setSearch("");
    }
  }

  return (
    <div>
      <label className={labelClass} style={labelStyle}>Teknik Beceriler</label>

      {/* Selected skills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: "var(--blue-bg)",
                border: "1px solid var(--blue-border)",
                color: "var(--blue)",
              }}
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="hover:opacity-60">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search / Add area */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); if (!open) setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Beceri ara veya yaz..."
              className={`${inputClass} pl-8`}
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addCustom(); }
              }}
            />
          </div>
          {search.trim() && (
            <button
              onClick={addCustom}
              className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
              style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
            >
              + Ekle
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-20 left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden max-h-72 overflow-y-auto"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {search.trim() && filtered.length > 0 ? (
              /* Search results */
              <div className="p-2">
                {filtered.slice(0, 12).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-3 py-1.5 rounded text-xs hover:opacity-80 transition-colors"
                    style={{ color: "var(--text)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : !search.trim() ? (
              /* Category browse */
              <div className="p-2 space-y-3">
                {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold px-2 py-1" style={{ color: "var(--muted)" }}>{cat}</p>
                    <div className="flex flex-wrap gap-1 px-1">
                      {skills.map((skill) => {
                        const isSelected = selected.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => isSelected ? removeSkill(skill) : addSkill(skill)}
                            className="px-2 py-1 rounded text-xs transition-all"
                            style={{
                              backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface2)",
                              border: isSelected ? "1px solid var(--blue-border)" : "1px solid var(--border)",
                              color: isSelected ? "var(--blue)" : "var(--text)",
                              opacity: isSelected ? 0.7 : 1,
                            }}
                          >
                            {isSelected ? "✓ " : ""}{skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="pt-2 px-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 text-xs text-center" style={{ color: "var(--muted)" }}>
                Sonuç bulunamadı — Enter ile özel beceri ekle
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}

/* ====== Languages Section ====== */
function LanguagesSection({
  languages,
  certifications,
  onChange,
}: {
  languages: string[];
  certifications: string[];
  onChange: (langs: string[], certs: string[]) => void;
}) {
  const [entries, setEntries] = useState<LanguageEntry[]>(() => {
    if (languages.length === 0 && certifications.length === 0) return [];
    return languages.map((lang) => {
      const entry = emptyLanguageEntry();
      const colonIdx = lang.indexOf(":");
      if (colonIdx !== -1) {
        entry.language = lang.slice(0, colonIdx).trim();
        entry.level = lang.slice(colonIdx + 1).trim();
      } else {
        entry.language = lang;
      }
      return entry;
    });
  });

  function getExamInfo(entry: LanguageEntry): ExamInfo | undefined {
    const exams = LANGUAGE_EXAMS[entry.language] || [];
    return exams.find((e) => e.label === entry.examName);
  }

  function syncEntries(newEntries: LanguageEntry[]) {
    setEntries(newEntries);
    const langs = newEntries
      .filter((e) => e.language)
      .map((e) => formatLanguageString(e, getExamInfo(e)));
    const certs = newEntries
      .filter((e) => e.examName)
      .map((e) => formatCertString(e, getExamInfo(e)));
    onChange(langs, certs);
  }

  function addEntry() {
    syncEntries([...entries, emptyLanguageEntry()]);
  }

  function updateField(i: number, field: keyof LanguageEntry, value: string | boolean | { name: string; score: string }[]) {
    const copy = [...entries];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copy[i] = { ...copy[i], [field]: value } as any;
    syncEntries(copy);
  }

  function removeEntry(i: number) {
    syncEntries(entries.filter((_, j) => j !== i));
  }

  return (
    <div>
      <label className={labelClass} style={labelStyle}>Diller & Dil Sınavları</label>

      {entries.length === 0 && (
        <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
          Henüz dil eklenmedi. Aşağıdaki butonla dil ekleyin.
        </p>
      )}

      {entries.map((entry, i) => {
        const exams = LANGUAGE_EXAMS[entry.language] || [];
        const selectedExam = exams.find((e) => e.label === entry.examName);
        const detectedLvl = detectLevel(selectedExam, entry.examScore, entry.examLevel);

        return (
          <div
            key={i}
            className="rounded-lg p-4 mb-3 relative"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => removeEntry(i)}
              className="absolute top-3 right-3 p-1 rounded hover:opacity-70"
              style={{ color: "var(--danger)" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              {/* Language */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Dil</label>
                <select
                  value={entry.language}
                  onChange={(e) => {
                    const copy = [...entries];
                    copy[i] = { ...emptyLanguageEntry(), language: e.target.value };
                    syncEntries(copy);
                  }}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Dil seçin</option>
                  {LANGUAGES_LIST.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Seviye — auto from score or manual for native/no-exam */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Seviye</label>
                {detectedLvl ? (
                  <div
                    className="px-3 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: "var(--success-bg)", border: "1px solid rgba(22,163,74,0.25)", color: "var(--success)" }}
                  >
                    {detectedLvl}
                  </div>
                ) : !entry.examName ? (
                  <select
                    value={entry.level}
                    onChange={(e) => updateField(i, "level", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Puan girin veya seviye seçin</option>
                    <option value="Native">Ana Dil (Native)</option>
                    <option value="C2">C2</option>
                    <option value="C1">C1</option>
                    <option value="B2">B2</option>
                    <option value="B1">B1</option>
                    <option value="A2">A2</option>
                    <option value="A1">A1</option>
                  </select>
                ) : (
                  <div
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
                  >
                    Puan girin →
                  </div>
                )}
              </div>

              {/* Exam select */}
              {exams.length > 0 && (
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Sınav</label>
                  <select
                    value={entry.examName}
                    onChange={(e) => {
                      const newExam = exams.find((ex) => ex.label === e.target.value);
                      const copy = [...entries];
                      copy[i] = {
                        ...copy[i],
                        examName: e.target.value,
                        examScore: "",
                        examLevel: "",
                        sectionScores: "",
                        showScore: false,
                        showSections: false,
                        sectionEntries: newExam?.sections?.map((s) => ({ name: s, score: "" })) || [],
                      };
                      syncEntries(copy);
                    }}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Sınav seçin (opsiyonel)</option>
                    {exams.map((ex) => (
                      <option key={ex.label} value={ex.label}>{ex.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Exam level (for DELF B2, Goethe B1 etc.) */}
              {entry.examName && selectedExam?.levelSelect && (
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Sınav Seviyesi</label>
                  <select
                    value={entry.examLevel}
                    onChange={(e) => updateField(i, "examLevel", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Seviye seçin</option>
                    {selectedExam.levelSelect.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Score + max display */}
              {entry.examName && selectedExam && selectedExam.maxScore > 0 && (
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                    Puan <span className="font-normal">/ {selectedExam.maxScore}</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      value={entry.examScore}
                      onChange={(e) => updateField(i, "examScore", e.target.value)}
                      placeholder={selectedExam.scoreHint}
                      className={`${inputClass} flex-1`}
                      style={inputStyle}
                    />
                    <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>/ {selectedExam.maxScore}</span>
                  </div>
                </div>
              )}

              {/* Exam date */}
              {entry.examName && (
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Sınav Tarihi</label>
                  <input
                    value={entry.examDate}
                    onChange={(e) => updateField(i, "examDate", e.target.value)}
                    placeholder="Kasım 2024"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Alt Skorlar toggle + fields */}
              {entry.examName && selectedExam?.sections && selectedExam.sections.length > 0 && (
                <div className="col-span-2">
                  <button
                    onClick={() => {
                      const newShow = !entry.showSections;
                      const copy = [...entries];
                      copy[i] = {
                        ...copy[i],
                        showSections: newShow,
                        sectionEntries: newShow && copy[i].sectionEntries.length === 0
                          ? selectedExam!.sections!.map((s) => ({ name: s, score: "" }))
                          : copy[i].sectionEntries,
                      };
                      syncEntries(copy);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: entry.showSections ? "var(--blue-bg)" : "var(--surface)",
                      border: entry.showSections ? "1px solid var(--blue-border)" : "1px solid var(--border)",
                      color: entry.showSections ? "var(--blue)" : "var(--muted)",
                    }}
                  >
                    {entry.showSections ? "▾ Alt Skorlar" : "▸ Alt Skorlar"}
                  </button>

                  {entry.showSections && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {entry.sectionEntries.map((sec, j) => (
                        <div key={j}>
                          <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                            {sec.name}
                          </label>
                          <input
                            value={sec.score}
                            onChange={(e) => {
                              const newSections = [...entry.sectionEntries];
                              newSections[j] = { ...newSections[j], score: e.target.value };
                              updateField(i, "sectionEntries", newSections);
                              // Also sync sectionScores string
                              const scStr = newSections.filter((s) => s.score).map((s) => `${s.name}: ${s.score}`).join(", ");
                              const copy2 = [...entries];
                              copy2[i] = { ...copy2[i], sectionEntries: newSections, sectionScores: scStr };
                              syncEntries(copy2);
                            }}
                            placeholder="Puan"
                            className={inputClass}
                            style={inputStyle}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Show score on CV toggle */}
              {entry.examName && entry.examScore && (
                <div className="col-span-2">
                  <button
                    onClick={() => updateField(i, "showScore", !entry.showScore)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: entry.showScore ? "var(--success-bg)" : "var(--surface)",
                      border: entry.showScore ? "1px solid rgba(22,163,74,0.25)" : "1px solid var(--border)",
                      color: entry.showScore ? "var(--success)" : "var(--muted)",
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded border flex items-center justify-center"
                      style={{
                        borderColor: entry.showScore ? "var(--success)" : "var(--border)",
                        backgroundColor: entry.showScore ? "var(--success)" : "transparent",
                      }}
                    >
                      {entry.showScore && <Check className="w-2.5 h-2.5" style={{ color: "var(--white)" }} />}
                    </div>
                    CV&apos;de puanı göster ({entry.examScore}/{selectedExam?.maxScore})
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <AddButton label="Dil Ekle" onClick={addEntry} />
    </div>
  );
}

/* ====== Exam Scores Section (AP, SAT, IB, ACT, A-Level) ====== */
function ExamScoresSection({
  highlights,
  onChange,
}: {
  highlights: string[];
  onChange: (h: string[]) => void;
}) {
  const [examEntries, setExamEntries] = useState<ExamScoreEntry[]>([]);

  function syncToHighlights(newEntries: ExamScoreEntry[]) {
    setExamEntries(newEntries);
    // Convert exam entries into highlight strings
    // Keep existing non-exam highlights
    const nonExamHighlights = highlights.filter((h) => !h.startsWith("AP Results:") && !h.startsWith("SAT:") && !h.startsWith("ACT:") && !h.startsWith("IB:") && !h.startsWith("A-Level:"));
    const examStrings: string[] = [];
    for (const entry of newEntries) {
      if (!entry.examName) continue;
      const exam = STANDARDIZED_EXAMS.find((e) => e.name === entry.examName);
      if (!exam) continue;

      if (entry.subjects.length > 0 && entry.subjects.some((s) => s.score)) {
        // AP or IB-style: list subjects with scores
        const prefix = entry.examName.startsWith("AP") ? "AP Results" : entry.examName.startsWith("IB") ? "IB Results" : entry.examName.startsWith("A-") ? "A-Level Results" : entry.examName;
        const parts = entry.subjects
          .filter((s) => s.score)
          .map((s) => `${s.name} ${s.score}/${exam.maxScore}`);
        if (parts.length > 0) examStrings.push(`${prefix}: ${parts.join(", ")}`);
      } else if (entry.totalScore) {
        // SAT/ACT-style: total + sections
        let s = `${entry.examName} ${entry.totalScore}/${exam.maxScore}`;
        const sectionParts = entry.sections.filter((sec) => sec.score).map((sec) => `${sec.name}: ${sec.score}`);
        if (sectionParts.length > 0) s += ` (${sectionParts.join(", ")})`;
        examStrings.push(s);
      }
    }
    onChange([...nonExamHighlights, ...examStrings]);
  }

  function addExam() {
    syncToHighlights([...examEntries, { examName: "", totalScore: "", subjects: [], sections: [], date: "" }]);
  }

  function updateExam(i: number, updates: Partial<ExamScoreEntry>) {
    const copy = [...examEntries];
    copy[i] = { ...copy[i], ...updates };
    syncToHighlights(copy);
  }

  function removeExam(i: number) {
    syncToHighlights(examEntries.filter((_, j) => j !== i));
  }

  return (
    <div>
      <label className={labelClass} style={labelStyle}>Sınav Notları (AP, SAT, IB, ACT, A-Level)</label>

      {examEntries.length === 0 && (
        <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
          Standart sınav sonuçlarınızı ekleyin. Bunlar eğitim bölümünde görünecektir.
        </p>
      )}

      {examEntries.map((entry, i) => {
        const exam = STANDARDIZED_EXAMS.find((e) => e.name === entry.examName);

        return (
          <div
            key={i}
            className="rounded-lg p-4 mb-3 relative"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => removeExam(i)}
              className="absolute top-3 right-3 p-1 rounded hover:opacity-70"
              style={{ color: "var(--danger)" }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              {/* Exam type */}
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Sınav</label>
                <select
                  value={entry.examName}
                  onChange={(e) => {
                    const selected = STANDARDIZED_EXAMS.find((ex) => ex.name === e.target.value);
                    updateExam(i, {
                      examName: e.target.value,
                      totalScore: "",
                      subjects: [],
                      sections: selected?.sections?.map((s) => ({ name: s.name, score: "" })) || [],
                    });
                  }}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Sınav seçin</option>
                  {STANDARDIZED_EXAMS.map((ex) => (
                    <option key={ex.name} value={ex.name}>{ex.name}</option>
                  ))}
                </select>
              </div>

              {/* For SAT/ACT: total score + sections */}
              {exam && exam.sections && (
                <>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                      Toplam Puan <span className="font-normal">/ {String(exam.maxScore)}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        value={entry.totalScore}
                        onChange={(e) => updateExam(i, { totalScore: e.target.value })}
                        placeholder={exam.scoreHint}
                        className={`${inputClass} flex-1`}
                        style={inputStyle}
                      />
                      <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>/ {String(exam.maxScore)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Tarih</label>
                    <input
                      value={entry.date}
                      onChange={(e) => updateExam(i, { date: e.target.value })}
                      placeholder="Kasım 2024"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  {entry.sections.map((sec, j) => (
                    <div key={j}>
                      <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                        {sec.name} <span className="font-normal">/ {exam.sections![j].maxScore}</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          value={sec.score}
                          onChange={(e) => {
                            const copy = [...entry.sections];
                            copy[j] = { ...copy[j], score: e.target.value };
                            updateExam(i, { sections: copy });
                          }}
                          placeholder={`max ${exam.sections![j].maxScore}`}
                          className={`${inputClass} flex-1`}
                          style={inputStyle}
                        />
                        <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>/ {exam.sections![j].maxScore}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* For AP/IB/A-Level: subject picker + individual scores */}
              {exam && exam.subjects && (
                <>
                  <div className="col-span-2">
                    <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>Ders Ekle</label>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value && !entry.subjects.some((s) => s.name === e.target.value)) {
                          updateExam(i, { subjects: [...entry.subjects, { name: e.target.value, score: "" }] });
                        }
                      }}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="">Ders seçin...</option>
                      {exam.subjects
                        .filter((s) => !entry.subjects.some((sub) => sub.name === s))
                        .map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                  </div>
                  {entry.subjects.map((sub, j) => (
                    <div key={j} className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-medium block mb-1" style={{ color: "var(--muted)" }}>
                          {sub.name}
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            value={sub.score}
                            onChange={(e) => {
                              const copy = [...entry.subjects];
                              copy[j] = { ...copy[j], score: e.target.value };
                              updateExam(i, { subjects: copy });
                            }}
                            placeholder={typeof exam.maxScore === "number" ? `max ${exam.maxScore}` : exam.maxScore}
                            className={`${inputClass} flex-1`}
                            style={inputStyle}
                          />
                          <span className="text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>/ {String(exam.maxScore)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          updateExam(i, { subjects: entry.subjects.filter((_, k) => k !== j) });
                        }}
                        className="p-2 rounded hover:opacity-70 mb-0.5"
                        style={{ color: "var(--danger)" }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })}

      <AddButton label="Sınav Ekle" onClick={addExam} />
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
  const [editLoading, setEditLoading] = useState(false);

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

  async function handleEditableDownload() {
    setEditLoading(true);
    try {
      const endpoint = variant === "harvard" ? "/api/generate-cv-docx" : "/api/generate-cv-pptx";
      const ext = variant === "harvard" ? "docx" : "pptx";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedData }),
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const safeName = (extractedData.personalInfo.fullName || "CV")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "_");
      const a = document.createElement("a");
      a.href = url;
      a.download = variant === "harvard" ? `${safeName}_Harvard.${ext}` : `${safeName}_OnePage.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setEditLoading(false);
    }
  }

  const editLabel = variant === "harvard" ? "DOCX" : "PPTX";
  const editHint = variant === "harvard" ? "Word'de düzenle" : "PowerPoint'te düzenle";

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
              Aç
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentColor, color: "var(--white)" }}
            >
              <Download className="w-3 h-3" />
              PDF
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

      {/* Editable format download */}
      {pdfUrl && (
        <div className="px-4 py-2.5" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleEditableDownload}
            disabled={editLoading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: "var(--gold-bg)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            {editLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {editLabel} İndir — {editHint}
          </button>
        </div>
      )}
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

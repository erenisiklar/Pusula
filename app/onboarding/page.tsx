"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile, type StudentProfile } from "@/lib/profile-context";
import { createClient } from "@/lib/supabase/client";
import { calculateEligibility } from "@/lib/eligibility";
import type { University, StudentInput } from "@/types";
import DepartmentQuiz from "@/components/department-quiz";
import {
  Compass,
  GraduationCap,
  Languages,
  Wallet,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Monitor,
  Wrench,
  Briefcase,
  TrendingUp,
  Building2,
  Scale,
  Users,
  Brain,
  Zap,
  Cog,
  Plane,
  HeartPulse,
  Palette,
  HelpCircle,
} from "lucide-react";

const COUNTRIES = [
  { name: "Almanya", flag: "🇩🇪" },
  { name: "Avusturya", flag: "🇦🇹" },
  { name: "Belçika", flag: "🇧🇪" },
  { name: "Çekya", flag: "🇨🇿" },
  { name: "Danimarka", flag: "🇩🇰" },
  { name: "Estonya", flag: "🇪🇪" },
  { name: "Finlandiya", flag: "🇫🇮" },
  { name: "Fransa", flag: "🇫🇷" },
  { name: "Hollanda", flag: "🇳🇱" },
  { name: "İngiltere", flag: "🇬🇧" },
  { name: "İrlanda", flag: "🇮🇪" },
  { name: "İspanya", flag: "🇪🇸" },
  { name: "İsveç", flag: "🇸🇪" },
  { name: "İsviçre", flag: "🇨🇭" },
  { name: "İtalya", flag: "🇮🇹" },
  { name: "Macaristan", flag: "🇭🇺" },
  { name: "Norveç", flag: "🇳🇴" },
  { name: "Polonya", flag: "🇵🇱" },
  { name: "Portekiz", flag: "🇵🇹" },
];

const DEPARTMENTS: { value: string; label: string; icon: typeof Monitor }[] = [
  { value: "Bilgisayar Mühendisliği", label: "Bilgisayar Müh.", icon: Monitor },
  { value: "Mühendislik", label: "Mühendislik", icon: Wrench },
  { value: "İşletme", label: "İşletme", icon: Briefcase },
  { value: "Ekonomi", label: "Ekonomi", icon: TrendingUp },
  { value: "Mimarlık", label: "Mimarlık", icon: Building2 },
  { value: "Siyaset Bilimi", label: "Siyaset Bilimi", icon: Scale },
  { value: "Uluslararası İlişkiler", label: "Uluslararası İlişkiler", icon: Users },
  { value: "Psikoloji", label: "Psikoloji", icon: Brain },
  { value: "Elektrik-Elektronik Mühendisliği", label: "Elektrik-Elektronik", icon: Zap },
  { value: "Makine Mühendisliği", label: "Makine Müh.", icon: Cog },
  { value: "Havacılık Mühendisliği", label: "Havacılık Müh.", icon: Plane },
  { value: "Tıp Bilimleri", label: "Tıp Bilimleri", icon: HeartPulse },
  { value: "Tasarım", label: "Tasarım", icon: Palette },
];

const LANG_CERTS = [
  { value: "IELTS", label: "IELTS", subtitle: "International English Language Testing System", placeholder: "Örn: 7.5", color: "#c1172c", scoreHint: "0 – 9", logo: "/logos/ielts.svg" },
  { value: "TOEFL", label: "TOEFL", subtitle: "Test of English as a Foreign Language", placeholder: "Örn: 95", color: "#0077c8", scoreHint: "0 – 120", logo: "/logos/toefl.svg" },
  { value: "TestDaF", label: "TestDaF", subtitle: "Test Deutsch als Fremdsprache", placeholder: "Örn: 4", color: "#006633", scoreHint: "TDN 3 – 5", logo: "/logos/testdaf.svg" },
  { value: "DELF/DALF", label: "DELF / DALF", subtitle: "Diplôme d'Études en Langue Française", placeholder: "Örn: B2", color: "#002395", scoreHint: "A1 – C2", logo: "/logos/delf.svg" },
  { value: "Cambridge", label: "Cambridge", subtitle: "Cambridge English Qualifications", placeholder: "Örn: C1", color: "#8B1A32", scoreHint: "A2 – C2", logo: "/logos/cambridge.svg" },
  { value: "DELE", label: "DELE", subtitle: "Diploma de Español como Lengua Extranjera", placeholder: "Örn: B2", color: "#c60b1e", scoreHint: "A1 – C2", logo: "/logos/dele.svg" },
  { value: "CELI/CILS", label: "CELI / CILS", subtitle: "Certificazione di Italiano", placeholder: "Örn: B2", color: "#008C45", scoreHint: "A1 – C2", logo: "/logos/celi.svg" },
];

const STEPS = [
  { icon: GraduationCap, title: "Akademik Bilgiler", subtitle: "GPA ve bölüm tercihin" },
  { icon: Languages, title: "Dil Sertifikan", subtitle: "Dil seviyeni belirle" },
  { icon: Wallet, title: "Bütçe", subtitle: "Eğitim bütçen" },
  { icon: Globe, title: "Hedef Ülkeler", subtitle: "Nereye gitmek istiyorsun?" },
  { icon: Compass, title: "Zamanlama", subtitle: "Ne zaman başvuracaksın?" },
];

const STEP_PANELS = [
  {
    heading: "Her yıl binlerce Türk öğrenci Avrupa'da lisans okuyor",
    stat: "250+",
    statLabel: "Lisans programı veritabanımızda",
    tip: "Profilini oluşturduktan sonra sana en uygun programları göstereceğiz.",
  },
  {
    heading: "Dil sertifikan kapıları açar",
    stat: "120+",
    statLabel: "Program IELTS 6.5 ile başvurulabilir",
    tip: "Birden fazla sertifikan varsa hepsini ekle — daha fazla program eşleşir.",
  },
  {
    heading: "Avrupa'daki programların %40'ı ücretsiz",
    stat: "%40",
    statLabel: "Program ücretsiz veya düşük ücretli",
    tip: "Almanya, Norveç ve Çekya'da devlet üniversiteleri harç almıyor.",
  },
  {
    heading: "19 ülke, yüzlerce fırsat",
    stat: "19",
    statLabel: "Avrupa ülkesi veritabanımızda",
    tip: "Ne kadar çok ülke seçersen o kadar fazla program eşleşir.",
  },
  {
    heading: "Zamanlamayı doğru planla",
    stat: "6-12",
    statLabel: "Ay öncesinden başvuru hazırlığı ideal",
    tip: "Erken başlarsan dil sınavı, vize ve burs başvuruları için yeterli zamanın olur.",
  },
];

// ─── Animated counter hook ───
function useCountUp(target: number | null, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === null || target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─── Time-based greeting ───
function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

// ─── Confetti ───
function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 2,
    color: ["#1e40af", "#d97706", "#16a34a", "#3b82f6", "#f59e0b", "#dc2626"][i % 6],
    size: 4 + Math.random() * 6,
    shape: i % 3, // 0=square, 1=circle, 2=rectangle
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: -10,
            width: p.shape === 2 ? p.size * 2 : p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 1 ? "50%" : "1px",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated stat for left panel ───
function AnimatedStat({ value }: { value: string }) {
  const numMatch = value.match(/^(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : null;
  const suffix = numMatch ? value.slice(numMatch[1].length) : value;
  const animated = useCountUp(num, 800);

  if (num === null) return <>{value}</>;
  return <>{animated}{suffix}</>;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, hasProfile } = useProfile();
  const [completedProfile, setCompletedProfile] = useState<StudentProfile | null>(null);

  // Redirect if already has profile
  if (hasProfile && !completedProfile) {
    router.replace("/dashboard");
    return null;
  }

  if (completedProfile) {
    return (
      <CompletionScreen
        profile={completedProfile}
        onContinue={() => {
          setProfile(completedProfile);
          router.push("/dashboard");
        }}
      />
    );
  }

  return <OnboardingWizard onComplete={(p) => setCompletedProfile(p)} />;
}

function CompletionScreen({ profile, onContinue }: { profile: StudentProfile; onContinue: () => void }) {
  const countryFlags = COUNTRIES.filter((c) => profile.targetCountries.includes(c.name));
  const [eligibleCount, setEligibleCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchAndCalculate() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("universities").select("*").eq("level", "bachelor").order("name");
        if (!data) return;

        const universities: University[] = data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          name: row.name as string,
          country: row.country as string,
          countryCode: row.country_code as string,
          city: row.city as string,
          program: row.program as string,
          department: row.department as string,
          requiredGPA: row.required_gpa as number,
          requiredLanguage: row.required_language as string,
          requiredLanguageScore: row.required_language_score as string,
          acceptedLanguages: (row.accepted_languages as University["acceptedLanguages"]) || [],
          tuitionEUR: row.tuition_eur as number,
          flag: row.flag as string,
        }));

        const input: StudentInput = {
          gpa: profile.gpa,
          languageCert: profile.languageCert || null,
          languageScore: profile.languageScore || null,
          budgetEUR: profile.budgetEUR,
          targetCountries: profile.targetCountries,
          targetDepartment: profile.targetDepartment,
        };

        const results = universities.map((u) => calculateEligibility(input, u));
        const eligible = results.filter((r) => r.status === "eligible" || r.status === "possible").length;
        setTotalCount(universities.length);
        setEligibleCount(eligible);
      } catch {
        // silently fail
      }
    }
    fetchAndCalculate();
  }, [profile]);

  const animatedEligible = useCountUp(eligibleCount, 1000);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg)" }}>
      <Confetti />
      <div className="w-full max-w-lg">
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-scale-in"
            style={{
              background: "linear-gradient(135deg, #0f1d3d 0%, #1e3a6e 100%)",
              boxShadow: "0 8px 32px rgba(15, 29, 61, 0.3)",
            }}
          >
            <Compass className="w-10 h-10" style={{ color: "var(--gold)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-2 animate-float-up" style={{ color: "var(--text)" }}>
            {getGreeting()}, {profile.fullName.split(" ")[0]}!
          </h1>
          <p className="text-lg font-bold mb-1 animate-float-up" style={{ color: "var(--text)", animationDelay: "0.1s" }}>
            Profilin hazır
          </p>
          {eligibleCount !== null ? (
            <p className="text-sm animate-float-up" style={{ color: "var(--muted)", animationDelay: "0.2s" }}>
              <span className="font-bold text-base" style={{ color: "var(--success)" }}>
                {animatedEligible} programa
              </span>{" "}
              başvurabilirsin
              {totalCount > 0 && <span> ({totalCount} program arasından)</span>}
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2 animate-float-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--blue)", borderTopColor: "transparent" }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Sana uygun programlar hesaplanıyor...
              </p>
            </div>
          )}
        </div>

        {/* Profile summary card */}
        <div
          className="rounded-2xl overflow-hidden mb-6 animate-float-up"
          style={{ border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", animationDelay: "0.3s" }}
        >
          {/* Header stripe */}
          <div
            className="px-6 py-4"
            style={{ background: "linear-gradient(135deg, #0f1d3d 0%, #1e3a6e 100%)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: "#fff" }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#fff" }}>
                  {profile.fullName}
                </div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {profile.targetDepartment || "Bölüm keşfediliyor"}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-4 space-y-3" style={{ backgroundColor: "var(--surface)" }}>
            {/* GPA */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Not Ortalaması</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{
                  color: profile.gpa >= 85 ? "var(--success)" : profile.gpa >= 70 ? "var(--blue)" : "var(--gold)",
                }}>
                  {profile.gpa}/100
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: profile.gpa >= 85 ? "var(--success-bg)" : profile.gpa >= 70 ? "var(--blue-bg)" : "var(--gold-bg)",
                    color: profile.gpa >= 85 ? "var(--success)" : profile.gpa >= 70 ? "var(--blue)" : "var(--gold)",
                  }}
                >
                  {profile.gpa >= 85 ? "Güçlü" : profile.gpa >= 70 ? "İyi" : "Orta"}
                </span>
              </div>
            </div>

            {/* Language certs */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Dil Sertifikaları</span>
              <div className="flex items-center gap-1.5">
                {profile.languageCerts.length > 0 ? (
                  profile.languageCerts.map((c) => (
                    <span
                      key={c.cert}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
                    >
                      {c.cert} {c.score}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>Henüz yok</span>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Bütçe</span>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {profile.budgetEUR === 99999
                  ? "Fark etmez"
                  : profile.budgetEUR === 0
                    ? "Ücretsiz programlar"
                    : `${profile.budgetEUR.toLocaleString("tr-TR")}€/yıl`}
              </span>
            </div>

            {/* Countries */}
            <div>
              <span className="text-xs block mb-2" style={{ color: "var(--muted)" }}>Hedef Ülkeler</span>
              <div className="flex flex-wrap gap-1">
                {countryFlags.map((c) => (
                  <span
                    key={c.name}
                    className="text-[11px] px-2 py-1 rounded-lg font-medium flex items-center gap-1"
                    style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
                  >
                    {c.flag} {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] animate-float-up"
          style={{
            animationDelay: "0.5s",
            background: "linear-gradient(135deg, #0f1d3d 0%, #1e3a6e 100%)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(15, 29, 61, 0.25)",
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: "var(--gold)" }} />
          Programları Keşfetmeye Başla
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-center mt-4" style={{ color: "var(--muted)" }}>
          Profilini istediğin zaman güncelleyebilirsin
        </p>
      </div>
    </div>
  );
}

function OnboardingWizard({ onComplete }: { onComplete: (profile: StudentProfile) => void }) {
  const [step, setStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [gpa, setGpa] = useState(75);
  const [targetDepartment, setTargetDepartment] = useState("");
  const [selectedCerts, setSelectedCerts] = useState<Record<string, string>>({}); // cert -> score
  const [budgetEUR, setBudgetEUR] = useState(3000);
  const [targetCountries, setTargetCountries] = useState<string[]>([]);
  const [applicationTimeline, setApplicationTimeline] = useState("");

  function toggleCountry(c: string) {
    setTargetCountries((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function toggleCert(certValue: string) {
    setSelectedCerts((prev) => {
      const next = { ...prev };
      if (certValue in next) {
        delete next[certValue];
      } else {
        next[certValue] = "";
      }
      return next;
    });
  }

  function setCertScore(certValue: string, score: string) {
    setSelectedCerts((prev) => ({ ...prev, [certValue]: score }));
  }

  function handleFinish() {
    const certs = Object.entries(selectedCerts)
      .filter(([, score]) => score.trim().length > 0)
      .map(([cert, score]) => ({ cert, score }));

    const primary = certs[0];

    onComplete({
      fullName,
      gpa,
      languageCerts: certs,
      languageCert: primary?.cert || "",
      languageScore: primary ? parseFloat(primary.score) || 0 : 0,
      budgetEUR,
      targetCountries,
      targetDepartment,
      applicationTimeline,
      completedAt: new Date().toISOString(),
    });
  }

  const canProceed = () => {
    if (step === 0) return fullName.trim().length > 0;
    if (step === 3) return targetCountries.length > 0;
    if (step === 4) return applicationTimeline.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left side — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] p-10"
        style={{ background: "linear-gradient(135deg, #0f1d3d 0%, #1e3a6e 100%)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-10">
            <Compass className="w-7 h-7" style={{ color: "var(--gold)" }} />
            <span className="text-xl font-bold" style={{ color: "#fff" }}>
              Pusula
              <span
                className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 mb-2"
                style={{ backgroundColor: "var(--gold)" }}
              />
            </span>
          </div>

          {/* Dynamic content per step */}
          <div key={`panel-${step}`} className="animate-fade-in">
            <h2 className="text-xl font-bold mb-5 leading-snug" style={{ color: "#fff" }}>
              {STEP_PANELS[step].heading}
            </h2>

            {/* Stat highlight */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="text-3xl font-black mb-1" style={{ color: "var(--gold)" }}>
                <AnimatedStat value={STEP_PANELS[step].stat} />
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                {STEP_PANELS[step].statLabel}
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {STEP_PANELS[step].tip}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDone
                      ? "rgba(34,197,94,0.2)"
                      : isActive
                        ? "rgba(59,130,246,0.2)"
                        : "rgba(255,255,255,0.08)",
                  }}
                >
                  {isDone ? (
                    <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
                  ) : (
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isActive ? "#60a5fa" : "rgba(255,255,255,0.3)" }}
                    />
                  )}
                </div>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color: isDone ? "var(--success)" : isActive ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {s.title}
                  </div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {s.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side — form or quiz */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md py-8">
          {/* Department Quiz — full-screen overlay */}
          {showQuiz ? (
            <div className="animate-fade-in-up">
              <DepartmentQuiz
                onComplete={(dept) => {
                  setTargetDepartment(dept);
                  setShowQuiz(false);
                }}
                onSkip={() => setShowQuiz(false)}
              />
            </div>
          ) : (
          <>
          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: i <= step ? "var(--blue)" : "var(--border)",
                }}
              />
            ))}
          </div>

          {/* Step 0: Academic */}
          {step === 0 && (
            <div key="step-0" className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Akademik Bilgilerin
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Temel akademik bilgilerini girelim
                </p>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  Adın Soyadın
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adını ve soyadını yaz"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
                  Lise Not Ortalaması (100 üzerinden)
                </label>

                {/* GPA visual indicator */}
                <div
                  className="rounded-xl p-4 mb-3"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="text-3xl font-bold"
                      style={{
                        color: gpa >= 85 ? "var(--success)" : gpa >= 70 ? "var(--blue)" : gpa >= 55 ? "var(--gold)" : "var(--danger)",
                      }}
                    >
                      {gpa}
                    </div>
                    <div
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: gpa >= 85 ? "var(--success-bg)" : gpa >= 70 ? "var(--blue-bg)" : gpa >= 55 ? "var(--gold-bg)" : "var(--danger-bg)",
                        color: gpa >= 85 ? "var(--success)" : gpa >= 70 ? "var(--blue)" : gpa >= 55 ? "var(--gold)" : "var(--danger)",
                      }}
                    >
                      {gpa >= 85 ? "Güçlü" : gpa >= 70 ? "İyi" : gpa >= 55 ? "Orta" : "Geliştirilmeli"}
                    </div>
                  </div>

                  {/* Segmented bar */}
                  <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-2">
                    {Array.from({ length: 60 }, (_, i) => {
                      const val = 40 + i;
                      const filled = val <= gpa;
                      let color = "var(--danger)";
                      if (val >= 85) color = "var(--success)";
                      else if (val >= 70) color = "var(--blue)";
                      else if (val >= 55) color = "var(--gold)";
                      return (
                        <div
                          key={val}
                          className="flex-1 rounded-[1px] transition-all"
                          style={{
                            backgroundColor: filled ? color : "var(--surface2)",
                            opacity: filled ? 1 : 0.4,
                          }}
                        />
                      );
                    })}
                  </div>

                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={gpa}
                    onChange={(e) => setGpa(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      accentColor: gpa >= 85 ? "var(--success)" : gpa >= 70 ? "var(--blue)" : gpa >= 55 ? "var(--gold)" : "var(--danger)",
                      background: "transparent",
                    }}
                  />
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                    <span>40</span>
                    <span>55</span>
                    <span>70</span>
                    <span>85</span>
                    <span>100</span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {gpa >= 85
                    ? "Çoğu Avrupa üniversitesine başvurabilirsin. Seçici programlar da dahil."
                    : gpa >= 70
                      ? "Birçok güçlü program için uygunsun. Bazı seçici programlar zorlayabilir."
                      : gpa >= 55
                        ? "Birçok program için başvurabilirsin. Ücretsiz programlara öncelik verelim."
                        : "Sınırlı sayıda program için başvurabilirsin. Seçeneklerini birlikte değerlendirelim."}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium block mb-2" style={{ color: "var(--muted)" }}>
                  Hedef Bölüm
                </label>

                {/* Department chips grid */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {DEPARTMENTS.map((dept) => {
                    const Icon = dept.icon;
                    const isSelected = targetDepartment === dept.value;
                    return (
                      <button
                        key={dept.value}
                        type="button"
                        onClick={() => setTargetDepartment(isSelected ? "" : dept.value)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                        style={{
                          backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface)",
                          border: `1.5px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                          color: isSelected ? "var(--blue)" : "var(--text)",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ opacity: isSelected ? 1 : 0.5 }} />
                        <span className="truncate">{dept.label}</span>
                        {isSelected && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Quiz card — always visible but more prominent when no department */}
                <button
                  type="button"
                  onClick={() => setShowQuiz(true)}
                  className="w-full rounded-xl p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] animate-fade-in"
                  style={{
                    background: targetDepartment
                      ? "var(--surface)"
                      : "linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(30,64,175,0.06) 100%)",
                    border: `1.5px solid ${targetDepartment ? "var(--border)" : "var(--gold-border)"}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: targetDepartment
                          ? "var(--surface2)"
                          : "linear-gradient(135deg, var(--gold-bg) 0%, var(--blue-bg) 100%)",
                        border: `1px solid ${targetDepartment ? "var(--border)" : "var(--gold-border)"}`,
                      }}
                    >
                      <HelpCircle className="w-4 h-4" style={{ color: targetDepartment ? "var(--muted)" : "var(--gold)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-0.5" style={{ color: targetDepartment ? "var(--muted)" : "var(--text)" }}>
                        {targetDepartment ? "Bölümünden emin değil misin?" : "Hangi bölüm sana uygun?"}
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                        10 soruluk kısa testimizle ilgi alanlarına en uygun bölümü keşfet
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: targetDepartment ? "var(--surface2)" : "var(--gold-bg)",
                        color: targetDepartment ? "var(--muted)" : "var(--gold)",
                        border: `1px solid ${targetDepartment ? "var(--border)" : "var(--gold-border)"}`,
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Teste Başla
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Language */}
          {step === 1 && (
            <div key="step-1" className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Dil Sertifikaların
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Sahip olduğun sertifikaları seç ve puanını gir (birden fazla seçebilirsin)
                </p>
              </div>

              <div className="space-y-2">
                {LANG_CERTS.map((cert) => {
                  const isSelected = cert.value in selectedCerts;
                  return (
                    <div
                      key={cert.value}
                      className="rounded-xl transition-all overflow-hidden"
                      style={{
                        border: `1.5px solid ${isSelected ? cert.color : "var(--border)"}`,
                        backgroundColor: isSelected ? `${cert.color}08` : "var(--surface)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCert(cert.value)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                      >
                        {/* Logo */}
                        <div
                          className="w-14 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5"
                          style={{
                            backgroundColor: isSelected ? `${cert.color}10` : "var(--surface2)",
                            border: `1px solid ${isSelected ? `${cert.color}25` : "var(--border)"}`,
                          }}
                        >
                          <img
                            src={cert.logo}
                            alt={cert.label}
                            className="w-full h-full object-contain"
                            style={{ opacity: isSelected ? 1 : 0.6 }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold" style={{ color: isSelected ? cert.color : "var(--text)" }}>
                            {cert.label}
                          </div>
                          <div className="text-[10px] truncate" style={{ color: "var(--muted)" }}>
                            {cert.subtitle}
                          </div>
                        </div>

                        {/* Toggle indicator */}
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            backgroundColor: isSelected ? cert.color : "transparent",
                            border: `2px solid ${isSelected ? cert.color : "var(--border)"}`,
                          }}
                        >
                          {isSelected && <Check className="w-3 h-3" style={{ color: "#fff" }} />}
                        </div>
                      </button>

                      {/* Score input — slides open when selected */}
                      {isSelected && (
                        <div
                          className="px-4 pb-3 animate-fade-in"
                          style={{ borderTop: `1px solid ${cert.color}20` }}
                        >
                          <div className="flex items-center gap-3 mt-2.5">
                            <div className="flex-1">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={selectedCerts[cert.value] || ""}
                                onChange={(e) => setCertScore(cert.value, e.target.value)}
                                placeholder={cert.placeholder}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-shadow"
                                style={{
                                  backgroundColor: "var(--surface)",
                                  border: `1px solid ${cert.color}30`,
                                  color: "var(--text)",
                                }}
                                autoFocus
                              />
                            </div>
                            <span className="text-[10px] font-medium flex-shrink-0" style={{ color: "var(--muted)" }}>
                              {cert.scoreHint}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {Object.keys(selectedCerts).length === 0 && (
                <p className="text-xs text-center py-2" style={{ color: "var(--muted)" }}>
                  Henüz sertifikan yoksa bu adımı atlayabilirsin
                </p>
              )}

              {Object.keys(selectedCerts).length > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--blue)" }}>
                  <Check className="w-3.5 h-3.5" />
                  {Object.keys(selectedCerts).length} sertifika seçildi
                </div>
              )}
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div key="step-2" className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Eğitim Bütçen
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Yıllık eğitim harcı için ayırabileceğin yaklaşık bütçe
                </p>
              </div>

              {/* Quick budget presets */}
              <div className="space-y-2">
                {[
                  { value: 0, label: "Sadece ücretsiz programlar", desc: "Harç ücreti olmayan devlet üniversiteleri", icon: "🆓", color: "var(--success)" },
                  { value: 2500, label: "Düşük bütçe", desc: "Yılda 2.500€'ya kadar", icon: "💶", color: "var(--blue)" },
                  { value: 5000, label: "Orta bütçe", desc: "Yılda 5.000€'ya kadar", icon: "💰", color: "var(--gold)" },
                  { value: 15000, label: "Yüksek bütçe", desc: "Yılda 15.000€ ve üzeri", icon: "🏦", color: "var(--gold-light)" },
                  { value: 99999, label: "Bütçe önemli değil", desc: "Tüm programları göster", icon: "♾️", color: "var(--muted)" },
                ].map((preset) => {
                  const isSelected = budgetEUR === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBudgetEUR(preset.value)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: isSelected ? `${preset.color}10` : "var(--surface)",
                        border: `1.5px solid ${isSelected ? preset.color : "var(--border)"}`,
                        transform: isSelected ? "scale(1.01)" : "scale(1)",
                      }}
                    >
                      <span className="text-xl flex-shrink-0">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold" style={{ color: isSelected ? preset.color : "var(--text)" }}>
                          {preset.label}
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                          {preset.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: preset.color }}
                        >
                          <Check className="w-3 h-3" style={{ color: "#fff" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Fine-tune slider — only for non-preset values or when a range is selected */}
              {budgetEUR !== 99999 && (
                <div
                  className="rounded-xl p-4 animate-fade-in"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                      Tam tutarı ayarla
                    </span>
                    <span className="text-sm font-bold" style={{
                      color: budgetEUR === 0 ? "var(--success)" : "var(--gold)",
                    }}>
                      {budgetEUR === 0 ? "Ücretsiz" : `${budgetEUR.toLocaleString("tr-TR")}€`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="250"
                    value={budgetEUR}
                    onChange={(e) => setBudgetEUR(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: budgetEUR === 0 ? "var(--success)" : "var(--gold)" }}
                  />
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                    <span>0€</span>
                    <span>5.000€</span>
                    <span>10.000€</span>
                    <span>20.000€</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Step 3: Target Countries */}
          {step === 3 && (
            <div key="step-3" className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Hedef Ülkelerin
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Başvurmayı düşündüğün ülkeleri seç (birden fazla seçebilirsin)
                </p>
              </div>

              {/* Select all / clear */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {targetCountries.length > 0 && (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
                    >
                      {targetCountries.length} ülke seçildi
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetCountries(COUNTRIES.map((c) => c.name))}
                    className="text-[11px] font-medium hover:opacity-80 transition-opacity"
                    style={{ color: "var(--blue)" }}
                  >
                    Tümünü Seç
                  </button>
                  {targetCountries.length > 0 && (
                    <>
                      <span style={{ color: "var(--border)" }}>|</span>
                      <button
                        type="button"
                        onClick={() => setTargetCountries([])}
                        className="text-[11px] font-medium hover:opacity-80 transition-opacity"
                        style={{ color: "var(--muted)" }}
                      >
                        Temizle
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Country grid */}
              <div className="grid grid-cols-3 gap-2">
                {COUNTRIES.map((country) => {
                  const isSelected = targetCountries.includes(country.name);
                  return (
                    <button
                      key={country.name}
                      type="button"
                      onClick={() => toggleCountry(country.name)}
                      className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-center transition-all"
                      style={{
                        backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface)",
                        border: `1.5px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                        transform: isSelected ? "scale(1.03)" : "scale(1)",
                      }}
                    >
                      <span className="text-2xl leading-none">{country.flag}</span>
                      <span
                        className="text-[11px] font-medium leading-tight"
                        style={{ color: isSelected ? "var(--blue)" : "var(--text)" }}
                      >
                        {country.name}
                      </span>
                      {isSelected && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--blue)" }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: "#fff" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Application Timeline */}
          {step === 4 && (
            <div key="step-4" className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Ne Zaman Başvuracaksın?
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Başvuru zamanlamanı bilmemiz sana daha iyi rehberlik etmemizi sağlar
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { value: "this_year", icon: "🎯", label: "Bu yıl başvuracağım", desc: "Deadline'lar yakın — hemen hazırlığa başlamalısın" },
                  { value: "next_year", icon: "📅", label: "Gelecek yıl başvuracağım", desc: "Harika zamanlama — dil sınavı ve araştırma için bolca vaktin var" },
                  { value: "later", icon: "🔮", label: "2+ yıl sonra planlıyorum", desc: "Erkenden araştırmaya başlamak büyük avantaj" },
                  { value: "exploring", icon: "🧭", label: "Sadece araştırıyorum", desc: "Henüz karar vermedim, seçeneklerimi görmek istiyorum" },
                ].map((option) => {
                  const isSelected = applicationTimeline === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setApplicationTimeline(option.value)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface)",
                        border: `1.5px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                        transform: isSelected ? "scale(1.01)" : "scale(1)",
                      }}
                    >
                      <span className="text-xl flex-shrink-0">{option.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold" style={{ color: isSelected ? "var(--blue)" : "var(--text)" }}>
                          {option.label}
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                          {option.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "var(--blue)" }}
                        >
                          <Check className="w-3 h-3" style={{ color: "#fff" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Geri
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--blue)", color: "#fff" }}
              >
                Devam
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--blue)", color: "#fff" }}
              >
                <Sparkles className="w-4 h-4" />
                Profilimi Oluştur
              </button>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile, type StudentProfile } from "@/lib/profile-context";
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
  "Almanya", "Avusturya", "Belçika", "Çekya", "Danimarka",
  "Finlandiya", "Fransa", "Hollanda", "İngiltere", "İrlanda",
  "İspanya", "İsveç", "İsviçre", "İtalya", "Macaristan",
  "Portekiz",
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
  { icon: Wallet, title: "Bütçe", subtitle: "Yıllık eğitim bütçen" },
  { icon: Globe, title: "Hedef Ülkeler", subtitle: "Nereye gitmek istiyorsun?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, hasProfile } = useProfile();

  // Redirect if already has profile
  if (hasProfile) {
    router.replace("/dashboard");
    return null;
  }

  return <OnboardingWizard onComplete={(p) => { setProfile(p); router.push("/dashboard"); }} />;
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
      completedAt: new Date().toISOString(),
    });
  }

  const canProceed = () => {
    if (step === 0) return fullName.trim().length > 0;
    if (step === 3) return targetCountries.length > 0;
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
          <div className="flex items-center gap-2 mb-12">
            <Compass className="w-7 h-7" style={{ color: "var(--gold)" }} />
            <span className="text-xl font-bold" style={{ color: "#fff" }}>
              Pusula
              <span
                className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 mb-2"
                style={{ backgroundColor: "var(--gold)" }}
              />
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#fff" }}>
            Hayalindeki üniversiteyi bulalım
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Birkaç bilgiyi girdikten sonra sana en uygun programları, ülkeleri ve başvuru
            süreçlerini gösterelim. Her şey sana özel şekillenecek.
          </p>
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
            <div key="step-2" className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Yıllık Bütçen
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Yıllık eğitim harcı için ayırabileceğin bütçe (EUR)
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={budgetEUR}
                    onChange={(e) => setBudgetEUR(Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "var(--gold)" }}
                  />
                  <div
                    className="text-center text-lg font-bold rounded-lg py-1 px-3 min-w-[90px]"
                    style={{ backgroundColor: "var(--gold-bg)", color: "var(--gold)" }}
                  >
                    {budgetEUR.toLocaleString("tr-TR")}€
                  </div>
                </div>
                <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                  <span>Ücretsiz</span>
                  <span>10.000€</span>
                  <span>20.000€</span>
                </div>
              </div>

              <div
                className="rounded-xl p-4 text-xs leading-relaxed"
                style={{ backgroundColor: "var(--blue-bg)", border: "1px solid var(--blue-border)", color: "var(--muted)" }}
              >
                <span style={{ color: "var(--blue)" }} className="font-semibold">Bilgi: </span>
                Almanya&apos;da çoğu devlet üniversitesi ücretsiz, Hollanda ~2.200€/yıl, İtalya 0-4.000€ (gelire göre).
                Bütçen düşükse ücretsiz programlara odaklanacağız.
              </div>
            </div>
          )}

          {/* Step 3: Target Countries */}
          {step === 3 && (
            <div key="step-3" className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
                  Hedef Ülkelerin
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Başvurmayı düşündüğün ülkeleri seç (birden fazla seçebilirsin)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map((country) => {
                  const selected = targetCountries.includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleCountry(country)}
                      className="px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between"
                      style={{
                        backgroundColor: selected ? "var(--blue-bg)" : "var(--surface)",
                        border: `1px solid ${selected ? "var(--blue-border)" : "var(--border)"}`,
                        color: selected ? "var(--blue)" : "var(--text)",
                      }}
                    >
                      {country}
                      {selected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>

              {targetCountries.length > 0 && (
                <p className="text-xs text-center" style={{ color: "var(--blue)" }}>
                  {targetCountries.length} ülke seçildi
                </p>
              )}
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

            {step < 3 ? (
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

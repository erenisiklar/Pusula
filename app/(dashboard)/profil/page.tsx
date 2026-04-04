"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import {
  User,
  GraduationCap,
  Languages,
  Wallet,
  Globe,
  Compass,
  Save,
  Trash2,
  ArrowLeft,
  Check,
} from "lucide-react";

const LANG_CERTS = ["IELTS", "TOEFL", "TestDaF", "DELF/DALF", "Cambridge", "DELE", "CELI/CILS"];

const COUNTRIES = [
  { name: "Almanya", flag: "🇩🇪" }, { name: "Avusturya", flag: "🇦🇹" },
  { name: "Belçika", flag: "🇧🇪" }, { name: "Çekya", flag: "🇨🇿" },
  { name: "Danimarka", flag: "🇩🇰" }, { name: "Estonya", flag: "🇪🇪" },
  { name: "Finlandiya", flag: "🇫🇮" }, { name: "Fransa", flag: "🇫🇷" },
  { name: "Hollanda", flag: "🇳🇱" }, { name: "İngiltere", flag: "🇬🇧" },
  { name: "İrlanda", flag: "🇮🇪" }, { name: "İspanya", flag: "🇪🇸" },
  { name: "İsveç", flag: "🇸🇪" }, { name: "İsviçre", flag: "🇨🇭" },
  { name: "İtalya", flag: "🇮🇹" }, { name: "Macaristan", flag: "🇭🇺" },
  { name: "Norveç", flag: "🇳🇴" }, { name: "Polonya", flag: "🇵🇱" },
  { name: "Portekiz", flag: "🇵🇹" },
];

const DEPARTMENTS = [
  "Bilgisayar Mühendisliği", "Mühendislik", "İşletme", "Ekonomi",
  "Mimarlık", "Siyaset Bilimi", "Uluslararası İlişkiler", "Psikoloji",
  "Elektrik-Elektronik Mühendisliği", "Makine Mühendisliği",
  "Havacılık Mühendisliği", "Tıp Bilimleri", "Tasarım",
];

export default function ProfilPage() {
  const router = useRouter();
  const { profile, updateProfile, clearProfile } = useProfile();

  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [gpa, setGpa] = useState(profile?.gpa ?? 75);
  const [targetDepartment, setTargetDepartment] = useState(profile?.targetDepartment ?? "");
  const [certs, setCerts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    if (profile?.languageCerts) {
      for (const c of profile.languageCerts) init[c.cert] = c.score;
    }
    return init;
  });
  const [budgetEUR, setBudgetEUR] = useState(profile?.budgetEUR ?? 5000);
  const [targetCountries, setTargetCountries] = useState<string[]>(profile?.targetCountries ?? []);
  const [applicationTimeline, setApplicationTimeline] = useState(profile?.applicationTimeline ?? "");
  const [saved, setSaved] = useState(false);

  if (!profile) {
    router.replace("/onboarding");
    return null;
  }

  function toggleCert(cert: string) {
    setCerts((prev) => {
      const next = { ...prev };
      if (cert in next) delete next[cert];
      else next[cert] = "";
      return next;
    });
  }

  function toggleCountry(c: string) {
    setTargetCountries((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function handleSave() {
    const langCerts = Object.entries(certs)
      .filter(([, s]) => s.trim().length > 0)
      .map(([cert, score]) => ({ cert, score }));
    const primary = langCerts[0];

    updateProfile({
      fullName,
      gpa,
      targetDepartment,
      languageCerts: langCerts,
      languageCert: primary?.cert || "",
      languageScore: primary ? parseFloat(primary.score) || 0 : 0,
      budgetEUR,
      targetCountries,
      applicationTimeline,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    clearProfile();
    router.push("/onboarding");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Profilim</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Bilgilerini güncelle, değişiklikler anında yansır</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--surface2)", color: "var(--muted)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Geri
        </button>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <Section icon={User} title="Kişisel Bilgiler">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>Ad Soyad</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
        </Section>

        {/* Academic */}
        <Section icon={GraduationCap} title="Akademik Bilgiler">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>
              GPA (100 üzerinden)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range" min="40" max="100" value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: gpa >= 85 ? "var(--success)" : gpa >= 70 ? "var(--blue)" : "var(--gold)" }}
              />
              <span
                className="text-lg font-bold w-12 text-center rounded-lg py-0.5"
                style={{
                  backgroundColor: gpa >= 85 ? "var(--success-bg)" : gpa >= 70 ? "var(--blue-bg)" : "var(--gold-bg)",
                  color: gpa >= 85 ? "var(--success)" : gpa >= 70 ? "var(--blue)" : "var(--gold)",
                }}
              >
                {gpa}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--muted)" }}>Hedef Bölüm</label>
            <select
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
              style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <option value="">Henüz karar vermedim</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </Section>

        {/* Language */}
        <Section icon={Languages} title="Dil Sertifikaları">
          <div className="flex flex-wrap gap-1.5">
            {LANG_CERTS.map((cert) => {
              const isSelected = cert in certs;
              return (
                <button
                  key={cert} type="button"
                  onClick={() => toggleCert(cert)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface2)",
                    border: `1px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                    color: isSelected ? "var(--blue)" : "var(--text)",
                  }}
                >
                  {cert} {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                </button>
              );
            })}
          </div>
          {Object.keys(certs).length > 0 && (
            <div className="space-y-2 mt-3">
              {Object.entries(certs).map(([cert, score]) => (
                <div key={cert} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-20" style={{ color: "var(--text)" }}>{cert}</span>
                  <input
                    type="text" inputMode="decimal"
                    value={score}
                    onChange={(e) => setCerts((p) => ({ ...p, [cert]: e.target.value }))}
                    placeholder="Puan"
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-shadow"
                    style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Budget */}
        <Section icon={Wallet} title="Bütçe">
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 0, label: "Ücretsiz" },
              { value: 2500, label: "~2.500€" },
              { value: 5000, label: "~5.000€" },
              { value: 15000, label: "15.000€+" },
              { value: 99999, label: "Fark etmez" },
            ].map((opt) => (
              <button
                key={opt.value} type="button"
                onClick={() => setBudgetEUR(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: budgetEUR === opt.value ? "var(--gold-bg)" : "var(--surface2)",
                  border: `1px solid ${budgetEUR === opt.value ? "var(--gold)" : "var(--border)"}`,
                  color: budgetEUR === opt.value ? "var(--gold)" : "var(--text)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Countries */}
        <Section icon={Globe} title="Hedef Ülkeler">
          <div className="flex flex-wrap gap-1.5">
            {COUNTRIES.map((c) => {
              const isSelected = targetCountries.includes(c.name);
              return (
                <button
                  key={c.name} type="button"
                  onClick={() => toggleCountry(c.name)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                  style={{
                    backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface2)",
                    border: `1px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                    color: isSelected ? "var(--blue)" : "var(--text)",
                  }}
                >
                  {c.flag} {c.name}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Timeline */}
        <Section icon={Compass} title="Başvuru Zamanlaması">
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: "this_year", label: "🎯 Bu yıl" },
              { value: "next_year", label: "📅 Gelecek yıl" },
              { value: "later", label: "🔮 2+ yıl sonra" },
              { value: "exploring", label: "🧭 Araştırıyorum" },
            ].map((opt) => (
              <button
                key={opt.value} type="button"
                onClick={() => setApplicationTimeline(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: applicationTimeline === opt.value ? "var(--blue-bg)" : "var(--surface2)",
                  border: `1px solid ${applicationTimeline === opt.value ? "var(--blue)" : "var(--border)"}`,
                  color: applicationTimeline === opt.value ? "var(--blue)" : "var(--text)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)", border: "1px solid rgba(220,38,38,0.15)" }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Profili Sıfırla
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--blue)", color: "#fff" }}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Kaydedildi
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 space-y-4 animate-fade-in-up"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}>
        <Icon className="w-4 h-4" style={{ color: "var(--blue)" }} />
        {title}
      </h2>
      {children}
    </div>
  );
}

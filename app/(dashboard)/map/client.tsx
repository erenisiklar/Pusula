"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { University } from "@/types";
import type { AcceptanceRow } from "@/lib/supabase/queries";
import { ExternalLink, X, Clock, Euro, GraduationCap, Users, MessageSquare, TrendingUp } from "lucide-react";

interface SelectedUni {
  university: University;
  imageUrl: string;
  wikiTitle: string | null;
  website: string;
  durationYears: number;
  countryColor: string;
}

export interface EligibilityInfo {
  score: number;
  status: "eligible" | "possible" | "reach" | "unlikely";
}

const COUNTRIES = [
  { name: "Almanya",    color: "#3b82f6" },
  { name: "Hollanda",   color: "#f59e0b" },
  { name: "İtalya",     color: "#22c55e" },
  { name: "Fransa",     color: "#60a5fa" },
  { name: "İspanya",    color: "#ef4444" },
  { name: "İsveç",      color: "#fbbf24" },
  { name: "İngiltere",  color: "#3b82f6" },
  { name: "İsviçre",    color: "#22c55e" },
  { name: "Belçika",    color: "#f59e0b" },
  { name: "Avusturya",  color: "#ef4444" },
  { name: "Danimarka",  color: "#60a5fa" },
  { name: "Norveç",     color: "#3b82f6" },
  { name: "Finlandiya", color: "#22c55e" },
  { name: "Portekiz",   color: "#fbbf24" },
  { name: "İrlanda",    color: "#22c55e" },
  { name: "Polonya",    color: "#ef4444" },
  { name: "Çekya",      color: "#3b82f6" },
  { name: "Macaristan", color: "#f59e0b" },
  { name: "Estonya",    color: "#60a5fa" },
];

const STATUS_CONFIG = {
  eligible: { label: "Uygun",  color: "var(--success)", bg: "var(--success-bg)" },
  possible: { label: "Mümkün", color: "var(--blue)",    bg: "var(--blue-bg)"    },
  reach:    { label: "Zor",    color: "var(--gold)",    bg: "var(--gold-bg)"    },
  unlikely: { label: "Düşük",  color: "var(--danger)",  bg: "var(--danger-bg)"  },
};

function calcEligibility(
  uni: University,
  gpa: number | null,
  lang: "yes" | "no" | null,
  budget: number | null,
): EligibilityInfo {
  let score = 0;
  if (gpa !== null) {
    if (gpa >= uni.requiredGPA) score += 25;
    else score += Math.max(-25, (gpa - uni.requiredGPA) * 3);
  }
  if (lang === "yes") score += 25;
  else if (lang === "no") score -= 30;
  if (budget !== null) {
    if (uni.tuitionEUR === 0 || budget >= uni.tuitionEUR) score += 10;
    else score -= 20;
  }
  const status =
    score >= 80 ? "eligible" :
    score >= 55 ? "possible" :
    score >= 30 ? "reach"    : "unlikely";
  return { score, status };
}

export default function MapClient({
  universities,
  acceptanceStats,
}: {
  universities: University[];
  acceptanceStats: AcceptanceRow[];
}) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    universities: University[];
    onSelect: (uni: SelectedUni | null) => void;
    activeCountries: Set<string>;
    eligibilityMap: Map<string, EligibilityInfo>;
    filterActive: boolean;
  }> | null>(null);

  const [selected, setSelected] = useState<SelectedUni | null>(null);
  const [campusImg, setCampusImg] = useState<string>(
    "https://images.unsplash.com/photo-1562774053-701939374585?w=640&q=80"
  );
  const [activeCountries, setActiveCountries] = useState<Set<string>>(
    new Set(COUNTRIES.map((c) => c.name))
  );

  const [gpaInput, setGpaInput]       = useState("");
  const [langInput, setLangInput]     = useState<"yes" | "no" | "">("");
  const [budgetInput, setBudgetInput] = useState("");

  const filterActive = gpaInput !== "" || langInput !== "";

  const eligibilityMap = useMemo<Map<string, EligibilityInfo>>(() => {
    const map = new Map<string, EligibilityInfo>();
    if (!filterActive && budgetInput === "") return map;
    const gpa    = gpaInput    !== "" ? parseFloat(gpaInput)    : null;
    const lang   = langInput   !== "" ? (langInput as "yes" | "no") : null;
    const budget = budgetInput !== "" ? parseFloat(budgetInput) : null;
    universities.forEach((uni) => {
      map.set(uni.id, calcEligibility(uni, gpa, lang, budget));
    });
    return map;
  }, [universities, gpaInput, langInput, budgetInput, filterActive]);

  const acceptanceMap = useMemo(() => {
    const m = new Map<string, AcceptanceRow>();
    acceptanceStats.forEach((r) => m.set(r.universityId, r));
    return m;
  }, [acceptanceStats]);

  useEffect(() => {
    import("./LeafletMap").then((mod) => setMapComponent(() => mod.default));
  }, []);

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1562774053-701939374585?w=640&q=80";

  useEffect(() => {
    if (!selected) return;
    // Önce university-map-data'daki Wikimedia Commons fotoğrafını kullan
    if (selected.imageUrl && selected.imageUrl !== FALLBACK_IMG) {
      setCampusImg(selected.imageUrl);
      return;
    }
    // imageUrl yoksa Wikipedia API'den dene
    setCampusImg(FALLBACK_IMG);

    // Wikipedia API'den gerçek makale thumbnail'ini çek (en güvenilir kaynak)
    if (selected.wikiTitle) {
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${selected.wikiTitle}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.thumbnail?.source) {
            setCampusImg(data.thumbnail.source.replace(/\/\d+px-/, "/640px-"));
          } else if (selected.imageUrl) {
            // Wikipedia thumbnail yoksa Wikimedia Commons imageUrl'i dene
            setCampusImg(selected.imageUrl);
          }
        })
        .catch(() => {
          // Wikipedia API başarısızsa imageUrl'i dene
          if (selected.imageUrl) {
            setCampusImg(selected.imageUrl);
          }
        });
    } else if (selected.imageUrl) {
      // wikiTitle yoksa doğrudan imageUrl kullan
      setCampusImg(selected.imageUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.university.id]);

  function toggleCountry(name: string) {
    setActiveCountries((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size > 1) next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  const selectedAcceptance  = selected ? acceptanceMap.get(selected.university.id)  : null;
  const selectedEligibility = (selected && (filterActive || budgetInput !== ""))
    ? eligibilityMap.get(selected.university.id)
    : null;

  return (
    <div className="h-full flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Header + filter bar */}
      <div className="mb-3 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Üniversite Haritası</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {universities.length} üniversite · {COUNTRIES.length} ülke — Pinlere tıklayarak detay görün
          </p>
        </div>

        {/* Eligibility filter */}
        <div
          className="flex items-center gap-2 flex-wrap"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Filtrele:</span>
          <input
            type="number"
            min={0}
            max={100}
            placeholder="GPA (0-100)"
            value={gpaInput}
            onChange={(e) => setGpaInput(e.target.value)}
            style={{
              width: 110,
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface2)",
              color: "var(--text)",
              fontSize: 12,
            }}
          />
          <select
            value={langInput}
            onChange={(e) => setLangInput(e.target.value as "yes" | "no" | "")}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface2)",
              color: langInput === "" ? "var(--muted)" : "var(--text)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <option value="">Dil sertifikası</option>
            <option value="yes">Var</option>
            <option value="no">Yok</option>
          </select>
          <input
            type="number"
            min={0}
            placeholder="Bütçe (€/yıl)"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            style={{
              width: 110,
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface2)",
              color: "var(--text)",
              fontSize: 12,
            }}
          />
          {(filterActive || budgetInput !== "") && (
            <button
              onClick={() => { setGpaInput(""); setLangInput(""); setBudgetInput(""); }}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface2)",
                color: "var(--muted)",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Country legend / toggle */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {COUNTRIES.map((c) => {
          const active = activeCountries.has(c.name);
          return (
            <button
              key={c.name}
              onClick={() => toggleCountry(c.name)}
              className="flex items-center gap-1 text-xs transition-opacity"
              style={{
                opacity: active ? 1 : 0.35,
                color: active ? "var(--text)" : "var(--muted)",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: "2px 4px",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: c.color,
                  boxShadow: active ? `0 0 0 2px ${c.color}30` : "none",
                }}
              />
              {c.name}
            </button>
          );
        })}
        <span className="text-xs ml-auto" style={{ color: "var(--muted)", opacity: 0.45 }}>
          Ülkelere tıklayarak filtrele
        </span>
      </div>

      <div className="flex gap-4 flex-1">
        {/* Map */}
        <div
          className="flex-1 rounded-xl overflow-hidden relative"
          style={{ border: "1px solid var(--border)", minHeight: 500 }}
        >
          {MapComponent ? (
            <MapComponent
              universities={universities}
              onSelect={setSelected}
              activeCountries={activeCountries}
              eligibilityMap={eligibilityMap}
              filterActive={filterActive || budgetInput !== ""}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--surface)" }}>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Harita yükleniyor...</p>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div
          className="w-80 flex-shrink-0 rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {selected ? (
            <div className="h-full flex flex-col">
              {/* Campus image */}
              <div className="relative h-44 flex-shrink-0 overflow-hidden">
                <img
                  src={campusImg}
                  alt={selected.university.name}
                  className="w-full h-full object-cover"
                  onError={() => setCampusImg(FALLBACK_IMG)}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,15,30,0.85) 0%, transparent 60%)" }}
                />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <X className="w-3.5 h-3.5" style={{ color: "var(--white)" }} />
                </button>

                {selectedEligibility && (
                  <div
                    className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: STATUS_CONFIG[selectedEligibility.status].bg,
                      color: STATUS_CONFIG[selectedEligibility.status].color,
                    }}
                  >
                    {STATUS_CONFIG[selectedEligibility.status].label}
                  </div>
                )}

                <div className="absolute bottom-3 left-4">
                  <div className="text-base font-bold" style={{ color: "var(--white)" }}>
                    {selected.university.name}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {selected.university.city}, {selected.university.country}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                {selectedAcceptance && (
                  <div
                    className="px-3 py-2.5 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Kabul Oranı</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                        %{selectedAcceptance.acceptanceRate}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        ({selectedAcceptance.totalApplicants.toLocaleString()} başvuru)
                      </span>
                    </div>
                  </div>
                )}

                <div className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--surface2)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Program</span>
                  </div>
                  <div className="text-sm" style={{ color: "var(--text)" }}>{selected.university.program}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{selected.university.department}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--surface2)" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Euro className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Yıllık Ücret</span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--text)" }}>
                      {selected.university.tuitionEUR === 0
                        ? "Ücretsiz"
                        : `€${selected.university.tuitionEUR.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: "var(--surface2)" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Süre</span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--text)" }}>
                      {selected.durationYears} yıl
                    </div>
                  </div>
                </div>

                <div className="px-3 py-2.5 rounded-lg space-y-1.5" style={{ backgroundColor: "var(--surface2)" }}>
                  <div className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Gereksinimler</div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Min. GPA</span>
                    <span style={{ color: "var(--text)" }}>{selected.university.requiredGPA}/100</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Dil</span>
                    <span style={{ color: "var(--text)" }}>
                      {selected.university.requiredLanguage} {selected.university.requiredLanguageScore}
                    </span>
                  </div>
                  {selected.university.deadline && (
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "var(--muted)" }}>Deadline</span>
                      <span style={{ color: "var(--gold)" }}>{selected.university.deadline}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Web Sitesi
                  </a>
                  <Link
                    href="/schools"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: "var(--surface2)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Detayları Gör
                  </Link>
                </div>

                <div
                  className="px-3 py-3 rounded-lg"
                  style={{ backgroundColor: "var(--surface2)", border: "1px dashed var(--border)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--muted)", opacity: 0.5 }} />
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Öğrenci Görüşleri</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full ml-auto"
                      style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)", fontSize: 10 }}
                    >
                      Yakında
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.6 }}>
                    Bu üniversiteye giden Türk öğrencilerin deneyimleri eklenecek.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: "var(--surface2)" }}
              >
                <GraduationCap className="w-6 h-6" style={{ color: "var(--muted)", opacity: 0.5 }} />
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Haritadaki bir üniversiteye tıklayın
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
                Kampüs, ücret ve gereksinimler görünecek
              </p>
              {filterActive && (
                <div
                  className="mt-4 px-3 py-2 rounded-lg text-xs"
                  style={{ backgroundColor: "var(--blue-bg)", color: "var(--blue)" }}
                >
                  Filtre aktif — pinler uygunluğa göre renklendirildi
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

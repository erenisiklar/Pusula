"use client";

import { useState, useEffect } from "react";
import type { University } from "@/types";
import { universityMapData } from "@/lib/university-map-data";
import { ExternalLink, X, Clock, Euro, GraduationCap } from "lucide-react";

interface SelectedUni {
  university: University;
  imageUrl: string;
  website: string;
  durationYears: number;
  countryColor: string;
}

export default function MapClient({ universities }: { universities: University[] }) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    universities: University[];
    onSelect: (uni: SelectedUni | null) => void;
  }> | null>(null);
  const [selected, setSelected] = useState<SelectedUni | null>(null);

  useEffect(() => {
    // Leaflet sadece client'ta çalışır
    import("./LeafletMap").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  const enriched = universities.map((uni) => {
    const mapData = universityMapData.find((d) => d.id === uni.id);
    return { university: uni, ...mapData };
  });

  return (
    <div className="h-full flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Üniversite Haritası
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Pinlere tıklayarak üniversite detaylarını görün
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
          {[
            { color: "#3b82f6", label: "Almanya" },
            { color: "#f97316", label: "Hollanda" },
            { color: "#22c55e", label: "İtalya" },
            { color: "#a855f7", label: "Fransa" },
            { color: "#ef4444", label: "İspanya" },
            { color: "#f59e0b", label: "İsveç" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
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
              onSelect={(uni) => setSelected(uni)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "var(--surface)" }}
            >
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
                  src={selected.imageUrl}
                  alt={selected.university.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1562774053-701939374585?w=640&q=80";
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(10,15,30,0.8) 0%, transparent 60%)",
                  }}
                />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <X className="w-3.5 h-3.5" style={{ color: "var(--white)" }} />
                </button>
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
                {/* Program */}
                <div
                  className="px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Program</span>
                  </div>
                  <div className="text-sm" style={{ color: "var(--text)" }}>
                    {selected.university.program}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {selected.university.department}
                  </div>
                </div>

                {/* Tuition + Duration */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
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
                  <div
                    className="px-3 py-2.5 rounded-lg"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
                      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Süre</span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--text)" }}>
                      {selected.durationYears} yıl
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div
                  className="px-3 py-2.5 rounded-lg space-y-1.5"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <div className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
                    Gereksinimler
                  </div>
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

                {/* Website button */}
                <a
                  href={selected.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Resmi Web Sitesi
                </a>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { universities } from "@/lib/universities";
import type { University } from "@/types";
import { Search, Filter, MapPin } from "lucide-react";

const MapView = dynamic(() => import("./map-view"), { ssr: false });

// City coordinates (lat, lng)
const cityCoords: Record<string, [number, number]> = {
  "Londra": [51.5074, -0.1278], "Oxford": [51.752, -1.2577], "Cambridge": [52.2053, 0.1218],
  "Edinburgh": [55.9533, -3.1883], "Manchester": [53.4808, -2.2426], "Bath": [51.3811, -2.3590],
  "Lancaster": [54.0466, -2.8007], "Coventry": [52.4068, -1.5197], "Durham": [54.7753, -1.5849],
  "Nottingham": [52.9548, -1.1581], "St Andrews": [56.3398, -2.7967], "Cranfield": [52.0733, -0.6285],
  "Reading": [51.4543, -0.9781], "Berlin": [52.52, 13.405], "Münih": [48.1351, 11.582],
  "Aachen": [50.7753, 6.0839], "Mannheim": [49.4875, 8.466], "Frankfurt": [50.1109, 8.6821],
  "Köln": [50.9375, 6.9603], "Göttingen": [51.5328, 9.9352], "Stuttgart": [48.7758, 9.1829],
  "Heidelberg": [49.3988, 8.6724], "Vallendar": [50.3967, 7.6167],
  "Amsterdam": [52.3676, 4.9041], "Rotterdam": [51.9244, 4.4777], "Delft": [52.0116, 4.3571],
  "Groningen": [53.2194, 6.5665], "Maastricht": [50.8514, 5.6910], "Tilburg": [51.5555, 5.0913],
  "Leiden": [52.1601, 4.4970], "Eindhoven": [51.4416, 5.4697], "Enschede": [52.2215, 6.8937],
  "Den Haag": [52.0705, 4.3007], "Breukelen": [52.1714, 5.0011], "Wageningen": [51.9692, 5.6654],
  "Utrecht": [52.0907, 5.1214],
  "Paris": [48.8566, 2.3522], "Fontainebleau": [48.4010, 2.7028], "Lyon": [45.764, 4.8357],
  "Toulouse": [43.6047, 1.4442], "Grenoble": [45.1885, 5.7245], "Lille": [50.6292, 3.0573],
  "Nantes": [47.2184, -1.5536], "Nice": [43.7102, 7.262], "Marsilya": [43.2965, 5.3698],
  "Montpellier": [43.6108, 3.8767], "Reims": [49.2583, 3.5186], "Nancy": [48.6921, 6.1844],
  "Angers": [47.4784, -0.5632], "Le Havre": [49.4944, 0.1079],
  "Milano": [45.4642, 9.1900], "Torino": [45.0703, 7.6869], "Bologna": [44.4949, 11.3426],
  "Madrid": [40.4168, -3.7038], "Barcelona": [41.3874, 2.1686], "Pamplona": [42.8125, -1.6458],
  "Zürih": [47.3769, 8.5417], "Lozan": [46.5197, 6.6323], "St. Gallen": [47.4245, 9.3767],
  "Cenevre": [46.2044, 6.1432], "Bern": [46.9480, 7.4474], "Basel": [47.5596, 7.5886],
  "Luzern": [47.0502, 8.3093], "Fribourg": [46.8065, 7.1620], "Winterthur": [47.4984, 8.7246],
  "Stockholm": [59.3293, 18.0686], "Lund": [55.7047, 13.1910], "Uppsala": [59.8586, 17.6389],
  "Göteborg": [57.7089, 11.9746], "Linköping": [58.4108, 15.6214],
  "Kopenhag": [55.6761, 12.5683], "Aarhus": [56.1629, 10.2039], "Aalborg": [57.0488, 9.9217],
  "Oslo": [59.9139, 10.7522], "Bergen": [60.3913, 5.3221],
  "Helsinki": [60.1699, 24.9384], "Turku": [60.4518, 22.2666], "Vaasa": [63.0951, 21.6165],
  "Brüksel": [50.8503, 4.3517], "Leuven": [50.8798, 4.7005], "Antwerp": [51.2194, 4.4025],
  "Gent": [51.0543, 3.7174],
  "Viyana": [48.2082, 16.3738], "Lizbon": [38.7223, -9.1393], "Porto": [41.1579, -8.6291],
  "Dublin": [53.3498, -6.2603], "Varşova": [52.2297, 21.0122], "Prag": [50.0755, 14.4378],
  "Budapeşte": [47.4979, 19.0402],
};

const countries = [
  "Tümü", "Almanya", "Hollanda", "İtalya", "Fransa", "İspanya", "İsveç",
  "İngiltere", "İsviçre", "Belçika", "Avusturya", "Danimarka", "Norveç",
  "Finlandiya", "Portekiz", "İrlanda", "Polonya", "Çekya", "Macaristan",
];

const departments = [
  "Tümü", "İşletme", "Bilgisayar Mühendisliği", "Mühendislik", "Ekonomi",
  "Mimarlık", "Tıp", "Hukuk", "Siyaset Bilimi", "Uluslararası İlişkiler",
];

export interface MapUniversity {
  university: University;
  lat: number;
  lng: number;
}

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState("Tümü");
  const [selectedDept, setSelectedDept] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUni, setSelectedUni] = useState<string | null>(null);

  const mapUnis = useMemo((): MapUniversity[] => {
    return universities
      .filter((u) => {
        if (selectedCountry !== "Tümü" && u.country !== selectedCountry) return false;
        if (selectedDept !== "Tümü" && u.department !== selectedDept) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!u.name.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q) && !u.program.toLowerCase().includes(q))
            return false;
        }
        return true;
      })
      .map((u) => {
        const coords = cityCoords[u.city];
        if (!coords) return null;
        return { university: u, lat: coords[0], lng: coords[1] };
      })
      .filter(Boolean) as MapUniversity[];
  }, [selectedCountry, selectedDept, searchQuery]);

  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of mapUnis) {
      counts[m.university.country] = (counts[m.university.country] || 0) + 1;
    }
    return counts;
  }, [mapUnis]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
        Üniversite Haritası
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        {mapUnis.length} üniversite · {Object.keys(countryCounts).length} ülke
      </p>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Üniversite, şehir veya program ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Map */}
      <div
        className="rounded-xl overflow-hidden mb-4"
        style={{ border: "1px solid var(--border)", height: "500px" }}
      >
        <MapView universities={mapUnis} selectedId={selectedUni} onSelect={setSelectedUni} />
      </div>

      {/* University list below map */}
      <div className="grid grid-cols-2 gap-3">
        {mapUnis.map((m) => {
          const u = m.university;
          const isSelected = selectedUni === u.id;
          return (
            <div
              key={u.id}
              className="rounded-lg px-4 py-3 cursor-pointer transition-all"
              style={{
                backgroundColor: isSelected ? "var(--blue-bg)" : "var(--surface)",
                border: isSelected ? "1px solid var(--blue-border)" : "1px solid var(--border)",
              }}
              onClick={() => setSelectedUni(isSelected ? null : u.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{u.flag}</span>
                <span className="font-medium text-sm truncate" style={{ color: "var(--text)" }}>
                  {u.name}
                </span>
                {u.rankings && u.rankings.length > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0"
                    style={{ backgroundColor: "var(--gold-bg)", border: "1px solid var(--gold-border)", color: "var(--gold-light)" }}
                  >
                    #{Math.min(...u.rankings.map((r) => r.rank))}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{u.program} · {u.city}, {u.country}</span>
                <span className="ml-auto flex-shrink-0 font-medium" style={{ color: "var(--text)" }}>
                  {u.tuitionEUR === 0 ? "Ücretsiz" : `€${u.tuitionEUR.toLocaleString()}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { MapUniversity } from "./page";
import "leaflet/dist/leaflet.css";

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 8, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

export default function MapView({
  universities,
  selectedId,
  onSelect,
}: {
  universities: MapUniversity[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const selected = universities.find((u) => u.university.id === selectedId);

  return (
    <MapContainer
      center={[50, 10]}
      zoom={4}
      style={{ height: "100%", width: "100%", background: "#0a0f1e" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
      {universities.map((m) => {
        const u = m.university;
        const isSelected = u.id === selectedId;
        const hasRanking = u.rankings && u.rankings.length > 0;
        const bestRank = hasRanking
          ? Math.min(...u.rankings!.map((r) => r.rank))
          : 999;

        let color = "#3b82f6"; // blue default
        let radius = 6;
        if (bestRank <= 10) {
          color = "#f59e0b"; // gold
          radius = 10;
        } else if (bestRank <= 50) {
          color = "#60a5fa"; // blue-light
          radius = 8;
        } else if (bestRank <= 100) {
          color = "#3b82f6"; // blue
          radius = 7;
        }

        if (isSelected) {
          color = "#22c55e"; // success green
          radius = 12;
        }

        return (
          <CircleMarker
            key={u.id}
            center={[m.lat, m.lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: isSelected ? 0.9 : 0.7,
              color: isSelected ? "#ffffff" : color,
              weight: isSelected ? 2 : 1,
            }}
            eventHandlers={{
              click: () => onSelect(isSelected ? null : u.id),
            }}
          >
            <Popup>
              <div style={{ minWidth: 180, fontFamily: "inherit" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {u.flag} {u.name}
                </div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
                  {u.program}
                </div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
                  📍 {u.city}, {u.country}
                </div>
                {hasRanking && (
                  <div style={{ fontSize: 11, color: "#b45309", fontWeight: 600 }}>
                    🏆 {u.rankings!.map((r) => `${r.source} #${r.rank}`).join(" · ")}
                  </div>
                )}
                <div style={{ fontSize: 11, marginTop: 4, color: "#333" }}>
                  💰 {u.tuitionEUR === 0 ? "Ücretsiz" : `€${u.tuitionEUR.toLocaleString()}/yıl`}
                </div>
                <div style={{ fontSize: 11, color: "#333" }}>
                  📊 GPA: {u.requiredGPA}/100 · {u.requiredLanguage} {u.requiredLanguageScore}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

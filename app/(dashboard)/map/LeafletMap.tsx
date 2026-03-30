"use client";

import { useEffect, useRef, useState } from "react";
import type { University } from "@/types";
import type { EligibilityInfo } from "./client";
import { universityMapData } from "@/lib/university-map-data";

interface SelectedUni {
  university: University;
  imageUrl: string;
  website: string;
  durationYears: number;
  countryColor: string;
}

interface Props {
  universities: University[];
  onSelect: (uni: SelectedUni | null) => void;
  activeCountries: Set<string>;
  eligibilityMap: Map<string, EligibilityInfo>;
  filterActive: boolean;
}

const DARK_TILE = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  options: {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  },
};

const SATELLITE_TILE = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  options: {
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
};

export default function LeafletMap({ universities, onSelect, activeCountries, eligibilityMap, filterActive }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef   = useRef<any>(null);
  const tileRef      = useRef<import("leaflet").TileLayer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedRef  = useRef<{ id: string; marker: any; normalIcon: import("leaflet").DivIcon } | null>(null);
  const onSelectRef  = useRef(onSelect);
  const [mapReady, setMapReady]     = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);

  // Always keep onSelectRef current
  onSelectRef.current = onSelect;

  // ── Init map once ──────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");

      // Fix broken default icons from webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [50.0, 10.0],
        zoom: 4,
        zoomControl: false,
      });
      mapRef.current = map;

      L.control.zoom({ position: "topright" }).addTo(map);

      const tile = L.tileLayer(DARK_TILE.url, DARK_TILE.options).addTo(map);
      tileRef.current = tile;

      // Dark-themed cluster group
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cluster = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 45,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        iconCreateFunction: (c: any) => {
          const count = c.getChildCount();
          return L.divIcon({
            html: `<div style="
              width:36px;height:36px;border-radius:50%;
              background:rgba(17,24,39,0.95);
              border:2px solid rgba(255,255,255,0.2);
              display:flex;align-items:center;justify-content:center;
              font-size:13px;font-weight:700;color:#f0f4ff;
              box-shadow:0 2px 8px rgba(0,0,0,0.5);
            ">${count}</div>`,
            iconSize: [36, 36] as [number, number],
            iconAnchor: [18, 18] as [number, number],
            className: "",
          });
        },
      });
      clusterRef.current = cluster;
      map.addLayer(cluster);

      setMapReady(true);
    })();

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // ── Rebuild markers whenever filters / countries change ────────
  useEffect(() => {
    if (!mapReady || !clusterRef.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      clusterRef.current.clearLayers();
      selectedRef.current = null;

      universities.forEach((uni) => {
        const mapData = universityMapData.find((d) => d.id === uni.id);
        if (!mapData) return;
        if (!activeCountries.has(uni.country)) return;

        const color = mapData.countryColor;
        const eligibility = eligibilityMap.get(uni.id);

        // Opacity + ring based on eligibility
        let opacity = 1;
        let ringColor = "rgba(255,255,255,0.85)";

        if (filterActive && eligibility) {
          switch (eligibility.status) {
            case "eligible": ringColor = "#22c55e"; break;
            case "possible": ringColor = "#3b82f6"; break;
            case "reach":    opacity = 0.5;         break;
            case "unlikely": opacity = 0.2;         break;
          }
        }

        const makeIcon = (selected: boolean) => L.divIcon({
          className: "",
          html: `<div style="
            width:${selected ? 36 : 26}px;
            height:${selected ? 36 : 26}px;
            border-radius:50%;
            background-color:${color};
            border:${selected ? "3px solid #fff" : `2.5px solid ${ringColor}`};
            box-shadow:${selected
              ? "0 0 0 4px rgba(255,255,255,0.25), 0 4px 14px rgba(0,0,0,0.6)"
              : "0 2px 8px rgba(0,0,0,0.5)"};
            opacity:${opacity};
            cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            transition:transform 0.15s;
          "><div style="
            width:${selected ? 10 : 8}px;
            height:${selected ? 10 : 8}px;
            border-radius:50%;
            background:rgba(255,255,255,0.6);
          "></div></div>`,
          iconSize:   [selected ? 36 : 26, selected ? 36 : 26] as [number, number],
          iconAnchor: [selected ? 18 : 13, selected ? 18 : 13] as [number, number],
        });

        const normalIcon = makeIcon(false);
        const marker = L.marker([mapData.lat, mapData.lng], { icon: normalIcon });

        marker.bindTooltip(
          `<div style="font-size:12px;font-weight:600;color:#f0f4ff;background:#111827;border:1px solid rgba(255,255,255,0.1);padding:4px 8px;border-radius:6px;white-space:nowrap;">${uni.name}</div>`,
          { direction: "top", offset: [0, -8] as [number, number], className: "", permanent: false, opacity: 1 }
        );

        marker.on("click", () => {
          // Restore previous selection
          if (selectedRef.current && selectedRef.current.id !== uni.id) {
            selectedRef.current.marker.setIcon(selectedRef.current.normalIcon);
          }
          // Animate selected pin
          marker.setIcon(makeIcon(true));
          selectedRef.current = { id: uni.id, marker, normalIcon };

          onSelectRef.current({
            university: uni,
            imageUrl: mapData.imageUrl,
            website: mapData.website,
            durationYears: mapData.durationYears,
            countryColor: mapData.countryColor,
          });
        });

        clusterRef.current.addLayer(marker);
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, universities, activeCountries, eligibilityMap, filterActive]);

  // ── Switch tile layer ──────────────────────────────────────────
  useEffect(() => {
    const map  = mapRef.current;
    const tile = tileRef.current;
    if (!map || !tile) return;

    import("leaflet").then(({ default: L }) => {
      tile.remove();
      const layer = isSatellite ? SATELLITE_TILE : DARK_TILE;
      const newTile = L.tileLayer(layer.url, layer.options).addTo(map);
      tileRef.current = newTile;
    });
  }, [isSatellite]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 500 }}>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", minHeight: 500, backgroundColor: "#0a0f1e" }}
      />

      {/* Satellite / map toggle */}
      <button
        onClick={() => setIsSatellite((v) => !v)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          padding: "6px 12px",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.15)",
          backgroundColor: isSatellite ? "rgba(59,130,246,0.9)" : "rgba(17,24,39,0.9)",
          color: "#f0f4ff",
          backdropFilter: "blur(4px)",
          transition: "background-color 0.2s",
        }}
      >
        {isSatellite ? "🗺 Harita" : "🛰 Uydu"}
      </button>
    </div>
  );
}

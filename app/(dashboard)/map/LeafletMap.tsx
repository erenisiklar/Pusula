"use client";

import { useEffect, useRef, useState } from "react";
import type { University } from "@/types";
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
}

const TILE_LAYERS = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    label: "Harita",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
    subdomains: undefined,
    label: "Uydu",
  },
};

export default function LeafletMap({ universities, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const tileLayerRef = useRef<import("leaflet").TileLayer | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L: typeof import("leaflet");

    (async () => {
      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [50.0, 10.0],
        zoom: 4,
        zoomControl: false,
        attributionControl: true,
      });

      mapRef.current = map;

      // Zoom control — top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Initial tile layer (dark)
      const tile = L.tileLayer(TILE_LAYERS.dark.url, {
        attribution: TILE_LAYERS.dark.attribution,
        subdomains: TILE_LAYERS.dark.subdomains,
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = tile;

      // Add markers
      universities.forEach((uni) => {
        const mapData = universityMapData.find((d) => d.id === uni.id);
        if (!mapData) return;

        const color = mapData.countryColor;

        const svgIcon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background-color: ${color};
              border: 2.5px solid rgba(255,255,255,0.85);
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
              "></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([mapData.lat, mapData.lng], { icon: svgIcon }).addTo(map);

        marker.bindTooltip(
          `<div style="
            font-size: 12px;
            font-weight: 600;
            color: #f0f4ff;
            background: #111827;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 4px 8px;
            border-radius: 6px;
            white-space: nowrap;
          ">${uni.name}</div>`,
          {
            direction: "top",
            offset: [0, -8],
            className: "leaflet-tooltip-custom",
            permanent: false,
            opacity: 1,
          }
        );

        marker.on("click", () => {
          onSelect({
            university: uni,
            imageUrl: mapData.imageUrl,
            website: mapData.website,
            durationYears: mapData.durationYears,
            countryColor: mapData.countryColor,
          });
        });
      });
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch tile layer when isSatellite changes
  useEffect(() => {
    const map = mapRef.current;
    const currentTile = tileLayerRef.current;
    if (!map || !currentTile) return;

    import("leaflet").then(({ default: L }) => {
      currentTile.remove();
      const layer = isSatellite ? TILE_LAYERS.satellite : TILE_LAYERS.dark;
      const newTile = L.tileLayer(layer.url, {
        attribution: layer.attribution,
        ...(layer.subdomains ? { subdomains: layer.subdomains } : {}),
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = newTile;
    });
  }, [isSatellite]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 500 }}>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", minHeight: 500, backgroundColor: "#0a0f1e" }}
      />

      {/* Satellite toggle button */}
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
          border: "1px solid rgba(255,255,255,0.2)",
          backgroundColor: isSatellite ? "rgba(59,130,246,0.9)" : "rgba(17,24,39,0.9)",
          color: "#f0f4ff",
          backdropFilter: "blur(4px)",
          transition: "background-color 0.2s",
        }}
      >
        {isSatellite ? "Harita" : "Uydu"}
      </button>
    </div>
  );
}

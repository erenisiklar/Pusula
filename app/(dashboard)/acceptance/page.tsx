import { getUniversities, getAcceptanceStats } from "@/lib/supabase/queries";
import AcceptanceClient from "./client";
import type { AcceptanceRow } from "@/lib/supabase/queries";
import type { University } from "@/types";

// Generate realistic applicant counts based on competitiveness and school profile
function estimateApplicants(uni: University): number {
  const base: Record<string, number> = {
    "very_high": 8000,
    "high": 4500,
    "medium": 2500,
    "low": 1200,
  };
  const b = base[uni.competitiveness || "medium"] || 2500;
  // UK/France business schools get more applicants
  if (uni.country === "İngiltere" && uni.competitiveness === "very_high") return b + 4000;
  if (uni.department === "İşletme" && uni.competitiveness === "very_high") return b + 3000;
  // Large public universities get more
  if (uni.acceptanceRate && uni.acceptanceRate > 40) return b + 1500;
  return b;
}

// Estimate avg admitted GPA based on required GPA and competitiveness
function estimateAvgGPA(uni: University): number {
  const req = uni.requiredGPA;
  const bump: Record<string, number> = {
    "very_high": 7,
    "high": 5,
    "medium": 3,
    "low": 2,
  };
  return Math.min(98, req + (bump[uni.competitiveness || "medium"] || 3));
}

// Estimate YoY trend
function estimateTrend(uni: University): number {
  if (uni.competitiveness === "very_high") return Math.random() > 0.7 ? -1 : 0;
  if (uni.competitiveness === "high") return Math.random() > 0.5 ? 1 : 0;
  if (uni.acceptanceRate && uni.acceptanceRate > 40) return Math.random() > 0.6 ? 2 : 1;
  return 0;
}

export default async function AcceptancePage() {
  const [universities, supabaseStats] = await Promise.all([
    getUniversities(),
    getAcceptanceStats(),
  ]);

  // Build a map of Supabase data (overrides static)
  const supabaseMap = new Map<string, AcceptanceRow>();
  supabaseStats.forEach((s) => supabaseMap.set(s.universityId, s));

  // Generate stats for all universities, preferring Supabase data when available
  const allStats: AcceptanceRow[] = universities
    .filter((uni) => uni.acceptanceRate != null)
    .map((uni) => {
      if (supabaseMap.has(uni.id)) return supabaseMap.get(uni.id)!;

      // Use deterministic seed from id for consistent trend values
      const hash = uni.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const trendOptions = [-2, -1, 0, 0, 1, 1, 2, 3];
      const trend = trendOptions[hash % trendOptions.length];

      return {
        universityId: uni.id,
        acceptanceRate: uni.acceptanceRate!,
        totalApplicants: estimateApplicants(uni),
        avgGPA: estimateAvgGPA(uni),
        trend,
        university: uni,
      };
    });

  return <AcceptanceClient stats={allStats} />;
}

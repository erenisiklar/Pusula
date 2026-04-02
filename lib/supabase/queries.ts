import { createClient } from "./server";
import type { University } from "@/types";

// DB snake_case → TypeScript camelCase
function mapUniversity(row: Record<string, unknown>): University {
  return {
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
    tuitionEUR: row.tuition_eur as number,
    flag: row.flag as string,
    deadline: row.deadline as string | undefined,
    lat: row.lat as number | undefined,
    lng: row.lng as number | undefined,
    imageUrl: row.image_url as string | undefined,
    durationYears: row.duration_years as number | undefined,
    countryColor: row.country_color as string | undefined,
    website: row.website as string | undefined,
  };
}

export async function getUniversities(): Promise<University[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .order("name");
  if (error || !data) return [];
  return data.map(mapUniversity);
}

export interface AcceptanceRow {
  universityId: string;
  acceptanceRate: number;
  totalApplicants: number;
  avgGPA: number;
  trend: number;
  university: University;
}

export async function getAcceptanceStats(): Promise<AcceptanceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("acceptance_stats")
    .select("*, universities(*)");
  if (error || !data) return [];
  return data.map((row: Record<string, unknown>) => {
    const uni = row.universities as Record<string, unknown>;
    return {
      universityId: row.university_id as string,
      acceptanceRate: row.acceptance_rate as number,
      totalApplicants: row.total_applicants as number,
      avgGPA: ((row.avg_gpa as number) <= 4 ? Math.round((row.avg_gpa as number) * 25) : (row.avg_gpa as number)),
      trend: row.trend as number,
      university: mapUniversity(uni),
    };
  });
}

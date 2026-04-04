// Hardcoded universities.ts → Supabase seed SQL (tüm alanlar dahil)
// Çalıştır: npx tsx scripts/gen-seed.ts > supabase/seed-from-hardcoded.sql

import { universities } from "../lib/universities";

function esc(s: string | undefined | null): string {
  if (s == null) return "NULL";
  return `'${s.replace(/'/g, "''")}'`;
}

function jsonb(obj: unknown): string {
  if (obj == null) return "NULL";
  const arr = Array.isArray(obj) ? obj : [obj];
  if (arr.length === 0) return "NULL";
  return `'${JSON.stringify(arr).replace(/'/g, "''")}'::jsonb`;
}

function num(n: number | undefined | null): string {
  if (n == null) return "NULL";
  return String(n);
}

function bool(b: boolean | undefined | null): string {
  if (b == null) return "NULL";
  return b ? "true" : "false";
}

console.log("-- Auto-generated from lib/universities.ts");
console.log(`-- ${universities.length} bachelor programs`);
console.log(`-- Generated: ${new Date().toISOString()}\n`);
console.log("DELETE FROM universities WHERE level = 'bachelor';\n");
console.log(`INSERT INTO universities
  (id, name, country, country_code, city, program, department, level,
   required_gpa, required_language, required_language_score, accepted_languages,
   tuition_eur, flag, deadline, rankings, acceptance_rate, competitiveness,
   data_verified, program_restricted, lat, lng, image_url, duration_years,
   country_color, website)
VALUES`);

const rows = universities.map((u) =>
  `  (${esc(u.id)}, ${esc(u.name)}, ${esc(u.country)}, ${esc(u.countryCode)},
   ${esc(u.city)}, ${esc(u.program)}, ${esc(u.department)}, ${esc(u.level)},
   ${num(u.requiredGPA)}, ${esc(u.requiredLanguage)}, ${esc(u.requiredLanguageScore)}, ${jsonb(u.acceptedLanguages)},
   ${num(u.tuitionEUR)}, ${esc(u.flag)}, ${esc(u.deadline ?? null)}, ${jsonb(u.rankings)}, ${num(u.acceptanceRate)}, ${esc(u.competitiveness)},
   ${bool(u.dataVerified)}, ${bool(u.programRestricted)}, ${num(u.lat)}, ${num(u.lng)}, ${esc(u.imageUrl)}, ${num(u.durationYears)},
   ${esc(u.countryColor)}, ${esc(u.website)})`
);

console.log(rows.join(",\n"));
console.log("ON CONFLICT (id) DO UPDATE SET");
console.log("  name = EXCLUDED.name,");
console.log("  country = EXCLUDED.country,");
console.log("  country_code = EXCLUDED.country_code,");
console.log("  city = EXCLUDED.city,");
console.log("  program = EXCLUDED.program,");
console.log("  department = EXCLUDED.department,");
console.log("  level = EXCLUDED.level,");
console.log("  required_gpa = EXCLUDED.required_gpa,");
console.log("  required_language = EXCLUDED.required_language,");
console.log("  required_language_score = EXCLUDED.required_language_score,");
console.log("  accepted_languages = EXCLUDED.accepted_languages,");
console.log("  tuition_eur = EXCLUDED.tuition_eur,");
console.log("  flag = EXCLUDED.flag,");
console.log("  deadline = EXCLUDED.deadline,");
console.log("  rankings = EXCLUDED.rankings,");
console.log("  acceptance_rate = EXCLUDED.acceptance_rate,");
console.log("  competitiveness = EXCLUDED.competitiveness,");
console.log("  data_verified = EXCLUDED.data_verified,");
console.log("  program_restricted = EXCLUDED.program_restricted,");
console.log("  lat = EXCLUDED.lat,");
console.log("  lng = EXCLUDED.lng,");
console.log("  image_url = EXCLUDED.image_url,");
console.log("  duration_years = EXCLUDED.duration_years,");
console.log("  country_color = EXCLUDED.country_color,");
console.log("  website = EXCLUDED.website;");

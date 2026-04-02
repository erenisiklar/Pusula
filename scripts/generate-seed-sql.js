/**
 * Reads universities.ts and generates a comprehensive seed SQL file
 * Run: node scripts/generate-seed-sql.js
 */

const fs = require("fs");
const path = require("path");

// We'll eval the TS file as JS after stripping types
const tsContent = fs.readFileSync(
  path.join(__dirname, "../lib/universities.ts"),
  "utf8"
);

// Strip TypeScript: import, type annotations, "as const" etc.
let jsContent = tsContent
  .replace(/import type .+;/g, "")
  .replace(/import .+ from .+;/g, "")
  .replace(/export const universities: University\[\] =/g, "var universities =")
  .replace(/ as const/g, "");

// Evaluate to get the array
eval(jsContent);
if (!universities || !Array.isArray(universities)) {
  console.error("Failed to parse universities from TS file");
  process.exit(1);
}

// Also read update-map-data.sql to get lat/lng/image/website data
const mapSql = fs.readFileSync(
  path.join(__dirname, "../supabase/update-map-data.sql"),
  "utf8"
);

// Parse map data
const mapData = {};
const mapRegex = /\('([^']+)',\s*([\d.]+),\s*([\d.-]+),\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*'([^']*)'\)/g;
let match;
while ((match = mapRegex.exec(mapSql)) !== null) {
  mapData[match[1]] = {
    lat: parseFloat(match[2]),
    lng: parseFloat(match[3]),
    imageUrl: match[4],
    website: match[5],
    durationYears: parseInt(match[6]),
    countryColor: match[7],
  };
}

function esc(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "true" : "false";
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function jsonEsc(val) {
  if (!val || (Array.isArray(val) && val.length === 0)) return "'[]'::jsonb";
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
}

// Generate universities INSERT
let sql = `-- ============================================
-- Pusula — Seed Data (auto-generated)
-- ${universities.length} universities
-- Generated: ${new Date().toISOString().split("T")[0]}
-- ============================================

-- Clear existing data
TRUNCATE acceptance_stats CASCADE;
TRUNCATE universities CASCADE;

-- Insert universities
INSERT INTO universities (
  id, name, country, country_code, city, program, department, level,
  required_gpa, required_language, required_language_score, accepted_languages,
  tuition_eur, flag, deadline, rankings, acceptance_rate, competitiveness,
  data_verified, program_restricted,
  lat, lng, image_url, website, duration_years, country_color
) VALUES\n`;

const rows = universities.map((u) => {
  const map = mapData[u.id] || {};
  const level = u.level || "master";
  const lat = u.lat || map.lat || null;
  const lng = u.lng || map.lng || null;
  const imageUrl = u.imageUrl || map.imageUrl || null;
  const website = u.website || map.website || null;
  const durationYears = u.durationYears || map.durationYears || null;
  const countryColor = u.countryColor || map.countryColor || null;

  return `  (${esc(u.id)}, ${esc(u.name)}, ${esc(u.country)}, ${esc(u.countryCode)}, ${esc(u.city)}, ${esc(u.program)}, ${esc(u.department)}, ${esc(level)},
   ${u.requiredGPA}, ${esc(u.requiredLanguage)}, ${esc(u.requiredLanguageScore)}, ${jsonEsc(u.acceptedLanguages)},
   ${u.tuitionEUR}, ${esc(u.flag)}, ${esc(u.deadline)}, ${jsonEsc(u.rankings)}, ${u.acceptanceRate != null ? u.acceptanceRate : "NULL"}, ${esc(u.competitiveness || null)},
   ${u.dataVerified ? "true" : "false"}, ${u.programRestricted ? "true" : "false"},
   ${lat != null ? lat : "NULL"}, ${lng != null ? lng : "NULL"}, ${esc(imageUrl)}, ${esc(website)}, ${durationYears != null ? durationYears : "NULL"}, ${esc(countryColor)})`;
});

sql += rows.join(",\n") + "\nON CONFLICT (id) DO UPDATE SET\n";
sql += `  name = EXCLUDED.name,
  country = EXCLUDED.country,
  country_code = EXCLUDED.country_code,
  city = EXCLUDED.city,
  program = EXCLUDED.program,
  department = EXCLUDED.department,
  level = EXCLUDED.level,
  required_gpa = EXCLUDED.required_gpa,
  required_language = EXCLUDED.required_language,
  required_language_score = EXCLUDED.required_language_score,
  accepted_languages = EXCLUDED.accepted_languages,
  tuition_eur = EXCLUDED.tuition_eur,
  flag = EXCLUDED.flag,
  deadline = EXCLUDED.deadline,
  rankings = EXCLUDED.rankings,
  acceptance_rate = EXCLUDED.acceptance_rate,
  competitiveness = EXCLUDED.competitiveness,
  data_verified = EXCLUDED.data_verified,
  program_restricted = EXCLUDED.program_restricted,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  image_url = EXCLUDED.image_url,
  website = EXCLUDED.website,
  duration_years = EXCLUDED.duration_years,
  country_color = EXCLUDED.country_color;\n\n`;

// Generate acceptance_stats INSERT
// Use data from universities that have acceptanceRate
const statsUniversities = universities.filter((u) => u.acceptanceRate != null);

sql += `-- Insert acceptance stats (${statsUniversities.length} entries)\n`;
sql += `INSERT INTO acceptance_stats (university_id, acceptance_rate, total_applicants, avg_gpa, trend) VALUES\n`;

const statsRows = statsUniversities.map((u) => {
  const rate = u.acceptanceRate;
  // Estimate applicants based on competitiveness
  let applicants;
  if (u.competitiveness === "very_high") applicants = 5000 + Math.floor(Math.random() * 8000);
  else if (u.competitiveness === "high") applicants = 2500 + Math.floor(Math.random() * 4000);
  else if (u.competitiveness === "medium") applicants = 1500 + Math.floor(Math.random() * 2500);
  else applicants = 800 + Math.floor(Math.random() * 2000);

  // Estimate avg GPA (4.0 scale)
  const gpa4 = (u.requiredGPA / 100 * 4).toFixed(1);
  // Trend: slight random
  const trend = Math.floor(Math.random() * 7) - 3;

  return `  (${esc(u.id)}, ${rate}, ${applicants}, ${gpa4}, ${trend})`;
});

sql += statsRows.join(",\n") + "\nON CONFLICT (university_id) DO UPDATE SET\n";
sql += `  acceptance_rate = EXCLUDED.acceptance_rate,
  total_applicants = EXCLUDED.total_applicants,
  avg_gpa = EXCLUDED.avg_gpa,
  trend = EXCLUDED.trend;\n`;

fs.writeFileSync(
  path.join(__dirname, "../supabase/seed-all.sql"),
  sql,
  "utf8"
);

console.log(`Generated seed SQL with ${universities.length} universities and ${statsRows.length} acceptance stats`);
console.log(`Bachelor: ${universities.filter(u => u.level === "bachelor").length}`);
console.log(`Master (or default): ${universities.filter(u => !u.level || u.level === "master").length}`);

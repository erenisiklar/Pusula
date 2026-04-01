// Bu script lib/universities.ts'deki veriyi SQL'e çevirir
// Çalıştır: npx ts-node scripts/gen-sql.ts > supabase/seed-all.sql

import { universities } from "../lib/universities";

// Zaten Supabase'de olan 15 üniversite
const existing = new Set([
  "tu-delft-cs","tu-delft-arch","groningen-business",
  "polimi-cs","polimi-arch","bocconi-economics","bologna-eng",
  "tum-cs","tum-ee","lmu-business","rwth-aachen",
  "sciences-po","essec","ie-university","kth-stockholm",
]);

function esc(s: string | undefined | null): string {
  if (!s) return "NULL";
  return `'${s.replace(/'/g, "''")}'`;
}

const rows = universities
  .filter(u => !existing.has(u.id))
  .map(u =>
    `  (${esc(u.id)}, ${esc(u.name)}, ${esc(u.country)}, ${esc(u.countryCode)}, ${esc(u.city)}, ${esc(u.program)}, ${esc(u.department)}, ${u.requiredGPA}, ${esc(u.requiredLanguage)}, ${esc(u.requiredLanguageScore)}, ${u.tuitionEUR}, ${esc(u.flag)}, ${esc(u.deadline ?? null)})`
  );

console.log("insert into universities");
console.log("  (id, name, country, country_code, city, program, department, required_gpa, required_language, required_language_score, tuition_eur, flag, deadline)");
console.log("values");
console.log(rows.join(",\n"));
console.log("on conflict (id) do nothing;");

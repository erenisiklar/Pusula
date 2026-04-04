import type { University, StudentInput, EligibilityResult, EligibilityStatus } from "@/types";
import { countryModifiers } from "./country-modifiers";

// ── Sabitler ──
const BASE_SCORE = 38;

// GPA puan sınırları
const GPA_MAX = 30;
const GPA_MIN = -25;

// Dil puan sınırları
const LANG_MATCHED = 25;
const LANG_CLOSE = -10;
const LANG_FAILED = -30;
const LANG_MISSING = -40;

// Bütçe puan sınırları
const BUDGET_MAX = 10;
const BUDGET_MIN = -20;

// Eligibility eşikleri
const THRESHOLD_ELIGIBLE = 80;
const THRESHOLD_POSSIBLE = 55;
const THRESHOLD_REACH = 30;

/** parseFloat sarmalayıcı — NaN durumunda null döner */
function safeParseScore(value: string | undefined | null): number | null {
  if (value == null) return null;
  // Avrupa formatı: "8,5" → "8.5"
  const normalized = value.replace(",", ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

/** Dil sertifikası normalizasyonu — büyük/küçük harf ve varyant farkını giderir */
function normalizeCertName(cert: string): string {
  const c = cert.toLowerCase().trim();
  if (c === "ielts" || c === "ielts academic" || c === "ielts general") return "ielts";
  if (c === "toefl" || c === "toefl ibt" || c === "toefl-ibt" || c === "toefl itp") return "toefl";
  if (c === "testdaf" || c === "test daf") return "testdaf";
  if (c.startsWith("delf") || c.startsWith("dalf") || c === "delf/dalf") return "delf";
  if (c === "dele") return "dele";
  if (c.startsWith("cambridge") || c === "cae" || c === "fce" || c === "cpe") return "cambridge";
  if (c.startsWith("celi") || c.startsWith("cils") || c === "celi/cils") return "celi";
  if (c === "goethe" || c.startsWith("goethe-")) return "goethe";
  return c;
}

export function calculateEligibility(
  student: StudentInput,
  university: University
): EligibilityResult {
  // ── Input clamping ──
  const gpa = Math.max(0, Math.min(100, student.gpa || 0));
  const budgetEUR = Math.max(0, student.budgetEUR || 0);
  const langScore = student.languageScore != null ? Math.max(0, student.languageScore) : null;

  let gpaScore = 0;
  let gpaDetail = "";
  let languageScore = 0;
  let languageDetail = "";
  let budgetScore = 0;
  let budgetDetail = "";
  let rankingScore = 0;
  let rankingDetail = "";
  let acceptanceScore = 0;
  let acceptanceDetail = "";
  let countryScore = 0;
  let countryDetail = "";

  // ── GPA (kademeli geçiş, max +30, min -25) ──
  const gpaDiff = gpa - university.requiredGPA;
  if (gpaDiff >= 10) {
    gpaScore = 30;
    gpaDetail = `GPA'nız (${gpa}/100) gereksinimi rahatlıkla aşıyor (+${gpaDiff.toFixed(0)} puan)`;
  } else if (gpaDiff >= 5) {
    // +10 ile +5 arası: 25-30 arası lineer
    gpaScore = Math.round(25 + (gpaDiff - 5) * 1);
    gpaDetail = `GPA'nız (${gpa}/100) gereksinimi aşıyor (+${gpaDiff.toFixed(0)} puan)`;
  } else if (gpaDiff >= 0) {
    // 0 ile +5 arası: 15-25 arası lineer
    gpaScore = Math.round(15 + gpaDiff * 2);
    gpaDetail = `GPA'nız (${gpa}/100) gereksinimleri karşılıyor`;
  } else if (gpaDiff >= -5) {
    // 0 ile -5 arası: 15'ten -5'e lineer (kademeli düşüş, uçurum yok)
    gpaScore = Math.round(15 + gpaDiff * 4);
    gpaDetail = `GPA'nız (${gpa}/100) gereksinime yakın (${gpaDiff.toFixed(0)} puan)`;
  } else if (gpaDiff >= -10) {
    // -5 ile -10 arası: -5'ten -15'e lineer
    gpaScore = Math.round(-5 + (gpaDiff + 5) * 2);
    gpaDetail = `GPA'nız (${gpa}/100) gereksinimin ${Math.abs(gpaDiff).toFixed(0)} puan altında`;
  } else {
    // -10'dan düşük: lineer düşmeye devam, min -25
    gpaScore = Math.max(GPA_MIN, Math.round(-15 + (gpaDiff + 10) * 2));
    gpaDetail = `GPA'nız (${gpa}/100) gereksinimin çok altında (${gpaDiff.toFixed(0)} puan)`;
  }

  // ── Language (exact match, max +25) ──
  if (!student.languageCert || langScore == null) {
    languageScore = LANG_MISSING;
    languageDetail = "Dil sertifikası girilmedi";
  } else {
    const studentCert = normalizeCertName(student.languageCert);
    let matched = false;

    if (university.acceptedLanguages && university.acceptedLanguages.length > 0) {
      for (const lang of university.acceptedLanguages) {
        const uniCert = normalizeCertName(lang.test);
        if (uniCert === studentCert) {
          matched = true;
          const reqScore = safeParseScore(lang.minScore);
          if (reqScore == null) {
            // Veri hatası — puan okunamadı, nötr davran
            languageScore = 0;
            languageDetail = `${lang.test} minimum puanı okunamadı — veri hatası`;
          } else if (langScore >= reqScore) {
            languageScore = LANG_MATCHED;
            languageDetail = `${student.languageCert} puanınız (${langScore}) yeterli (min: ${lang.minScore})`;
          } else {
            const langDiff = langScore - reqScore;
            if (langDiff >= -0.5) {
              languageScore = LANG_CLOSE;
              languageDetail = `${student.languageCert} puanınız (${langScore}) minimuma çok yakın (${lang.minScore})`;
            } else {
              languageScore = LANG_FAILED;
              languageDetail = `${student.languageCert} puanınız (${langScore}) gerekli ${lang.minScore}'in altında`;
            }
          }
          break;
        }
      }
      if (!matched) {
        const accepted = university.acceptedLanguages.map((l) => l.test).join(", ");
        languageScore = LANG_FAILED;
        languageDetail = `${accepted} gerekli, sizde ${student.languageCert} var`;
      }
    } else {
      // Legacy: requiredLanguage alanı (acceptedLanguages tanımlı değilse)
      const reqCert = normalizeCertName(university.requiredLanguage);
      if (reqCert !== studentCert) {
        languageScore = LANG_FAILED;
        languageDetail = `${university.requiredLanguage} gerekli, sizde ${student.languageCert} var`;
      } else {
        const reqScore = safeParseScore(university.requiredLanguageScore);
        if (reqScore == null) {
          languageScore = 0;
          languageDetail = `${university.requiredLanguage} minimum puanı okunamadı — veri hatası`;
        } else if (langScore >= reqScore) {
          languageScore = LANG_MATCHED;
          languageDetail = `${student.languageCert} puanınız (${langScore}) yeterli`;
        } else {
          const langDiff = langScore - reqScore;
          if (langDiff >= -0.5) {
            languageScore = LANG_CLOSE;
            languageDetail = `${student.languageCert} puanınız (${langScore}) minimuma çok yakın (${reqScore})`;
          } else {
            languageScore = LANG_FAILED;
            languageDetail = `${student.languageCert} puanınız (${langScore}) gerekli minimum ${reqScore}'in altında`;
          }
        }
      }
    }
  }

  // ── Budget (kademeli, max +10, min -20) ──
  if (university.tuitionEUR === 0) {
    budgetScore = BUDGET_MAX;
    budgetDetail = "Ücretsiz program";
  } else if (budgetEUR >= university.tuitionEUR) {
    budgetScore = BUDGET_MAX;
    budgetDetail = `Bütçeniz (€${budgetEUR.toLocaleString()}) yıllık ücreti (€${university.tuitionEUR.toLocaleString()}) karşılıyor`;
  } else {
    // Kademeli: bütçenin ücreti karşılama oranına göre puan
    const ratio = budgetEUR / university.tuitionEUR;
    if (ratio >= 0.8) {
      // %80-99 arası: 0 ile -8 arası
      budgetScore = Math.round(-8 * (1 - ratio) / 0.2);
      budgetDetail = `Bütçeniz (€${budgetEUR.toLocaleString()}) ücreti neredeyse karşılıyor (%${Math.round(ratio * 100)})`;
    } else if (ratio >= 0.5) {
      // %50-79 arası: -8 ile -15 arası
      budgetScore = Math.round(-8 - 7 * (0.8 - ratio) / 0.3);
      budgetDetail = `Bütçeniz (€${budgetEUR.toLocaleString()}) ücretin bir kısmını karşılıyor (%${Math.round(ratio * 100)})`;
    } else {
      // %50'nin altı: -15 ile -20 arası
      budgetScore = Math.round(Math.max(BUDGET_MIN, -15 - 5 * (0.5 - ratio) / 0.5));
      budgetDetail = `Bütçeniz (€${budgetEUR.toLocaleString()}) yıllık ücretin (€${university.tuitionEUR.toLocaleString()}) çok altında`;
    }
  }

  // ── Ranking difficulty modifier (max -15, min 0) ──
  if (university.rankings && university.rankings.length > 0) {
    const bestRank = Math.min(...university.rankings.map((r) => r.rank));
    if (bestRank <= 5) {
      rankingScore = -15;
      rankingDetail = `Avrupa'nın en seçici okullarından (Top 5)`;
    } else if (bestRank <= 15) {
      rankingScore = -10;
      rankingDetail = `Yüksek sıralama = yüksek rekabet (Top 15)`;
    } else if (bestRank <= 30) {
      rankingScore = -5;
      rankingDetail = `Rekabetçi okul (Top 30)`;
    } else {
      rankingScore = 0;
      rankingDetail = `Sıralamaya göre orta düzey rekabet`;
    }
  }

  // ── Acceptance rate modifier (max -10, min +5) ──
  if (university.acceptanceRate != null) {
    if (university.acceptanceRate <= 10) {
      acceptanceScore = -10;
      acceptanceDetail = `Çok düşük kabul oranı (%${university.acceptanceRate})`;
    } else if (university.acceptanceRate <= 25) {
      acceptanceScore = -5;
      acceptanceDetail = `Düşük kabul oranı (%${university.acceptanceRate})`;
    } else if (university.acceptanceRate <= 50) {
      acceptanceScore = 0;
      acceptanceDetail = `Orta kabul oranı (%${university.acceptanceRate})`;
    } else {
      acceptanceScore = 5;
      acceptanceDetail = `Yüksek kabul oranı (%${university.acceptanceRate})`;
    }
  }

  // ── Competitiveness modifier ──
  let competitivenessScore = 0;
  if (university.competitiveness === "very_high") {
    competitivenessScore = -5;
  } else if (university.competitiveness === "high") {
    competitivenessScore = -2;
  }

  // ── Country modifier (admission system differences) ──
  const modifier = countryModifiers[university.country];
  if (modifier) {
    gpaScore = Math.round(gpaScore * modifier.gpaWeight);
    languageScore = Math.round(languageScore * modifier.languageWeight);
    countryScore = modifier.systemBonus;
    countryDetail = modifier.description;

    if (university.programRestricted) {
      countryScore -= 5;
      countryDetail += " (Kısıtlı kontenjan programı)";
    }
  }

  const totalScore = Math.max(
    0,
    Math.min(
      100,
      BASE_SCORE + gpaScore + languageScore + budgetScore + rankingScore + acceptanceScore + competitivenessScore + countryScore
    )
  );

  let status: EligibilityStatus;
  if (totalScore >= THRESHOLD_ELIGIBLE) status = "eligible";
  else if (totalScore >= THRESHOLD_POSSIBLE) status = "possible";
  else if (totalScore >= THRESHOLD_REACH) status = "reach";
  else status = "unlikely";

  return {
    university,
    score: totalScore,
    status,
    breakdown: {
      gpaScore,
      languageScore,
      budgetScore,
      rankingScore,
      acceptanceScore,
      countryScore,
      gpaDetail,
      languageDetail,
      budgetDetail,
      rankingDetail,
      acceptanceDetail,
      countryDetail,
    },
  };
}

export function getStatusLabel(status: EligibilityStatus): string {
  const labels: Record<EligibilityStatus, string> = {
    eligible: "Uygun",
    possible: "Olası",
    reach: "Zor",
    unlikely: "Düşük İhtimal",
  };
  return labels[status];
}

export function getStatusColor(status: EligibilityStatus): string {
  const colors: Record<EligibilityStatus, string> = {
    eligible: "var(--success)",
    possible: "var(--blue)",
    reach: "var(--gold)",
    unlikely: "var(--danger)",
  };
  return colors[status];
}

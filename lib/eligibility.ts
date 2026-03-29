import type { University, StudentInput, EligibilityResult, EligibilityStatus } from "@/types";

export function calculateEligibility(
  student: StudentInput,
  university: University
): EligibilityResult {
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

  // ── GPA (gradual, max +30) ──
  // GPA is on 100-point scale. Reward exceeding the requirement, penalize falling short.
  const gpaDiff = student.gpa - university.requiredGPA;
  if (gpaDiff >= 10) {
    gpaScore = 30;
    gpaDetail = `GPA'nız (${student.gpa}/100) gereksinimi rahatlıkla aşıyor (+${gpaDiff.toFixed(0)} puan)`;
  } else if (gpaDiff >= 5) {
    gpaScore = 25;
    gpaDetail = `GPA'nız (${student.gpa}/100) gereksinimi aşıyor (+${gpaDiff.toFixed(0)} puan)`;
  } else if (gpaDiff >= 0) {
    gpaScore = 20;
    gpaDetail = `GPA'nız (${student.gpa}/100) gereksinimleri karşılıyor`;
  } else if (gpaDiff >= -5) {
    gpaScore = 5;
    gpaDetail = `GPA'nız (${student.gpa}/100) gereksinime yakın (${gpaDiff.toFixed(0)} puan)`;
  } else if (gpaDiff >= -10) {
    gpaScore = -10;
    gpaDetail = `GPA'nız (${student.gpa}/100) gereksinimin ${Math.abs(gpaDiff).toFixed(0)} puan altında`;
  } else {
    gpaScore = Math.max(-25, Math.round(gpaDiff * 2));
    gpaDetail = `GPA'nız (${student.gpa}/100) gereksinimin çok altında (${gpaDiff.toFixed(0)} puan)`;
  }

  // ── Language (multi-language support, max +25) ──
  if (!student.languageCert || !student.languageScore) {
    languageScore = -40;
    languageDetail = "Dil sertifikası girilmedi";
  } else {
    const studentLang = student.languageCert.toLowerCase();
    let matched = false;

    // Check acceptedLanguages array first (new system)
    if (university.acceptedLanguages && university.acceptedLanguages.length > 0) {
      for (const lang of university.acceptedLanguages) {
        if (lang.test.toLowerCase() === studentLang) {
          matched = true;
          const reqScore = parseFloat(lang.minScore);
          if (student.languageScore >= reqScore) {
            languageScore = 25;
            languageDetail = `${student.languageCert} puanınız (${student.languageScore}) yeterli (min: ${lang.minScore})`;
          } else {
            const langDiff = student.languageScore - reqScore;
            // Gradual penalty based on how far below
            if (langDiff >= -0.5) {
              languageScore = -10;
              languageDetail = `${student.languageCert} puanınız (${student.languageScore}) minimuma çok yakın (${lang.minScore})`;
            } else {
              languageScore = -30;
              languageDetail = `${student.languageCert} puanınız (${student.languageScore}) gerekli ${lang.minScore}'in altında`;
            }
          }
          break;
        }
      }
      if (!matched) {
        // Student has a cert type not in acceptedLanguages
        const accepted = university.acceptedLanguages.map((l) => l.test).join(", ");
        languageScore = -30;
        languageDetail = `${accepted} gerekli, sizde ${student.languageCert} var`;
      }
    } else {
      // Fallback to old single-language system
      const reqLang = university.requiredLanguage.toLowerCase();
      const isCompatible =
        (reqLang.includes("ielts") && studentLang.includes("ielts")) ||
        (reqLang.includes("toefl") && studentLang.includes("toefl")) ||
        (reqLang.includes("testdaf") && studentLang.includes("testdaf")) ||
        (reqLang.includes("delf") && studentLang.includes("delf"));

      if (!isCompatible) {
        languageScore = -30;
        languageDetail = `${university.requiredLanguage} gerekli, sizde ${student.languageCert} var`;
      } else {
        const reqScore = parseFloat(university.requiredLanguageScore);
        if (student.languageScore >= reqScore) {
          languageScore = 25;
          languageDetail = `${student.languageCert} puanınız (${student.languageScore}) yeterli`;
        } else {
          const langDiff = student.languageScore - reqScore;
          if (langDiff >= -0.5) {
            languageScore = -10;
            languageDetail = `${student.languageCert} puanınız (${student.languageScore}) minimuma çok yakın (${reqScore})`;
          } else {
            languageScore = -30;
            languageDetail = `${student.languageCert} puanınız (${student.languageScore}) gerekli minimum ${reqScore}'in altında`;
          }
        }
      }
    }
  }

  // ── Budget (max +10) ──
  if (university.tuitionEUR === 0 || student.budgetEUR >= university.tuitionEUR) {
    budgetScore = 10;
    budgetDetail =
      university.tuitionEUR === 0
        ? "Ücretsiz program"
        : `Bütçeniz (€${student.budgetEUR}) yıllık ücreti (€${university.tuitionEUR}) karşılıyor`;
  } else {
    budgetScore = -20;
    budgetDetail = `Bütçeniz (€${student.budgetEUR}) yıllık ücretin (€${university.tuitionEUR}) altında`;
  }

  // ── Ranking difficulty modifier (max -15, min 0) ──
  // Higher-ranked schools are harder to get into
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

  // ── Competitiveness modifier (separate from ranking, based on school's own selectivity) ──
  let competitivenessScore = 0;
  if (university.competitiveness === "very_high") {
    competitivenessScore = -5;
  } else if (university.competitiveness === "high") {
    competitivenessScore = -2;
  }

  const totalScore = Math.max(
    0,
    Math.min(
      100,
      40 + gpaScore + languageScore + budgetScore + rankingScore + acceptanceScore + competitivenessScore
    )
  );

  let status: EligibilityStatus;
  if (totalScore >= 80) status = "eligible";
  else if (totalScore >= 55) status = "possible";
  else if (totalScore >= 30) status = "reach";
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
      gpaDetail,
      languageDetail,
      budgetDetail,
      rankingDetail,
      acceptanceDetail,
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

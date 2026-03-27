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

  // GPA calculation
  const normalizedGPA = (student.gpa / 4) * 100;
  if (normalizedGPA >= university.requiredGPA) {
    gpaScore = 25;
    gpaDetail = `GPA'nız (${student.gpa}) gereksinimleri karşılıyor`;
  } else {
    const diff = university.requiredGPA - normalizedGPA;
    gpaScore = Math.max(-25, 25 - Math.round(diff) * 3);
    gpaDetail = `GPA'nız (${student.gpa}) gereksinimin ${diff.toFixed(1)} puan altında`;
  }

  // Language calculation
  if (!student.languageCert || !student.languageScore) {
    languageScore = -40;
    languageDetail = "Dil sertifikası girilmedi";
  } else {
    const reqLang = university.requiredLanguage.toLowerCase();
    const studentLang = student.languageCert.toLowerCase();

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
        languageScore = -30;
        languageDetail = `${student.languageCert} puanınız (${student.languageScore}) gerekli minimum ${reqScore}'in altında`;
      }
    }
  }

  // Budget calculation
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

  const totalScore = Math.max(0, Math.min(100, 50 + gpaScore + languageScore + budgetScore));

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
      gpaDetail,
      languageDetail,
      budgetDetail,
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

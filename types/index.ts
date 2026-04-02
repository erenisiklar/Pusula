export interface UniversityRanking {
  source: string; // "QS" | "FT" | "THE" vb.
  rank: number;
  year: number;
}

export interface AcceptedLanguage {
  test: string; // "IELTS" | "TOEFL" | "TestDaF" | "DELF" | "GMAT" | "GRE"
  minScore: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  program: string;
  department: string;
  requiredGPA: number;
  requiredLanguage: string; // primary language requirement (kept for backward compat)
  requiredLanguageScore: string;
  acceptedLanguages?: AcceptedLanguage[]; // all accepted language tests
  tuitionEUR: number;
  description?: string;
  website?: string;
  deadline?: string;
  flag: string;
  rankings?: UniversityRanking[];
  acceptanceRate?: number; // 0-100, e.g. 15 = 15%
  competitiveness?: "very_high" | "high" | "medium" | "low"; // selectivity level
  dataVerified?: boolean; // true if data comes from official source
  programRestricted?: boolean; // true for numerus fixus, NC-limited, concours programs
  level?: "bachelor" | "master" | "associate"; // bachelor=lisans, master=yüksek lisans, associate=ön lisans
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  gpa: number;
  gpaScale: number;
  languageCert: string | null;
  languageScore: number | null;
  budgetEUR: number;
  targetCountries: string[];
  targetDepartment: string;
  createdAt: string;
  updatedAt: string;
}

export type EligibilityStatus = "eligible" | "possible" | "reach" | "unlikely";

export interface EligibilityResult {
  university: University;
  score: number;
  status: EligibilityStatus;
  breakdown: {
    gpaScore: number;
    languageScore: number;
    budgetScore: number;
    rankingScore: number;
    acceptanceScore: number;
    countryScore: number;
    gpaDetail: string;
    languageDetail: string;
    budgetDetail: string;
    rankingDetail: string;
    acceptanceDetail: string;
    countryDetail: string;
  };
}

export interface Application {
  id: string;
  userId: string;
  universityId: string;
  status: "planning" | "preparing" | "submitted" | "accepted" | "rejected";
  motivationLetter?: string;
  notes?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInput {
  gpa: number;
  languageCert: string | null;
  languageScore: number | null;
  budgetEUR: number;
  targetCountries: string[];
  targetDepartment: string;
}

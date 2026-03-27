export interface University {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  city: string;
  program: string;
  department: string;
  requiredGPA: number;
  requiredLanguage: string;
  requiredLanguageScore: string;
  tuitionEUR: number;
  description?: string;
  website?: string;
  deadline?: string;
  flag: string;
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
    gpaDetail: string;
    languageDetail: string;
    budgetDetail: string;
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

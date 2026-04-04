"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "pusula-student-profile";

export interface StudentProfile {
  fullName: string;
  gpa: number;
  languageCert: string;
  languageScore: number;
  budgetEUR: number;
  targetCountries: string[];
  targetDepartment: string;
  completedAt: string; // ISO date — onboarding tamamlanınca set edilir
}

interface ProfileContextValue {
  profile: StudentProfile | null;
  setProfile: (profile: StudentProfile) => void;
  updateProfile: (partial: Partial<StudentProfile>) => void;
  clearProfile: () => void;
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<StudentProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfileState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    if (profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [profile, loaded]);

  const setProfile = useCallback((p: StudentProfile) => {
    setProfileState(p);
  }, []);

  const updateProfile = useCallback((partial: Partial<StudentProfile>) => {
    setProfileState((prev) => (prev ? { ...prev, ...partial } : null));
  }, []);

  const clearProfile = useCallback(() => {
    setProfileState(null);
  }, []);

  // Don't render children until localStorage is read — prevents flash
  if (!loaded) return null;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        clearProfile,
        hasProfile: profile !== null,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

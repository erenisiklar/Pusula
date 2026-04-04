"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";

export default function Home() {
  const { hasProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    router.replace(hasProfile ? "/dashboard" : "/onboarding");
  }, [hasProfile, router]);

  return null;
}

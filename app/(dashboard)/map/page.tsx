import { universities } from "@/lib/universities";
import { getAcceptanceStats } from "@/lib/supabase/queries";
import MapClient from "./client";

export default async function MapPage() {
  const acceptanceStats = await getAcceptanceStats();
  return <MapClient universities={universities} acceptanceStats={acceptanceStats} />;
}

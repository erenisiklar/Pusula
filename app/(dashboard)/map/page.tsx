import { getUniversities, getAcceptanceStats } from "@/lib/supabase/queries";
import MapClient from "./client";

export default async function MapPage() {
  const [universities, acceptanceStats] = await Promise.all([
    getUniversities(),
    getAcceptanceStats(),
  ]);
  return <MapClient universities={universities} acceptanceStats={acceptanceStats} />;
}

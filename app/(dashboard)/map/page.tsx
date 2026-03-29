import { getUniversities } from "@/lib/supabase/queries";
import MapClient from "./client";

export default async function MapPage() {
  const universities = await getUniversities();
  return <MapClient universities={universities} />;
}

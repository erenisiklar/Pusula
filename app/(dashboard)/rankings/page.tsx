import { getUniversities } from "@/lib/supabase/queries";
import RankingsClient from "./client";

export default async function RankingsPage() {
  const universities = await getUniversities();

  return <RankingsClient universities={universities} />;
}

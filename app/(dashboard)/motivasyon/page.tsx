import { getUniversities } from "@/lib/supabase/queries";
import MotivasyonClient from "./client";

export default async function MotivasyonPage() {
  const universities = await getUniversities();

  return <MotivasyonClient universities={universities} />;
}

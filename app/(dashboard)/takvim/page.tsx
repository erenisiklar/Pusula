import { getUniversities } from "@/lib/supabase/queries";
import TakvimClient from "./client";

export default async function TakvimPage() {
  const universities = await getUniversities();
  return <TakvimClient universities={universities} />;
}

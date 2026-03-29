import { getUniversities } from "@/lib/supabase/queries";
import SchoolsClient from "./client";

export default async function SchoolsPage() {
  const universities = await getUniversities();
  return <SchoolsClient universities={universities} />;
}

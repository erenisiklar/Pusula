import { getAcceptanceStats } from "@/lib/supabase/queries";
import AcceptanceClient from "./client";

export default async function AcceptancePage() {
  const stats = await getAcceptanceStats();
  return <AcceptanceClient stats={stats} />;
}

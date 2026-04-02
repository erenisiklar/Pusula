import { universities } from "@/lib/universities";
import MapClient from "./client";

export default function MapPage() {
  return <MapClient universities={universities} acceptanceStats={[]} />;
}

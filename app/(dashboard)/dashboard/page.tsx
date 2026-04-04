import { getUniversities } from "@/lib/supabase/queries";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const universities = await getUniversities();

  const totalPrograms = universities.length;
  const totalCountries = new Set(universities.map((u) => u.country)).size;
  const freePrograms = universities.filter((u) => u.tuitionEUR === 0).length;

  // Yaklaşan deadline: önümüzdeki 60 gün içindeki deadline'lar
  const now = new Date();
  const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Türkçe ay isimlerini parse et
  const monthMap: Record<string, number> = {
    "ocak": 0, "şubat": 1, "mart": 2, "nisan": 3, "mayıs": 4, "haziran": 5,
    "temmuz": 6, "ağustos": 7, "eylül": 8, "ekim": 9, "kasım": 10, "aralık": 11,
  };

  let upcomingDeadlines = 0;
  for (const uni of universities) {
    if (!uni.deadline) continue;
    const lower = uni.deadline.toLowerCase();
    const match = lower.match(/(\d{1,2})\s+(\S+)/);
    if (!match) continue;
    const day = parseInt(match[1]);
    const monthStr = match[2].replace(/[()]/g, "").trim();
    const month = monthMap[monthStr];
    if (month == null) continue;
    let year = now.getFullYear();
    const deadlineDate = new Date(year, month, day);
    if (deadlineDate < now) {
      deadlineDate.setFullYear(year + 1);
    }
    if (deadlineDate <= sixtyDaysLater) {
      upcomingDeadlines++;
    }
  }

  return (
    <DashboardClient
      universities={universities}
      totalPrograms={totalPrograms}
      totalCountries={totalCountries}
      freePrograms={freePrograms}
      upcomingDeadlines={upcomingDeadlines}
    />
  );
}

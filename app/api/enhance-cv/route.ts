import { NextRequest, NextResponse } from "next/server";
import { enhanceCVData } from "@/lib/gemini";
import type { CVData } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvData } = body as { cvData: CVData };

    if (!cvData || !cvData.personalInfo?.fullName) {
      return NextResponse.json(
        { error: "CV verisi eksik. Lütfen en azından ad soyad girin." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      // No API key — return data as-is without enhancement
      return NextResponse.json({ enhancedData: cvData });
    }

    const enhancedData = await enhanceCVData(cvData);

    return NextResponse.json({ enhancedData });
  } catch (error) {
    console.error("CV enhancement error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `CV iyileştirme hatası: ${msg}` },
      { status: 500 }
    );
  }
}

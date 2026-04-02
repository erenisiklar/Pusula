import { NextRequest, NextResponse } from "next/server";
import { generateMotivationLetter } from "@/lib/claude";

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY ortam değişkeni tanımlı değil. Vercel Dashboard > Settings > Environment Variables'dan ekleyin." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { studentName, university, program, country, gpa, strengths, motivation } = body;

    if (!studentName || !university || !program || !strengths || !motivation) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    const letter = await generateMotivationLetter({
      studentName,
      university,
      program,
      country,
      gpa,
      strengths,
      motivation,
    });

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Letter generation error:", error);
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    const isAuthError = message.includes("api_key") || message.includes("401") || message.includes("authentication");
    return NextResponse.json(
      {
        error: isAuthError
          ? "API anahtarı geçersiz veya eksik. Lütfen ANTHROPIC_API_KEY ortam değişkenini kontrol edin."
          : `Mektup oluşturulurken hata: ${message}`,
      },
      { status: 500 }
    );
  }
}

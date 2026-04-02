import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY ortam değişkeni tanımlı değil." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  try {
    const body = await request.json();
    const { studentName, university, program, country, gpa, strengths, motivation } = body;

    if (!studentName || !university || !program || !strengths || !motivation) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    const prompt = `You are an expert European university admissions consultant writing motivation letters for Turkish students applying to European universities. Write compelling, authentic motivation letters in English, approximately 500 words. Be specific and personal, avoid generic phrases.

Write a motivation letter for the following student:

Name: ${studentName}
University: ${university}
Program: ${program}
Country: ${country}
GPA: ${gpa}/100
Key Strengths: ${strengths}
Personal Motivation: ${motivation}

Write a professional, compelling motivation letter in English (~500 words). Include:
1. Strong opening paragraph
2. Academic background and achievements
3. Why this specific program and university
4. Career goals and how this program fits
5. Closing with enthusiasm and commitment`;

    const result = await model.generateContent(prompt);
    const letter = result.response.text();

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Letter generation error:", error);
    const msg = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Mektup oluşturulurken hata: ${msg}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const sectionDescriptions: Record<string, string> = {
  OPENING: "A strong, attention-grabbing opening paragraph that introduces the student and their purpose for applying.",
  ACADEMIC_BACKGROUND: "The student's academic background, achievements, relevant coursework, and academic projects.",
  WHY_THIS_PROGRAM: "Why this specific program and university — specific details about what attracts the student.",
  EXPERIENCE: "Relevant experience, extracurricular activities, internships, and skills.",
  CAREER_GOALS: "Career goals and how this program fits into the student's long-term professional vision.",
  CLOSING: "A memorable closing that reinforces enthusiasm, commitment, and readiness.",
};

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY tanımlı değil." }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  try {
    const body = await request.json();
    const { section, fullLetter, studentInfo, instruction, letterLanguage = "en" } = body;

    if (!section || !fullLetter || !studentInfo) {
      return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
    }

    const desc = sectionDescriptions[section] || "this section";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const isFrench = letterLanguage === "fr";
    const langName = isFrench ? "French" : "English";

    const prompt = `You are an expert European university admissions consultant. Rewrite only the requested section of a motivation letter in ${langName}. Keep the same style, language, and flow as the rest of the letter. Return ONLY the rewritten section text, no headers or labels.${isFrench ? " The rewritten section MUST be in French." : ""}

Here is the full motivation letter:
---
${fullLetter}
---

Student info:
Name: ${studentInfo.studentName}
University: ${studentInfo.university}
Program: ${studentInfo.program}
GPA: ${studentInfo.gpa}/100

Please rewrite ONLY the [${section}] section. Description: ${desc}
${instruction ? `Additional instruction: ${instruction}` : ""}

Return ONLY the rewritten paragraph text. Do not include any section markers or headers.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Regenerate section error:", error);
    return NextResponse.json(
      { error: "Bölüm yeniden oluşturulamadı." },
      { status: 500 }
    );
  }
}

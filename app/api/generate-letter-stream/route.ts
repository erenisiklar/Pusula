import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY ortam değişkeni tanımlı değil. Vercel Dashboard > Settings > Environment Variables'dan ekleyin." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  try {
    const body = await request.json();
    const {
      studentName,
      university,
      program,
      country,
      gpa,
      strengths,
      motivation,
      languageLevel,
      extracurriculars,
      careerGoals,
      tone = "balanced",
      wordCount = 500,
    } = body;

    if (!studentName || !university || !program || !strengths || !motivation) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 }
      );
    }

    const toneMap: Record<string, string> = {
      formal: "Use a formal, professional academic tone. Avoid colloquialisms.",
      balanced: "Use a balanced tone that is professional yet personable and warm.",
      creative: "Use a creative, engaging tone with vivid language and storytelling elements.",
    };

    const toneInstruction = toneMap[tone] || toneMap.balanced;

    const optionalSections = [
      languageLevel ? `Language Proficiency: ${languageLevel}` : "",
      extracurriculars ? `Extracurricular Activities: ${extracurriculars}` : "",
      careerGoals ? `Career Goals: ${careerGoals}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    const prompt = `You are an expert European university admissions consultant writing motivation letters for Turkish students applying to European universities. ${toneInstruction} Write compelling, authentic motivation letters in English. Be specific and personal, avoid generic phrases. Target approximately ${wordCount} words.

Write a motivation letter for the following student:

Name: ${studentName}
University: ${university}
Program: ${program}
Country: ${country}
GPA: ${gpa}/100
Key Strengths: ${strengths}
Personal Motivation: ${motivation}
${optionalSections}

Write a professional, compelling motivation letter in English (~${wordCount} words). Structure it with these clearly separated sections:

[OPENING]
A strong, attention-grabbing opening paragraph that introduces the student and their purpose.

[ACADEMIC_BACKGROUND]
Academic background, achievements, and relevant coursework or projects.

[WHY_THIS_PROGRAM]
Why this specific program and university — be specific about what attracts the student.

[EXPERIENCE]
Relevant experience, extracurricular activities, and skills that make the student stand out.

[CAREER_GOALS]
Career goals and how this program fits into the student's long-term vision.

[CLOSING]
A memorable closing that reinforces enthusiasm and commitment.

IMPORTANT: Use the section markers [OPENING], [ACADEMIC_BACKGROUND], [WHY_THIS_PROGRAM], [EXPERIENCE], [CAREER_GOALS], [CLOSING] as headers for each section. Do not include any other formatting or headers.`;

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

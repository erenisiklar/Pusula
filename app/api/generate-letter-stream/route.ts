import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY ortam değişkeni tanımlı değil." },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

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

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: `You are an expert European university admissions consultant writing motivation letters for Turkish students applying to European universities. ${toneInstruction} Write compelling, authentic motivation letters in English. Be specific and personal, avoid generic phrases. Target approximately ${wordCount} words.`,
      messages: [
        {
          role: "user",
          content: `Write a motivation letter for the following student:

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

IMPORTANT: Use the section markers [OPENING], [ACADEMIC_BACKGROUND], [WHY_THIS_PROGRAM], [EXPERIENCE], [CAREER_GOALS], [CLOSING] as headers for each section. Do not include any other formatting or headers.`,
        },
      ],
    });

    const block = message.content[0];
    const letter = block.type === "text" ? block.text : "";

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

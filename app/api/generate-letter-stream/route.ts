import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY ortam değişkeni tanımlı değil. Vercel Dashboard > Settings > Environment Variables'dan ekleyin." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

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
      return new Response(
        JSON.stringify({ error: "Tüm alanlar zorunludur." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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

    const stream = anthropic.messages.stream({
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

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream hatası oluştu." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Letter stream error:", error);
    return new Response(
      JSON.stringify({ error: "Mektup oluşturulurken bir hata oluştu." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

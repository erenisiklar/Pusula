import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateMotivationLetter(params: {
  studentName: string;
  university: string;
  program: string;
  country: string;
  gpa: number;
  strengths: string;
  motivation: string;
}): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system:
      "You are an expert European university admissions consultant writing motivation letters for Turkish students applying to European universities. Write compelling, authentic motivation letters in English, approximately 500 words. Be specific and personal, avoid generic phrases.",
    messages: [
      {
        role: "user",
        content: `Write a motivation letter for the following student:

Name: ${params.studentName}
University: ${params.university}
Program: ${params.program}
Country: ${params.country}
GPA: ${params.gpa}/4.0
Key Strengths: ${params.strengths}
Personal Motivation: ${params.motivation}

Write a professional, compelling motivation letter in English (~500 words). Include:
1. Strong opening paragraph
2. Academic background and achievements
3. Why this specific program and university
4. Career goals and how this program fits
5. Closing with enthusiasm and commitment`,
      },
    ],
  });

  const letterBlock = message.content[0];
  if (letterBlock.type === "text") return letterBlock.text;
  return "";
}

export async function explainEligibility(params: {
  university: string;
  program: string;
  score: number;
  gpaDetail: string;
  languageDetail: string;
  budgetDetail: string;
}): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system:
      "Sen Avrupa üniversitelerine başvuru konusunda uzman bir danışmansın. Türk öğrencilere Türkçe olarak kısa ve net tavsiyeler ver. Pozitif ve yapıcı ol.",
    messages: [
      {
        role: "user",
        content: `Bir öğrencinin ${params.university} - ${params.program} programı için uygunluk sonucu:

Toplam Skor: ${params.score}/100
GPA Durumu: ${params.gpaDetail}
Dil Durumu: ${params.languageDetail}
Bütçe Durumu: ${params.budgetDetail}

Bu sonuçları kısaca yorumla ve öğrenciye 2-3 cümlelik tavsiye ver.`,
      },
    ],
  });

  const eligBlock = message.content[0];
  if (eligBlock.type === "text") return eligBlock.text;
  return "";
}

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

export async function generateCV(params: {
  rawContent: string;
  targetField: "business" | "engineering" | "other";
}): Promise<{ onePageCV: string; harvardCV: string }> {
  const fieldContext =
    params.targetField === "business"
      ? "The student is targeting business/economics programs. Emphasize leadership, teamwork, communication, analytical thinking, and any business-related experiences."
      : params.targetField === "engineering"
        ? "The student is targeting engineering/STEM programs. Emphasize technical skills, projects, quantitative achievements, problem-solving, and research experience."
        : "Adapt the tone based on the content provided. Highlight the most relevant achievements for a well-rounded academic profile.";

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    system: `You are an expert CV writer specializing in European university applications. You produce clean, structured, professional CVs in English with native-level wording.

Rules:
- ONLY use information provided by the user. NEVER invent or hallucinate data.
- If data is missing for a section, omit that section entirely rather than making things up.
- Use strong action verbs and quantify impact where the data supports it.
- Remove weak, irrelevant, or redundant content.
- Reframe experiences to highlight impact and leadership.
- Keep both CV versions factually consistent (same data, different formatting/depth).
- No emojis, no unnecessary explanations. Output ONLY the CV content.

${fieldContext}`,
    messages: [
      {
        role: "user",
        content: `Analyze the following content and generate TWO CV versions. Return them in this exact format:

===ONE_PAGE_CV===
(content here)
===END_ONE_PAGE_CV===

===HARVARD_CV===
(content here)
===END_HARVARD_CV===

VERSION 1 - ONE-PAGE OPTIMIZED CV:
- Maximum 1 page worth of content
- Clean, modern, highly readable
- Tailored for European university applications
- ATS-friendly formatting
- Sections (only include if data exists): Education, Experience, Leadership & Activities, Skills
- Use bullet points with action verbs
- Be extremely concise - every word must earn its place

VERSION 2 - HARVARD-STYLE CV:
- Based on Harvard CV standards - formal and academic
- More detailed than the one-page version
- Strong emphasis on academic achievements and projects
- Sections (only include if data exists): Education, Academic Projects, Research, Professional Experience, Leadership & Activities, Skills & Certifications, Awards & Honors
- Polished, professional academic wording
- Structured with clear hierarchy

Raw content to analyze:
${params.rawContent}`,
      },
    ],
  });

  const cvBlock = message.content[0];
  const cvText = cvBlock.type === "text" ? cvBlock.text : "";

  const onePageMatch = cvText.match(
    /===ONE_PAGE_CV===([\s\S]*?)===END_ONE_PAGE_CV===/
  );
  const harvardMatch = cvText.match(
    /===HARVARD_CV===([\s\S]*?)===END_HARVARD_CV===/
  );

  return {
    onePageCV: onePageMatch ? onePageMatch[1].trim() : cvText,
    harvardCV: harvardMatch ? harvardMatch[1].trim() : "",
  };
}

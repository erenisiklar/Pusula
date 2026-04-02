import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

function getLanguageLevelInstruction(languageLevel: string | undefined): string {
  if (!languageLevel) return "";

  const input = languageLevel.toLowerCase().trim();

  // Extract numeric score from various formats
  let score: number | null = null;
  let testType: string | null = null;

  // IELTS: 0-9 scale (e.g. "IELTS 6.5", "ielts 7.0", "6.5")
  const ieltsMatch = input.match(/(?:ielts\s*)?(\d+(?:\.\d)?)/);
  if (input.includes("ielts") && ieltsMatch) {
    score = parseFloat(ieltsMatch[1]);
    testType = "ielts";
  }

  // TOEFL: 0-120 scale (e.g. "TOEFL 90", "toefl ibt 100")
  const toeflMatch = input.match(/(?:toefl\s*(?:ibt\s*)?)?(\d{2,3})/);
  if (input.includes("toefl") && toeflMatch) {
    score = parseFloat(toeflMatch[1]);
    testType = "toefl";
  }

  // CEFR levels (e.g. "B2", "C1")
  const cefrMatch = input.match(/\b([abc][12])\b/i);
  if (cefrMatch) {
    const cefrMap: Record<string, number> = {
      a1: 2.0, a2: 3.0, b1: 4.5, b2: 6.0, c1: 7.5, c2: 8.5,
    };
    const cefrLevel = cefrMatch[1].toLowerCase();
    if (!testType) {
      score = cefrMap[cefrLevel] || null;
      testType = "ielts"; // normalize to IELTS equivalent
    }
  }

  // TestDaF: 3-5 scale (e.g. "TestDaF 4", "testdaf tdn4")
  if (input.includes("testdaf") || input.includes("tdn")) {
    const tdfMatch = input.match(/(\d)/);
    if (tdfMatch) {
      const tdfMap: Record<string, number> = { "3": 5.5, "4": 6.5, "5": 7.5 };
      score = tdfMap[tdfMatch[1]] || null;
      testType = "ielts"; // normalize
    }
  }

  // DELF/DALF
  if (input.includes("delf") || input.includes("dalf")) {
    if (input.includes("dalf c2")) { score = 8.5; testType = "ielts"; }
    else if (input.includes("dalf c1") || input.includes("dalf")) { score = 7.5; testType = "ielts"; }
    else if (input.includes("delf b2")) { score = 6.0; testType = "ielts"; }
    else if (input.includes("delf b1")) { score = 4.5; testType = "ielts"; }
  }

  // If no score detected, try bare number
  if (!score && !testType) {
    const bareNum = input.match(/^(\d+(?:\.\d)?)\s*$/);
    if (bareNum) {
      const n = parseFloat(bareNum[1]);
      if (n <= 9) { score = n; testType = "ielts"; }
      else if (n <= 120) { score = n; testType = "toefl"; }
    }
  }

  // Normalize TOEFL to IELTS equivalent for unified proficiency mapping
  if (testType === "toefl" && score !== null) {
    if (score >= 110) score = 8.0;
    else if (score >= 100) score = 7.5;
    else if (score >= 90) score = 7.0;
    else if (score >= 79) score = 6.5;
    else if (score >= 60) score = 6.0;
    else if (score >= 46) score = 5.5;
    else score = 5.0;
    testType = "ielts";
  }

  if (!score) return "";

  // Map IELTS-equivalent score to writing style instructions
  if (score >= 8.0) {
    return `CRITICAL — LANGUAGE AUTHENTICITY:
The student has a very high English proficiency (IELTS 8.0+ / C2 level). Write with:
- Sophisticated, nuanced vocabulary and idiomatic expressions
- Complex sentence structures with subordinate clauses, inversions, and varied syntax
- Advanced academic register with precise word choices
- Natural flow with seamless transitions between ideas
- Occasional rhetorical devices (parallel structure, anaphora)
The writing should read like a highly proficient non-native speaker — excellent but still with a natural non-native feel, not like a native English professor.`;
  } else if (score >= 7.0) {
    return `CRITICAL — LANGUAGE AUTHENTICITY:
The student has a good English proficiency (IELTS 7.0-7.5 / C1 level). Write with:
- Strong vocabulary but not overly sophisticated — avoid rare or literary words
- Mix of complex and simple sentence structures (not every sentence should be complex)
- Clear academic tone with good use of linking words (however, furthermore, in addition)
- Occasional minor stylistic choices that hint at a non-native speaker (slightly formal where a native speaker might be casual)
- Good range of grammar but keep it natural, not showy
The writing should sound like a confident B2+/C1 speaker — fluent and clear, with good range but not perfect native-like prose.`;
  } else if (score >= 6.0) {
    return `CRITICAL — LANGUAGE AUTHENTICITY:
The student has an intermediate English proficiency (IELTS 6.0-6.5 / B2 level). Write with:
- Clear, straightforward vocabulary — use common academic words, avoid complex/rare vocabulary
- Mostly simple and compound sentences with occasional complex sentences
- Basic but correct linking words (also, because, for example, therefore, in conclusion)
- Direct and clear expression of ideas — no overly elaborate phrasing
- Some repetition of sentence patterns is natural at this level
- Minor but natural imperfections: occasional slightly awkward phrasing, a preposition that's not quite idiomatic
The writing should sound like a solid B2 speaker — competent and clear, but noticeably simpler than a C1 writer. It must still be grammatically correct overall.`;
  } else {
    return `CRITICAL — LANGUAGE AUTHENTICITY:
The student has a developing English proficiency (IELTS 5.0-5.5 / B1 level). Write with:
- Simple, everyday vocabulary — avoid all academic jargon and complex words
- Short, simple sentences — mostly subject-verb-object structure
- Basic linking words only (and, but, because, so, first, then, finally)
- Very direct and straightforward expression — say things plainly
- Some natural imperfections: occasional awkward word order, simple grammar throughout
- Repetitive sentence openings are natural (I want to..., I have..., I believe...)
- Avoid idioms, phrasal verbs, and any sophisticated expressions
The writing should sound like an honest B1 speaker — simple but sincere. The authenticity of the language level is MORE important than sounding impressive. A simple, genuine letter is better than one that clearly wasn't written by the student.`;
  }
}

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

    // Determine language proficiency level from input to match writing style
    const langLevelInstruction = getLanguageLevelInstruction(languageLevel);

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
        maxOutputTokens: 4096,
      },
    });

    const prompt = `You are an expert European university admissions consultant writing motivation letters for Turkish students applying to European universities. ${toneInstruction} Write compelling, authentic motivation letters in English. Be specific and personal, avoid generic phrases.

WORD LIMIT: The letter MUST NOT exceed ${wordCount} words. This is a hard upper limit set by the university's application system. Aim for ${Math.round(wordCount * 0.85)}-${wordCount} words. Going over ${wordCount} words is NOT acceptable — the application system will reject it.

${langLevelInstruction}

Write a motivation letter for the following student:

Name: ${studentName}
University: ${university}
Program: ${program}
Country: ${country}
GPA: ${gpa}/100
Key Strengths: ${strengths}
Personal Motivation: ${motivation}
${optionalSections}

Write a professional, compelling motivation letter in English (maximum ${wordCount} words, aim for ${Math.round(wordCount * 0.85)}-${wordCount} words). Structure it with these clearly separated sections:

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

IMPORTANT RULES:
- Use the section markers [OPENING], [ACADEMIC_BACKGROUND], [WHY_THIS_PROGRAM], [EXPERIENCE], [CAREER_GOALS], [CLOSING] as headers for each section.
- Do not include any other formatting or headers.
- NEVER leave any sentence incomplete or cut off mid-way. Every sentence MUST be fully finished with proper punctuation.
- NEVER stop writing in the middle of a paragraph. Complete every thought fully.
- The letter MUST be under ${wordCount} words. Count your words carefully. Do NOT exceed this limit.
- If approaching the word limit, wrap up gracefully with a complete closing — do not abruptly stop.`;

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

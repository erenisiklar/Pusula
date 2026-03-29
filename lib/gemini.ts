import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// --- Types ---

export interface CVData {
  personalInfo: {
    fullName: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  education: {
    institution: string;
    degree?: string;
    field?: string;
    gpa?: string;
    startDate?: string;
    endDate?: string;
    highlights?: string[];
  }[];
  experience: {
    company: string;
    role: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
  }[];
  projects: {
    name: string;
    description?: string;
    technologies?: string;
    highlights?: string[];
  }[];
  skills: {
    technical?: string[];
    languages?: string[];
    certifications?: string[];
    other?: string[];
  };
  leadership: {
    role: string;
    organization: string;
    period?: string;
    description?: string;
  }[];
  awards: {
    title: string;
    issuer?: string;
    date?: string;
    description?: string;
  }[];
  detectedField: "business" | "engineering" | "other";
}

export interface GeneratedCVs {
  onePageCV: string;
  harvardCV: string;
  extractedData: CVData;
}

// =============================================
// STEP 1: Extract & Structure
// =============================================

async function extractCVData(
  rawContent: string,
  targetField: "business" | "engineering" | "other"
): Promise<CVData> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const prompt = `You are a CV data extraction specialist. Analyze the following raw content and extract ALL relevant CV information into structured JSON.

Return ONLY valid JSON in this exact structure (no markdown, no backticks):
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "education": [{ "institution": "", "degree": "", "field": "", "gpa": "", "startDate": "", "endDate": "", "highlights": [] }],
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "bullets": [] }],
  "projects": [{ "name": "", "description": "", "technologies": "", "highlights": [] }],
  "skills": { "technical": [], "languages": [], "certifications": [], "other": [] },
  "leadership": [{ "role": "", "organization": "", "period": "", "description": "" }],
  "awards": [{ "title": "", "issuer": "", "date": "", "description": "" }],
  "detectedField": "business" | "engineering" | "other"
}

CRITICAL RULES:
- ONLY extract information explicitly present in the text
- NEVER invent, assume, or hallucinate any data
- If a field has no data, use empty string or empty array
- Clean up formatting: fix typos, standardize dates, normalize capitalization
- Translate Turkish content to English where appropriate
- Preserve all quantified achievements (numbers, percentages, metrics)
- Set detectedField based on the content (user indicated: ${targetField})

Raw content:
${rawContent}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as CVData;
}

// =============================================
// STEP 2: Generate One-Page CV
// =============================================

async function generateOnePageCV(
  data: CVData,
  targetField: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    },
  });

  const fieldGuidance =
    targetField === "business"
      ? "Emphasize leadership, communication, analytical skills, and business impact."
      : targetField === "engineering"
        ? "Emphasize technical skills, system design, quantified technical impact."
        : "Balance academic and professional achievements.";

  const prompt = `You are an expert CV writer for European university applications. Generate a ONE-PAGE optimized CV from the data below.

FORMAT:
- Plain text, clear hierarchy
- Name at top, contact info below
- Section headers in UPPERCASE with dashes below
- Bullet points with (- ) prefix
- Maximum 1 page — be concise
- Every bullet starts with a strong action verb
- ATS-friendly: no tables, no columns

SECTIONS (skip if no data): EDUCATION, EXPERIENCE, LEADERSHIP & ACTIVITIES, SKILLS

STYLE: ${fieldGuidance}
- Native-level professional English
- No fluff, action verbs only: Led, Developed, Achieved, Designed

CRITICAL: Only use provided data. Do NOT invent anything.

DATA:
${JSON.stringify(data, null, 2)}

Output ONLY the CV text.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// =============================================
// STEP 3: Generate Harvard-Style CV
// =============================================

async function generateHarvardCV(
  data: CVData,
  targetField: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3000,
    },
  });

  const fieldGuidance =
    targetField === "business"
      ? "Emphasize leadership roles, strategic thinking, and quantified business outcomes."
      : targetField === "engineering"
        ? "Emphasize research, technical depth, and engineering achievements."
        : "Present a well-rounded academic and professional profile.";

  const prompt = `You are an expert academic CV writer following Harvard University CV standards. Generate a HARVARD-STYLE CV from the data below.

FORMAT:
- Plain text, formal academic formatting
- Name centered at top, contact on next line
- Section headers in UPPERCASE with dashes below
- More detailed than a one-page CV
- Formal, academic tone
- Dates clearly written after each entry

SECTIONS (skip if no data): EDUCATION, ACADEMIC PROJECTS & RESEARCH, PROFESSIONAL EXPERIENCE, LEADERSHIP & ACTIVITIES, SKILLS & CERTIFICATIONS, AWARDS & HONORS, LANGUAGES

STYLE: ${fieldGuidance}
- Harvard standard: formal, precise, comprehensive
- Polished academic English
- 2-4 detailed bullet points per experience

CRITICAL: Only use provided data. Do NOT invent anything.

DATA:
${JSON.stringify(data, null, 2)}

Output ONLY the CV text.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// =============================================
// MAIN PIPELINE
// =============================================

export async function generateCVWithGemini(params: {
  rawContent: string;
  targetField: "business" | "engineering" | "other";
}): Promise<GeneratedCVs> {
  // Step 1: Extract structured data
  const extractedData = await extractCVData(
    params.rawContent,
    params.targetField
  );

  const effectiveField =
    params.targetField !== "other"
      ? params.targetField
      : extractedData.detectedField || "other";

  // Step 2 & 3: Generate both CVs in parallel
  const [onePageCV, harvardCV] = await Promise.all([
    generateOnePageCV(extractedData, effectiveField),
    generateHarvardCV(extractedData, effectiveField),
  ]);

  return {
    onePageCV,
    harvardCV,
    extractedData,
  };
}

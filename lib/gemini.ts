import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// --- JSON Schema for structured extraction ---

const cvDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    personalInfo: {
      type: SchemaType.OBJECT,
      properties: {
        fullName: { type: SchemaType.STRING },
        email: { type: SchemaType.STRING },
        phone: { type: SchemaType.STRING },
        location: { type: SchemaType.STRING },
        linkedin: { type: SchemaType.STRING },
        website: { type: SchemaType.STRING },
      },
      required: ["fullName"],
    },
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          institution: { type: SchemaType.STRING },
          degree: { type: SchemaType.STRING },
          field: { type: SchemaType.STRING },
          gpa: { type: SchemaType.STRING },
          startDate: { type: SchemaType.STRING },
          endDate: { type: SchemaType.STRING },
          highlights: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["institution"],
      },
    },
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          company: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          startDate: { type: SchemaType.STRING },
          endDate: { type: SchemaType.STRING },
          bullets: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["company", "role"],
      },
    },
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          technologies: { type: SchemaType.STRING },
          highlights: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["name"],
      },
    },
    skills: {
      type: SchemaType.OBJECT,
      properties: {
        technical: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        languages: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        certifications: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        other: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
    },
    leadership: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          role: { type: SchemaType.STRING },
          organization: { type: SchemaType.STRING },
          period: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
        },
        required: ["role", "organization"],
      },
    },
    awards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          issuer: { type: SchemaType.STRING },
          date: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
        },
        required: ["title"],
      },
    },
    detectedField: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["business", "engineering", "other"],
    },
  },
  required: ["personalInfo"],
};

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
// STEP 1: Extract & Structure (Gemini JSON mode)
// =============================================

async function extractCVData(
  rawContent: string,
  targetField: "business" | "engineering" | "other"
): Promise<CVData> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: cvDataSchema,
      temperature: 0.1,
    },
  });

  const prompt = `You are a CV data extraction specialist. Analyze the following raw content and extract ALL relevant CV information into the structured JSON format.

CRITICAL RULES:
- ONLY extract information that is explicitly present in the text
- NEVER invent, assume, or hallucinate any data
- If a field has no data, leave it as empty string or empty array
- Clean up formatting: fix typos, standardize date formats, normalize capitalization
- Translate Turkish content to English where appropriate (job titles, descriptions)
- Preserve all quantified achievements (numbers, percentages, metrics)

The user indicated their target field is: ${targetField}
Based on the content, also detect what field best matches their background and set detectedField accordingly.

Raw content to analyze:
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
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    },
  });

  const fieldGuidance =
    targetField === "business"
      ? "Emphasize leadership, communication, analytical skills, and business impact. Use metrics like revenue, growth percentages, team sizes."
      : targetField === "engineering"
        ? "Emphasize technical skills, system design, quantified technical impact. Use metrics like performance improvements, scale, uptime."
        : "Balance academic and professional achievements. Highlight versatility and cross-domain skills.";

  const prompt = `You are an expert CV writer for European university applications. Generate a ONE-PAGE optimized CV from the structured data below.

FORMAT RULES:
- Use plain text with clear visual hierarchy
- Name centered at top, contact info on one line below
- Section headers in UPPERCASE followed by a line of dashes
- Use bullet points (- ) for items
- Maximum 1 page worth of content — be ruthlessly concise
- Every bullet must start with a strong action verb
- Quantify impact wherever the data supports it
- ATS-friendly: no tables, no columns, no special characters

SECTION ORDER (skip if no data):
1. EDUCATION
2. EXPERIENCE
3. LEADERSHIP & ACTIVITIES
4. SKILLS

STYLE:
- ${fieldGuidance}
- Native-level professional English
- No fluff, no filler words
- No "responsible for" — use action verbs: Led, Developed, Achieved, Designed, etc.

CRITICAL: Only use data provided below. Do NOT invent anything.

DATA:
${JSON.stringify(data, null, 2)}

Generate the CV now. Output ONLY the CV text, nothing else.`;

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
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3000,
    },
  });

  const fieldGuidance =
    targetField === "business"
      ? "Emphasize leadership roles, strategic thinking, and quantified business outcomes."
      : targetField === "engineering"
        ? "Emphasize research contributions, technical depth, publications, and engineering achievements."
        : "Present a well-rounded academic and professional profile.";

  const prompt = `You are an expert academic CV writer following Harvard University CV standards. Generate a HARVARD-STYLE CV from the structured data below.

FORMAT RULES:
- Use plain text with formal academic formatting
- Name centered at top in full, contact details on separate line
- Section headers in UPPERCASE followed by a line of dashes
- More detailed than a one-page CV — include all relevant information
- Formal, academic tone throughout
- Use complete descriptions, not just bullet fragments
- Dates right-aligned style: write them clearly after each entry

SECTION ORDER (skip if no data):
1. EDUCATION (include GPA, honors, relevant coursework, thesis)
2. ACADEMIC PROJECTS & RESEARCH
3. PROFESSIONAL EXPERIENCE
4. LEADERSHIP & ACTIVITIES
5. SKILLS & CERTIFICATIONS
6. AWARDS & HONORS
7. LANGUAGES

STYLE:
- ${fieldGuidance}
- Harvard standard: formal, precise, comprehensive
- Polished academic English
- Include more context and detail than a one-page CV
- Each experience should have 2-4 detailed bullet points

CRITICAL: Only use data provided below. Do NOT invent anything.

DATA:
${JSON.stringify(data, null, 2)}

Generate the CV now. Output ONLY the CV text, nothing else.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// =============================================
// MAIN PIPELINE: Extract → Generate x2
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

  // Use detected field if user picked "other" and AI found a better match
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

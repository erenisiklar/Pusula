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
    photo?: string;
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

// =============================================
// CV DATA ENHANCEMENT (Form → Polished)
// =============================================

export async function enhanceCVData(rawData: CVData): Promise<CVData> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const prompt = `You are a professional CV editor and career consultant specializing in high school and undergraduate students applying to European universities.

You will receive structured CV data filled in by a student. Your job is to ENHANCE and PROFESSIONALIZE it while keeping all information truthful.

ENHANCEMENT RULES:

1. SPELLING & GRAMMAR:
   - Fix ALL spelling mistakes in every language (e.g., "ingilzce" → "English", "bilgisyar" → "Computer Science")
   - Correct grammar and punctuation
   - Standardize capitalization (e.g., "python" → "Python", "ieee" → "IEEE")

2. CONTENT ENHANCEMENT:
   - Rewrite bullet points using strong action verbs: Led, Developed, Organized, Achieved, Spearheaded, Implemented, Designed, Analyzed, Founded, Coordinated, Managed
   - Make descriptions concise but impactful
   - Add quantification format where the data supports it (keep existing numbers, don't invent)
   - Transform passive voice to active voice
   - Each bullet should follow: Action Verb + What + Result/Impact
   - Remove filler words and redundancy

3. STRUCTURE & CONSISTENCY:
   - Standardize all date formats to "Mon YYYY" or "YYYY" (e.g., "2022 yaz" → "Jun 2022", "haziran 2025" → "Jun 2025")
   - Standardize location format: "City, Country"
   - Ensure degree names are properly formatted (e.g., "lise" → "High School Diploma", "lisans" → "Bachelor's Degree")
   - Standardize GPA format: keep the scale visible (e.g., "3.8" → "3.8/4.0", "85" → "85/100")
   - Language proficiency should include level: "English (C1 - IELTS 7.0)", "German (B1)", "Turkish (Native)"

4. LANGUAGE:
   - ALL CV content must be in ENGLISH (this is for European university applications)
   - Translate any Turkish content to professional English
   - Institution names: keep original name but can add English context
   - Keep proper nouns as-is (company names, school names)

5. CRITICAL CONSTRAINTS:
   - NEVER invent experiences, skills, awards, or any data not present in the input
   - NEVER add fake numbers or statistics
   - You CAN rephrase and enhance existing descriptions
   - You CAN slightly enrich wording to sound more professional
   - If a field is empty, keep it empty — do NOT fill it with made-up content
   - Preserve the personalInfo exactly (name, email, phone, linkedin, website) — only fix location format

Return the enhanced data in the EXACT same JSON structure. Do not add or remove any fields.

INPUT DATA:
${JSON.stringify(rawData, null, 2)}

Return ONLY valid JSON with the same structure as input. No markdown, no backticks, no explanation.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const enhanced = JSON.parse(text) as CVData;
    // Preserve fields that shouldn't change
    enhanced.personalInfo.fullName = rawData.personalInfo.fullName || enhanced.personalInfo.fullName;
    enhanced.personalInfo.email = rawData.personalInfo.email || enhanced.personalInfo.email;
    enhanced.personalInfo.phone = rawData.personalInfo.phone || enhanced.personalInfo.phone;
    enhanced.personalInfo.linkedin = rawData.personalInfo.linkedin || enhanced.personalInfo.linkedin;
    enhanced.personalInfo.website = rawData.personalInfo.website || enhanced.personalInfo.website;
    enhanced.personalInfo.photo = rawData.personalInfo.photo;
    enhanced.detectedField = rawData.detectedField;
    return enhanced;
  } catch {
    // If parsing fails, return original data unchanged
    return rawData;
  }
}

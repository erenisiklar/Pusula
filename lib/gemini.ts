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

  const prompt = `You are a CV data extraction specialist for high school and undergraduate students applying to European universities.

Analyze the following raw content and extract ALL relevant CV information into structured JSON.

IMPORTANT CONTEXT: These are HIGH SCHOOL STUDENTS or early university students. They may have limited formal work experience. Focus on extracting:
- Academic achievements, GPA, relevant coursework, honors
- Extracurricular activities, clubs, student organizations
- Volunteer work, community service
- School projects, personal projects, competitions
- Awards, scholarships, olympiad results
- Language skills and certifications (IELTS, TOEFL, etc.)
- Sports, arts, music achievements
- Summer programs, workshops, seminars attended
- Any internships or part-time work

Return ONLY valid JSON in this exact structure (no markdown, no backticks):
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "education": [{ "institution": "", "degree": "", "field": "", "gpa": "", "startDate": "", "endDate": "", "highlights": [] }],
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "bullets": [] }],
  "projects": [{ "name": "", "description": "", "technologies": "", "highlights": [] }],
  "skills": { "technical": [], "languages": [], "certifications": [], "other": [] },
  "leadership": [{ "role": "", "organization": "", "period": "", "description": "" }],
  "awards": [{ "title": "", "issuer": "", "date": "", "description": "" }],
  "detectedField": "business" or "engineering" or "other"
}

CRITICAL RULES:
- ONLY extract information explicitly present in the text
- NEVER invent, assume, or hallucinate any data
- If a field has no data, use empty string or empty array
- Translate Turkish content to professional English
- Standardize date formats (e.g., "Sep 2023 - Jun 2025")
- Preserve all quantified achievements
- Set detectedField based on content (user indicated: ${targetField})
- Classify extracurriculars, clubs, volunteer work under "leadership" section
- Classify competitions, olympiads, scholarships under "awards" section

Raw content:
${rawContent}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as CVData;
}

// =============================================
// STEP 2: Generate One-Page CV
// Based on: Harvard OCS, Oxford Careers, Europass standards
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
      ? "Emphasize leadership, teamwork, communication, and analytical skills. Highlight any business competitions, entrepreneurship, or economics-related activities."
      : targetField === "engineering"
        ? "Emphasize technical skills, STEM projects, quantified results, problem-solving. Highlight hackathons, science fairs, coding competitions."
        : "Balance academic and extracurricular achievements. Highlight versatility and intellectual curiosity.";

  const prompt = `You are an expert CV writer following Harvard Office of Career Services and Oxford University Careers Service standards. Generate a ONE-PAGE optimized CV for a HIGH SCHOOL STUDENT applying to European universities.

IMPORTANT: This is for a YOUNG STUDENT, not a professional. Adapt accordingly:
- Education section comes FIRST and is the most prominent
- Extracurriculars and leadership are highly valued
- Projects and competitions matter more than work experience
- Volunteer work and community service are important
- Language skills and certifications are crucial for EU applications

FORMAT RULES (Harvard OCS Standard):
- Name in larger text at top center
- Contact info on one line below name (email | phone | location)
- LinkedIn/website on next line if available
- Section headers in UPPERCASE, bold, with a horizontal line below
- Entries: Organization/School name bold, role/degree italic, date right-aligned
- Use bullet points (- ) with action verbs
- Maximum 1 page — every word must earn its place
- Consistent date format: "Mon YYYY - Mon YYYY" or "Mon YYYY - Present"
- 10-12pt equivalent content density
- 0.5-1 inch margins equivalent spacing

SECTION ORDER (skip empty sections):
1. EDUCATION — School name, degree/program, GPA, honors, relevant coursework
2. EXPERIENCE — If any internships or work (brief)
3. PROJECTS — Academic or personal projects with impact
4. LEADERSHIP & ACTIVITIES — Clubs, organizations, volunteer work
5. AWARDS & HONORS — Competitions, scholarships, recognitions
6. SKILLS — Technical skills, Languages (with proficiency level), Certifications

WRITING STYLE:
- ${fieldGuidance}
- Strong action verbs: Spearheaded, Orchestrated, Developed, Analyzed, Founded, Led, Designed, Implemented, Organized, Achieved
- Quantify impact: numbers, percentages, scale where data supports it
- Native-level professional English — no grammatical errors
- No personal pronouns (I, my, me)
- No "responsible for" — always use action verbs
- Each bullet: Action Verb + What you did + Result/Impact
- Be concise but specific

CRITICAL: Only use provided data. Do NOT invent anything. If limited data, make fewer but stronger points.

DATA:
${JSON.stringify(data, null, 2)}

Output ONLY the CV text, nothing else. No markdown formatting symbols like ** or #.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// =============================================
// STEP 3: Generate Harvard-Style Academic CV
// Based on: Harvard OCS, Oxford Careers, UCAS standards
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
      ? "Emphasize leadership experiences, strategic thinking, team management, and any entrepreneurial activities."
      : targetField === "engineering"
        ? "Emphasize technical projects in detail, research methodology, STEM competitions, and quantified engineering achievements."
        : "Present a comprehensive academic and personal development profile.";

  const prompt = `You are an expert academic CV writer following Harvard University Office of Career Services standards. Generate a HARVARD-STYLE ACADEMIC CV for a HIGH SCHOOL STUDENT applying to European universities.

This CV is MORE DETAILED than the one-page version. It provides a comprehensive view of the student's academic and personal development.

IMPORTANT CONTEXT: This is for a YOUNG STUDENT applying to university:
- Education is paramount — include all academic details
- Show intellectual curiosity through projects and interests
- Demonstrate personal growth through activities
- European universities value well-rounded candidates
- UCAS and Europass standards apply for EU applications

FORMAT RULES (Harvard Academic CV Standard):
- Full name centered at top in larger text
- Contact details on line below (email | phone | location)
- LinkedIn/website on next line if available
- Section headers in UPPERCASE with horizontal line below
- Entries: Institution bold, role/degree italic, dates clearly stated
- More descriptive than one-page CV — 2-4 bullet points per entry
- Formal academic tone throughout
- Consistent formatting and spacing
- Dates aligned to the right of each entry

SECTION ORDER (skip empty sections):
1. EDUCATION
   - Full institution name, program/track, GPA (with scale)
   - Honors, distinctions, dean's list
   - Relevant coursework (if applicable)
   - Academic achievements within school
2. ACADEMIC PROJECTS & RESEARCH
   - Project name, context, methodology
   - Technologies/tools used
   - Results and learning outcomes
3. PROFESSIONAL EXPERIENCE
   - Any internships, part-time work, or formal roles
   - Detailed descriptions with impact
4. EXTRACURRICULAR ACTIVITIES & LEADERSHIP
   - Club memberships with roles
   - Student government, organizations
   - Volunteer work with detailed descriptions
   - Community service and social impact
5. AWARDS, HONORS & COMPETITIONS
   - Academic competitions, olympiads
   - Scholarships and recognitions
   - Rankings and achievements
6. SKILLS & CERTIFICATIONS
   - Technical skills grouped by category
   - Language proficiencies with levels (Native, Fluent, Intermediate, Basic)
   - Professional certifications (IELTS, TOEFL, etc.)
7. ADDITIONAL INFORMATION
   - Hobbies and interests (if relevant and professional)
   - Sports achievements
   - Publications or blog posts (if any)

WRITING STYLE:
- ${fieldGuidance}
- Formal academic English — Harvard standard
- More context than one-page: explain the significance of activities
- Complete sentences for descriptions where appropriate
- Action verbs in past tense for completed activities
- Present tense for ongoing activities
- Show progression and growth over time
- No personal pronouns

CRITICAL: Only use provided data. Do NOT invent anything. Expand on provided details but never fabricate.

DATA:
${JSON.stringify(data, null, 2)}

Output ONLY the CV text, nothing else. No markdown formatting symbols like ** or #.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
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

// =============================================
// MOTIVATION LETTER
// =============================================

export async function generateMotivationLetter(params: {
  studentName: string;
  university: string;
  program: string;
  country: string;
  gpa: number;
  strengths: string;
  motivation: string;
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1500,
    },
  });

  const prompt = `You are an expert European university admissions consultant writing motivation letters for Turkish students applying to European universities. Write compelling, authentic motivation letters in English, approximately 500 words. Be specific and personal, avoid generic phrases.

Write a motivation letter for the following student:

Name: ${params.studentName}
University: ${params.university}
Program: ${params.program}
Country: ${params.country}
GPA: ${params.gpa}/100
Key Strengths: ${params.strengths}
Personal Motivation: ${params.motivation}

Write a professional, compelling motivation letter in English (~500 words). Include:
1. Strong opening paragraph
2. Academic background and achievements
3. Why this specific program and university
4. Career goals and how this program fits
5. Closing with enthusiasm and commitment

Output ONLY the letter text, nothing else.`;

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

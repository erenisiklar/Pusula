-- ============================================
-- Migration: Populate motivation letter fields for universities
-- University-specific motivation letter type, language, guidelines, tone
-- ============================================

-- === HOLLANDA (NL) — Personal statement / motivation letter in English ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Dutch universities typically expect a personal motivation letter explaining why you chose this specific program. Focus on your personal drive, academic interests, and what makes you a good fit. Be authentic and specific — avoid generic statements. Many programs use a matching/selection process where your motivation letter is key.'
WHERE country_code = 'NL' AND level = 'bachelor';

-- TU Delft — numerus fixus, stricter format
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_guidelines = 'TU Delft uses a selection procedure for numerus fixus programs. Your motivation letter should clearly explain: (1) Why you want to study this specific program at TU Delft, (2) What relevant experience or skills you have, (3) How you prepared for this program. Be concrete and evidence-based. The selection committee looks for genuine passion and self-awareness.',
  motivation_max_words = 500,
  motivation_tone_preference = 'academic'
WHERE id LIKE 'tu-delft-bsc%';

-- Erasmus University — specific IBA/Econometrics format
UPDATE universities SET
  motivation_guidelines = 'Erasmus University expects a structured motivation letter. Address: (1) Your motivation for this specific program, (2) Why Erasmus University Rotterdam, (3) Your relevant academic background and achievements, (4) Your career aspirations. For IBA/Econometrics programs, emphasize analytical skills and international orientation.',
  motivation_tone_preference = 'academic'
WHERE id LIKE 'erasmus-bsc%';

-- Maastricht — PBL focus
UPDATE universities SET
  motivation_guidelines = 'Maastricht University uses Problem-Based Learning (PBL). Your motivation letter should demonstrate: (1) Why you are drawn to the PBL approach, (2) Your ability to work in small groups and take initiative, (3) Why this specific program, (4) Your international mindset. Show that you thrive in collaborative, self-directed learning environments.'
WHERE id LIKE 'maastricht-bsc%';

-- === ALMANYA (DE) — Motivation letter, often in English or German ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'academic',
  motivation_max_words = 750,
  motivation_guidelines = 'German universities value a structured, academically-focused motivation letter. Explain: (1) Your academic background and why this field interests you, (2) Why this specific university and program, (3) Your career goals and how this program helps achieve them. German admissions committees appreciate thoroughness, logical structure, and concrete examples over emotional appeals.'
WHERE country_code = 'DE' AND level = 'bachelor';

-- TU München — research-oriented
UPDATE universities SET
  motivation_tone_preference = 'research_focused',
  motivation_guidelines = 'TU Munich expects a well-structured motivation letter focused on academic excellence. Address: (1) Your strong academic foundation and relevant coursework, (2) Specific aspects of the TUM program that attract you (mention research groups, labs, or courses), (3) Your technical skills and projects, (4) Long-term career goals in technology/research. TUM values innovation, entrepreneurial spirit, and scientific rigor.'
WHERE id LIKE 'tum-bsc%';

-- RWTH Aachen
UPDATE universities SET
  motivation_guidelines = 'RWTH Aachen values practical engineering mindset combined with theoretical depth. Your motivation letter should highlight: (1) Your passion for engineering/technology, (2) Relevant projects, competitions, or hands-on experience, (3) Why RWTH specifically — mention its industry connections and research excellence, (4) Career goals in engineering or research.'
WHERE id LIKE 'rwth-bsc%';

-- Jacobs University — international, English-taught
UPDATE universities SET
  motivation_guidelines = 'Jacobs University Bremen is a private, international university. Your motivation letter should reflect: (1) Why you want an international, English-taught education, (2) Your academic interests and achievements, (3) How you will contribute to the diverse campus community, (4) Career goals. Jacobs values diversity, intercultural competence, and academic curiosity.',
  motivation_max_words = 500
WHERE id LIKE 'jacobs-bsc%';

-- === İTALYA (IT) — Motivation letter in English, personal/project focused ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Italian universities generally expect a motivation letter that combines personal passion with academic purpose. Explain: (1) Why you chose this field of study, (2) Your relevant background and achievements, (3) Why Italy and this specific university, (4) Your future plans. Italian admissions appreciate genuine enthusiasm and cultural awareness.'
WHERE country_code = 'IT' AND level = 'bachelor';

-- Bocconi — highly competitive, structured
UPDATE universities SET
  motivation_tone_preference = 'academic',
  motivation_max_words = 600,
  motivation_guidelines = 'Bocconi University has a highly competitive selection process. Your motivation letter must demonstrate: (1) Strong analytical and leadership potential, (2) Why Bocconi specifically — mention its reputation in economics/business, international network, Milan location, (3) Concrete achievements (academic, extracurricular, leadership), (4) Clear career vision. Bocconi looks for driven, ambitious students with global perspective. Avoid generic statements — be specific about what sets you apart.'
WHERE id LIKE 'bocconi-bsc%';

-- Politecnico di Milano — project/portfolio focused
UPDATE universities SET
  motivation_tone_preference = 'project_focused',
  motivation_guidelines = 'Politecnico di Milano values technical aptitude and creative problem-solving. Your motivation letter should highlight: (1) Your technical skills and relevant projects, (2) Why PoliMi — mention specific labs, research areas, or the TOL test preparation, (3) Hands-on experience (competitions, maker projects, coding), (4) Career goals in engineering/design. PoliMi appreciates students who show initiative and practical skills.'
WHERE id LIKE 'polimi-bsc%';

-- === İNGİLTERE (GB) — Personal statement (UCAS style) ===
UPDATE universities SET
  motivation_letter_type = 'personal_statement',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 4000, -- UCAS counts characters (47 lines / 4000 chars)
  motivation_guidelines = 'UK universities use the UCAS Personal Statement format. This is NOT a traditional motivation letter — it is a personal essay about YOU and your passion for the subject. Structure: (1) Opening hook — why this subject fascinates you, (2) Academic engagement — books, courses, research you have explored beyond school, (3) Relevant experience — work experience, projects, competitions, (4) Skills and qualities — what makes you suited for university study, (5) Brief conclusion. IMPORTANT: Do NOT address a specific university (the same statement goes to all 5 UCAS choices). Focus 75% on academics, 25% on extracurriculars. Show intellectual curiosity and independent thinking.'
WHERE country_code = 'GB' AND level = 'bachelor';

-- Cambridge/Oxford — super academic
UPDATE universities SET
  motivation_tone_preference = 'academic',
  motivation_guidelines = 'For Oxbridge applications, the UCAS Personal Statement must be overwhelmingly academic (80-90%). Demonstrate: (1) Deep intellectual curiosity — what have you read, researched, or explored beyond the curriculum?, (2) Critical thinking — discuss ideas, not just facts, (3) Academic achievements and subject-specific competitions, (4) Relevant super-curricular activities (lectures, MOOCs, research). Keep extracurriculars minimal. The admissions tutors want to see a student who genuinely loves learning and can engage with complex ideas independently.'
WHERE id IN ('cambridge-ba-economics', 'oxford-ba-em');

-- LSE — analytical focus
UPDATE universities SET
  motivation_guidelines = 'LSE Personal Statement should emphasize analytical thinking and global awareness. Demonstrate: (1) Deep interest in social sciences/economics — reference current events, research papers, or books, (2) Analytical skills — how you approach complex problems, (3) Relevant experience in economics/business/social impact, (4) Understanding of LSE''s research-intensive approach. LSE values students who can think critically about real-world issues.'
WHERE id = 'lse-bsc-economics';

-- Imperial — technical depth
UPDATE universities SET
  motivation_tone_preference = 'research_focused',
  motivation_guidelines = 'Imperial College Personal Statement should be heavily technical. Focus on: (1) Your passion for computing/engineering — specific projects, code, or technical challenges, (2) Problem-solving examples, (3) Mathematics and science achievements, (4) Technical competitions (olympiads, hackathons). Imperial wants evidence of hands-on technical ability and genuine enthusiasm for STEM. Keep non-academic content minimal.'
WHERE id = 'imperial-bsc-cs';

-- === İSVEÇ (SE) — Motivation letter in English ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Swedish universities value a clear, concise motivation letter. Explain: (1) Why you are interested in this program, (2) Your relevant background, (3) What you hope to gain, (4) How it fits your future plans. Swedish culture values equality and humility — be confident but not boastful. Show genuine interest rather than listing achievements.'
WHERE country_code = 'SE' AND level = 'bachelor';

-- === DANİMARKA (DK) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Danish universities expect a straightforward motivation letter. Address: (1) Why this specific program, (2) Your academic background and relevant skills, (3) Career goals. Danish academic culture is egalitarian — write naturally and authentically, avoid being overly formal or grandiose.'
WHERE country_code = 'DK' AND level = 'bachelor';

-- CBS — business specific
UPDATE universities SET
  motivation_guidelines = 'Copenhagen Business School expects a professional motivation letter. Highlight: (1) Your interest in international business, (2) Relevant experience or academic background, (3) Why CBS specifically — mention its Scandinavian approach to business, sustainability focus, or Copenhagen''s startup scene, (4) Career aspirations. CBS values innovation, sustainability awareness, and international outlook.'
WHERE id = 'cbs-bsc-business';

-- === İSPANYA (ES) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Spanish private universities value a personal, enthusiastic motivation letter. Show: (1) Why you chose this program, (2) Your achievements and skills, (3) Why Spain/this city, (4) Career goals. Spanish academic culture appreciates warmth and personality in your writing.'
WHERE country_code = 'ES' AND level = 'bachelor';

-- IE University — innovation focused
UPDATE universities SET
  motivation_guidelines = 'IE University values entrepreneurial spirit and innovation. Your motivation letter should demonstrate: (1) Leadership and initiative examples, (2) Entrepreneurial mindset or startup interest, (3) Why IE specifically — mention its focus on innovation, Madrid/Segovia campus, diverse community, (4) How you plan to make an impact. IE looks for future leaders who think differently.',
  motivation_tone_preference = 'personal'
WHERE id LIKE 'ie-bsc%';

-- === İRLANDA (IE) ===
UPDATE universities SET
  motivation_letter_type = 'personal_statement',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Irish universities typically require a personal statement. Explain: (1) Your motivation for this subject, (2) Relevant academic and extracurricular experience, (3) Why Ireland and this university, (4) Your goals. Irish universities value well-rounded students — show both academic ability and personal qualities.'
WHERE country_code = 'IE' AND level = 'bachelor';

-- === AVUSTURYA (AT) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'academic',
  motivation_max_words = 500,
  motivation_guidelines = 'Austrian universities expect a formal, well-structured motivation letter. Address: (1) Your academic background and achievements, (2) Why this specific program, (3) Career goals. Austrian academic tradition values precision and thoroughness.'
WHERE country_code = 'AT' AND level = 'bachelor';

-- === ÇEKİYA (CZ) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'academic',
  motivation_max_words = 500,
  motivation_guidelines = 'Czech universities value a clear, academically-focused motivation letter. Explain: (1) Why this field interests you, (2) Your academic preparation, (3) Why Prague/this university, (4) Future plans. Keep it professional and focused on your academic goals.'
WHERE country_code = 'CZ' AND level = 'bachelor';

-- === MACARİSTAN (HU) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Hungarian universities expect a motivation letter that shows genuine interest. Address: (1) Why you chose this program, (2) Your academic background, (3) Why Budapest/Hungary, (4) Career goals. Be authentic and specific about what draws you to study here.'
WHERE country_code = 'HU' AND level = 'bachelor';

-- === FİNLANDİYA (FI) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Finnish universities value a concise, honest motivation letter. Explain: (1) Your interest in the field, (2) Relevant skills and experience, (3) Why Finland, (4) Future goals. Finnish culture values humility and sincerity — be direct and genuine, avoid exaggeration.'
WHERE country_code = 'FI' AND level = 'bachelor';

-- === BELÇİKA (BE) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'academic',
  motivation_max_words = 500,
  motivation_guidelines = 'Belgian universities expect a well-organized motivation letter. Address: (1) Academic motivation and background, (2) Why this specific program, (3) Relevant experience, (4) Career perspective. Belgian universities appreciate structured, clear writing with concrete examples.'
WHERE country_code = 'BE' AND level = 'bachelor';

-- === İSVİÇRE (CH) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'academic',
  motivation_max_words = 500,
  motivation_guidelines = 'Swiss universities value precision and quality in motivation letters. Focus on: (1) Your strong academic foundation, (2) Why this specific program and university, (3) Research or project experience, (4) Career goals. Swiss academic culture values excellence, multilingualism, and innovation.'
WHERE country_code = 'CH' AND level = 'bachelor';

-- === PORTEKİZ (PT) ===
UPDATE universities SET
  motivation_letter_type = 'motivation_letter',
  motivation_language = 'en',
  motivation_tone_preference = 'personal',
  motivation_max_words = 500,
  motivation_guidelines = 'Portuguese universities appreciate a warm, personal motivation letter. Explain: (1) Your passion for the subject, (2) Academic background, (3) Why Portugal and this university, (4) Future aspirations. Show genuine enthusiasm and cultural curiosity.'
WHERE country_code = 'PT' AND level = 'bachelor';

-- === ESADE (Spain) — Statement of Purpose style ===
UPDATE universities SET
  motivation_letter_type = 'statement_of_purpose',
  motivation_guidelines = 'ESADE expects a statement of purpose that demonstrates business acumen and leadership. Highlight: (1) Leadership experiences and impact, (2) Why business/management, (3) Why ESADE — mention its reputation, Barcelona location, and values-driven approach, (4) Clear career trajectory. ESADE looks for future business leaders with strong ethical compass.',
  motivation_tone_preference = 'academic'
WHERE id = 'esade-bba';

-- Also update master programs with defaults
UPDATE universities SET
  motivation_letter_type = COALESCE(motivation_letter_type, 'motivation_letter'),
  motivation_language = COALESCE(motivation_language, 'en'),
  motivation_tone_preference = COALESCE(motivation_tone_preference, 'academic')
WHERE level = 'master' AND motivation_letter_type IS NULL;

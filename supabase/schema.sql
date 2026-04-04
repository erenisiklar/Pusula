-- ============================================
-- Pusula — Supabase Schema
-- Tüm tablolar ve kolonlar
-- ============================================

-- Üniversiteler tablosu (tam)
create table if not exists universities (
  id text primary key,
  name text not null,
  country text not null,
  country_code text not null,
  city text not null,
  program text not null,
  department text not null,
  level text not null default 'master', -- 'bachelor' | 'master'
  required_gpa int not null,
  required_language text not null,
  required_language_score text not null,
  accepted_languages jsonb default '[]'::jsonb, -- [{test, minScore}]
  tuition_eur int not null default 0,
  flag text not null,
  deadline text,
  rankings jsonb default '[]'::jsonb, -- [{source, rank, year}]
  acceptance_rate int, -- 0-100
  competitiveness text, -- 'very_high' | 'high' | 'medium' | 'low'
  data_verified boolean default false,
  program_restricted boolean default false,
  -- Motivation letter fields
  motivation_letter_type text default 'motivation_letter', -- 'motivation_letter' | 'personal_statement' | 'statement_of_purpose' | 'cover_letter'
  motivation_language text, -- preferred letter language: 'en' | 'de' | 'fr' | 'it' | 'nl'
  motivation_guidelines text, -- university-specific guidelines/questions
  motivation_tone_preference text, -- 'academic' | 'personal' | 'research_focused' | 'project_focused'
  motivation_max_words int, -- university's word/character limit if known
  -- Map & display fields
  lat double precision,
  lng double precision,
  image_url text,
  website text,
  duration_years int,
  country_color text,
  description text
);

-- Kabul istatistikleri tablosu
create table if not exists acceptance_stats (
  id serial primary key,
  university_id text references universities(id) on delete cascade,
  acceptance_rate int not null,
  total_applicants int not null,
  avg_gpa numeric(3,1) not null,
  trend int not null default 0,
  unique(university_id)
);

-- İndeksler
create index if not exists idx_universities_country on universities(country);
create index if not exists idx_universities_level on universities(level);
create index if not exists idx_universities_department on universities(department);
create index if not exists idx_acceptance_stats_uni on acceptance_stats(university_id);

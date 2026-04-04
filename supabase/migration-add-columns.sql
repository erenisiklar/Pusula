-- ============================================
-- Migration: Add missing columns to universities table
-- Run this if you already have the old schema
-- ============================================

-- Add new columns (IF NOT EXISTS equivalent via DO block)
DO $$
BEGIN
  -- level column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'level') THEN
    ALTER TABLE universities ADD COLUMN level text NOT NULL DEFAULT 'master';
  END IF;

  -- accepted_languages (JSONB)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'accepted_languages') THEN
    ALTER TABLE universities ADD COLUMN accepted_languages jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- rankings (JSONB)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'rankings') THEN
    ALTER TABLE universities ADD COLUMN rankings jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- acceptance_rate
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'acceptance_rate') THEN
    ALTER TABLE universities ADD COLUMN acceptance_rate int;
  END IF;

  -- competitiveness
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'competitiveness') THEN
    ALTER TABLE universities ADD COLUMN competitiveness text;
  END IF;

  -- data_verified
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'data_verified') THEN
    ALTER TABLE universities ADD COLUMN data_verified boolean DEFAULT false;
  END IF;

  -- program_restricted
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'program_restricted') THEN
    ALTER TABLE universities ADD COLUMN program_restricted boolean DEFAULT false;
  END IF;

  -- lat/lng (may already exist from update-map-data.sql)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'lat') THEN
    ALTER TABLE universities ADD COLUMN lat double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'lng') THEN
    ALTER TABLE universities ADD COLUMN lng double precision;
  END IF;

  -- image_url, website, duration_years, country_color (may already exist)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'image_url') THEN
    ALTER TABLE universities ADD COLUMN image_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'website') THEN
    ALTER TABLE universities ADD COLUMN website text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'duration_years') THEN
    ALTER TABLE universities ADD COLUMN duration_years int;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'country_color') THEN
    ALTER TABLE universities ADD COLUMN country_color text;
  END IF;

  -- description
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'description') THEN
    ALTER TABLE universities ADD COLUMN description text;
  END IF;

  -- motivation_letter_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'motivation_letter_type') THEN
    ALTER TABLE universities ADD COLUMN motivation_letter_type text DEFAULT 'motivation_letter';
  END IF;

  -- motivation_language
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'motivation_language') THEN
    ALTER TABLE universities ADD COLUMN motivation_language text;
  END IF;

  -- motivation_guidelines
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'motivation_guidelines') THEN
    ALTER TABLE universities ADD COLUMN motivation_guidelines text;
  END IF;

  -- motivation_tone_preference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'motivation_tone_preference') THEN
    ALTER TABLE universities ADD COLUMN motivation_tone_preference text;
  END IF;

  -- motivation_max_words
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'universities' AND column_name = 'motivation_max_words') THEN
    ALTER TABLE universities ADD COLUMN motivation_max_words int;
  END IF;
END $$;

-- Add unique constraint to acceptance_stats if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'acceptance_stats_university_id_key') THEN
    ALTER TABLE acceptance_stats ADD CONSTRAINT acceptance_stats_university_id_key UNIQUE (university_id);
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
CREATE INDEX IF NOT EXISTS idx_universities_level ON universities(level);
CREATE INDEX IF NOT EXISTS idx_universities_department ON universities(department);
CREATE INDEX IF NOT EXISTS idx_acceptance_stats_uni ON acceptance_stats(university_id);

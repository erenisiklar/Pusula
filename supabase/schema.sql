-- Üniversiteler tablosu
create table if not exists universities (
  id text primary key,
  name text not null,
  country text not null,
  country_code text not null,
  city text not null,
  program text not null,
  department text not null,
  required_gpa int not null,
  required_language text not null,
  required_language_score text not null,
  tuition_eur int not null default 0,
  flag text not null,
  deadline text
);

-- Kabul istatistikleri tablosu
create table if not exists acceptance_stats (
  id serial primary key,
  university_id text references universities(id) on delete cascade,
  acceptance_rate int not null,
  total_applicants int not null,
  avg_gpa numeric(3,1) not null,
  trend int not null default 0
);

-- Seed: Üniversiteler
insert into universities (id, name, country, country_code, city, program, department, required_gpa, required_language, required_language_score, tuition_eur, flag, deadline) values
  ('tu-delft-cs',        'TU Delft',                  'Hollanda', 'NL', 'Delft',     'Computer Science',              'Bilgisayar Mühendisliği',          72, 'IELTS', '6.5', 2209,  '🇳🇱', '1 Nisan'),
  ('tu-delft-arch',      'TU Delft',                  'Hollanda', 'NL', 'Delft',     'Architecture',                  'Mimarlık',                          70, 'IELTS', '6.5', 2209,  '🇳🇱', '1 Nisan'),
  ('groningen-business', 'University of Groningen',   'Hollanda', 'NL', 'Groningen', 'International Business',        'İşletme',                           62, 'IELTS', '6.0', 2209,  '🇳🇱', '1 Mayıs'),
  ('polimi-cs',          'Politecnico di Milano',     'İtalya',   'IT', 'Milano',    'Computer Science & Engineering','Bilgisayar Mühendisliği',           70, 'IELTS', '6.0', 3000,  '🇮🇹', 'Şubat (erken), Nisan (geç)'),
  ('polimi-arch',        'Politecnico di Milano',     'İtalya',   'IT', 'Milano',    'Architecture',                  'Mimarlık',                          72, 'IELTS', '6.5', 3500,  '🇮🇹', 'Mart'),
  ('bocconi-economics',  'Bocconi University',        'İtalya',   'IT', 'Milano',    'Economics',                     'Ekonomi',                           82, 'IELTS', '7.0', 14500, '🇮🇹', 'Ocak (erken), Nisan (geç)'),
  ('bologna-eng',        'University of Bologna',     'İtalya',   'IT', 'Bologna',   'Engineering',                   'Mühendislik',                       65, 'IELTS', '5.5', 2900,  '🇮🇹', 'Mayıs'),
  ('tum-cs',             'TU München',                'Almanya',  'DE', 'Münih',     'Computer Science',              'Bilgisayar Mühendisliği',           78, 'IELTS', '6.5', 0,     '🇩🇪', '31 Mayıs'),
  ('tum-ee',             'TU München',                'Almanya',  'DE', 'Münih',     'Electrical Engineering',        'Elektrik-Elektronik Mühendisliği',  75, 'TestDaF', '4', 0,   '🇩🇪', '31 Mayıs'),
  ('lmu-business',       'LMU München',               'Almanya',  'DE', 'Münih',     'Business Administration',       'İşletme',                           70, 'TestDaF', '4', 0,   '🇩🇪', '15 Temmuz'),
  ('rwth-aachen',        'RWTH Aachen',               'Almanya',  'DE', 'Aachen',    'Mechanical Engineering',        'Makine Mühendisliği',               72, 'TestDaF', '4', 0,   '🇩🇪', '1 Mart'),
  ('sciences-po',        'Sciences Po',               'Fransa',   'FR', 'Paris',     'Political Science',             'Siyaset Bilimi',                    85, 'IELTS', '7.0', 14000, '🇫🇷', 'Şubat'),
  ('essec',              'ESSEC Business School',     'Fransa',   'FR', 'Paris',     'Business Administration',       'İşletme',                           80, 'IELTS', '6.5', 16000, '🇫🇷', 'Nisan'),
  ('ie-university',      'IE University',             'İspanya',  'ES', 'Madrid',    'International Relations',       'Uluslararası İlişkiler',            70, 'IELTS', '6.5', 18000, '🇪🇸', 'Haziran'),
  ('kth-stockholm',      'KTH Royal Institute',       'İsveç',    'SE', 'Stockholm', 'Engineering',                   'Mühendislik',                       75, 'IELTS', '6.5', 13500, '🇸🇪', '15 Ocak')
on conflict (id) do nothing;

-- Seed: Kabul istatistikleri
insert into acceptance_stats (university_id, acceptance_rate, total_applicants, avg_gpa, trend) values
  ('tu-delft-cs',        25, 3200, 3.4, -2),
  ('tu-delft-arch',      20, 1800, 3.5, -1),
  ('groningen-business', 48, 2100, 3.0,  3),
  ('polimi-cs',          28, 4200, 3.3, -3),
  ('polimi-arch',        22, 2400, 3.4,  0),
  ('bocconi-economics',  13, 6800, 3.7, -2),
  ('bologna-eng',        58, 2800, 2.9,  2),
  ('tum-cs',             14, 5100, 3.6, -1),
  ('tum-ee',             17, 3400, 3.5,  0),
  ('lmu-business',       26, 3800, 3.2,  1),
  ('rwth-aachen',        32, 2700, 3.2, -2),
  ('sciences-po',         9, 9200, 3.8, -1),
  ('essec',              11, 7400, 3.7,  0),
  ('ie-university',      38, 2900, 3.1,  4),
  ('kth-stockholm',      34, 2200, 3.3, -2)
on conflict do nothing;

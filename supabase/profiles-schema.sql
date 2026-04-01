-- Profil tablosu
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  gpa int,
  language text,
  language_score text,
  budget int,
  created_at timestamptz default now()
);

-- Row Level Security: herkes sadece kendi profilini görebilir/düzenleyebilir
alter table profiles enable row level security;

create policy "Kullanıcı kendi profilini okuyabilir"
  on profiles for select
  using (auth.uid() = id);

create policy "Kullanıcı kendi profilini oluşturabilir"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on profiles for update
  using (auth.uid() = id);

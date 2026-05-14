-- ============================================================
-- MENTORIA APP — Supabase Schema (idempotente — se puede re-ejecutar)
-- ============================================================

-- 1. Extensiones
create extension if not exists "uuid-ossp";

-- 2. Enums (IF NOT EXISTS via bloque DO)
do $$ begin
  create type user_role as enum ('admin', 'mentor', 'apprentice');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type session_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

-- 3. Tabla profiles
create table if not exists public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  role                  user_role not null default 'apprentice',
  full_name             text not null default '',
  avatar_url            text,
  bio                   text,
  timezone              text not null default 'America/Lima',
  google_calendar_token jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- 4. Tabla mentor_profiles
create table if not exists public.mentor_profiles (
  id               uuid primary key references public.profiles(id) on delete cascade,
  specialties      text[] not null default '{}',
  experience_years int not null default 0,
  linkedin_url     text,
  availability     jsonb not null default '{}',
  is_active        boolean not null default true,
  avg_rating       numeric(3,2) not null default 0,
  session_count    int not null default 0,
  created_at       timestamptz not null default now()
);

-- 5. Tabla sessions
create table if not exists public.sessions (
  id                uuid primary key default uuid_generate_v4(),
  mentor_id         uuid not null references public.profiles(id) on delete cascade,
  apprentice_id     uuid not null references public.profiles(id) on delete cascade,
  title             text not null,
  description       text,
  scheduled_at      timestamptz not null,
  duration_minutes  int not null default 60,
  status            session_status not null default 'pending',
  meet_url          text,
  calendar_event_id text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 6. Tabla feedback
create table if not exists public.feedback (
  id          uuid primary key default uuid_generate_v4(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating      int not null check (rating >= 1 and rating <= 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique(session_id, reviewer_id)
);

-- 7. Índices
create index if not exists idx_sessions_mentor         on public.sessions(mentor_id);
create index if not exists idx_sessions_apprentice     on public.sessions(apprentice_id);
create index if not exists idx_sessions_scheduled_at   on public.sessions(scheduled_at);
create index if not exists idx_mentor_profiles_specs   on public.mentor_profiles using gin(specialties);
create index if not exists idx_feedback_reviewee       on public.feedback(reviewee_id);

-- 8. Función y trigger: updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace trigger trg_sessions_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

-- 9. Trigger: crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 10. Trigger: actualizar rating del mentor al insertar feedback
create or replace function public.update_mentor_rating()
returns trigger language plpgsql as $$
declare
  v_mentor_id uuid;
begin
  select mentor_id into v_mentor_id from public.sessions where id = new.session_id;
  update public.mentor_profiles
  set
    avg_rating = (
      select coalesce(avg(rating), 0)
      from public.feedback
      where reviewee_id = v_mentor_id
    ),
    session_count = (
      select count(*)
      from public.sessions
      where mentor_id = v_mentor_id and status = 'completed'
    )
  where id = v_mentor_id;
  return new;
end;
$$;

create or replace trigger trg_feedback_update_rating
  after insert or update on public.feedback
  for each row execute function public.update_mentor_rating();

-- 11. Row Level Security
alter table public.profiles       enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.sessions        enable row level security;
alter table public.feedback        enable row level security;

-- Policies — se eliminan antes de recrear para evitar conflictos
drop policy if exists "Profiles son visibles por todos"    on public.profiles;
drop policy if exists "Usuarios editan su propio perfil"   on public.profiles;
drop policy if exists "Mentor profiles visibles por todos" on public.mentor_profiles;
drop policy if exists "Mentores crean su perfil"           on public.mentor_profiles;
drop policy if exists "Mentores editan su perfil"          on public.mentor_profiles;
drop policy if exists "Participantes ven sus sesiones"     on public.sessions;
drop policy if exists "Admins ven todas las sesiones"      on public.sessions;
drop policy if exists "Aprendices crean sesiones"          on public.sessions;
drop policy if exists "Participantes actualizan sesiones"  on public.sessions;
drop policy if exists "Feedback visible por todos"         on public.feedback;
drop policy if exists "Participantes dejan feedback en sesiones completadas" on public.feedback;

-- Profiles
create policy "Profiles son visibles por todos"
  on public.profiles for select using (true);

create policy "Usuarios editan su propio perfil"
  on public.profiles for update using (auth.uid() = id);

-- Mentor profiles
create policy "Mentor profiles visibles por todos"
  on public.mentor_profiles for select using (true);

create policy "Mentores crean su perfil"
  on public.mentor_profiles for insert with check (auth.uid() = id);

create policy "Mentores editan su perfil"
  on public.mentor_profiles for update using (auth.uid() = id);

-- Sessions
create policy "Participantes ven sus sesiones"
  on public.sessions for select
  using (auth.uid() = mentor_id or auth.uid() = apprentice_id);

create policy "Admins ven todas las sesiones"
  on public.sessions for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Aprendices crean sesiones"
  on public.sessions for insert
  with check (auth.uid() = apprentice_id);

create policy "Participantes actualizan sesiones"
  on public.sessions for update
  using (auth.uid() = mentor_id or auth.uid() = apprentice_id);

-- Feedback
create policy "Feedback visible por todos"
  on public.feedback for select using (true);

create policy "Participantes dejan feedback en sesiones completadas"
  on public.feedback for insert
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.sessions
      where id = session_id
        and (mentor_id = auth.uid() or apprentice_id = auth.uid())
        and status = 'completed'
    )
  );

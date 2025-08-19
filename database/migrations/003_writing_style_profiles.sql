-- 003_writing_style_profiles.sql
create table if not exists public.writing_style_profiles (
	id bigserial primary key,
	user_id uuid not null,
	profile_data jsonb not null default '{}',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

drop trigger if exists trg_wsp_updated_at on public.writing_style_profiles;
create trigger trg_wsp_updated_at
before update on public.writing_style_profiles
for each row execute function public.set_updated_at();

alter table public.writing_style_profiles enable row level security;

DROP POLICY IF EXISTS wsp_select_own ON public.writing_style_profiles;
CREATE POLICY wsp_select_own ON public.writing_style_profiles
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS wsp_insert_own ON public.writing_style_profiles;
CREATE POLICY wsp_insert_own ON public.writing_style_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS wsp_update_own ON public.writing_style_profiles;
CREATE POLICY wsp_update_own ON public.writing_style_profiles
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS wsp_delete_own ON public.writing_style_profiles;
CREATE POLICY wsp_delete_own ON public.writing_style_profiles
FOR DELETE USING (auth.uid() = user_id); 
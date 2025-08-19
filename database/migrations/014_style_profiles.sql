-- 014_style_profiles.sql
-- Create style_profiles table to anchor style engine artifacts

create table if not exists public.style_profiles (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	name varchar(200) not null default 'Default',
	status varchar(50) not null default 'active',
	active_version_id uuid null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_style_profiles_updated_at ON public.style_profiles;
CREATE TRIGGER trg_style_profiles_updated_at
	BEFORE UPDATE ON public.style_profiles
	FOR EACH ROW
	EXECUTE FUNCTION public.set_updated_at();

-- RLS
alter table public.style_profiles enable row level security;

DROP POLICY IF EXISTS sp_select_own ON public.style_profiles;
CREATE POLICY sp_select_own ON public.style_profiles
	FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS sp_insert_own ON public.style_profiles;
CREATE POLICY sp_insert_own ON public.style_profiles
	FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS sp_update_own ON public.style_profiles;
CREATE POLICY sp_update_own ON public.style_profiles
	FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS sp_delete_own ON public.style_profiles;
CREATE POLICY sp_delete_own ON public.style_profiles
	FOR DELETE USING (auth.uid() = user_id);

-- Optional: grant to service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.style_profiles TO service_role; 
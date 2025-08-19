-- 015_style_profile_versions.sql
-- Historical versions for style profiles (kernel and thresholds)

create table if not exists public.style_profile_versions (
	id uuid primary key default gen_random_uuid(),
	style_profile_id uuid not null references public.style_profiles(id) on delete cascade,
	version integer not null,
	kernel_json jsonb not null default '{}',
	thresholds_json jsonb not null default '{}',
	created_at timestamptz not null default now()
);

-- Unique per profile/version number
create unique index if not exists idx_spv_profile_version on public.style_profile_versions(style_profile_id, version);

-- RLS
alter table public.style_profile_versions enable row level security;

DROP POLICY IF EXISTS spv_select_own ON public.style_profile_versions;
CREATE POLICY spv_select_own ON public.style_profile_versions
	FOR SELECT USING (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS spv_insert_own ON public.style_profile_versions;
CREATE POLICY spv_insert_own ON public.style_profile_versions
	FOR INSERT WITH CHECK (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS spv_update_own ON public.style_profile_versions;
CREATE POLICY spv_update_own ON public.style_profile_versions
	FOR UPDATE USING (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	) WITH CHECK (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS spv_delete_own ON public.style_profile_versions;
CREATE POLICY spv_delete_own ON public.style_profile_versions
	FOR DELETE USING (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

-- Grant to service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.style_profile_versions TO service_role; 
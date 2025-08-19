-- 019_style_runs.sql
-- Log each generation run with inputs, outputs, and judge score

create table if not exists public.style_runs (
	id uuid primary key default gen_random_uuid(),
	style_profile_version_id uuid not null references public.style_profile_versions(id) on delete cascade,
	task text not null,
	input_json jsonb not null default '{}',
	output_text text,
	score numeric(4,3), -- 0.000 - 1.000
	passed boolean not null default false,
	created_at timestamptz not null default now()
);

create index if not exists idx_style_runs_version on public.style_runs(style_profile_version_id);
create index if not exists idx_style_runs_created_at on public.style_runs(created_at);

alter table public.style_runs enable row level security;

-- Ownership via version → profile.user_id
DROP POLICY IF EXISTS style_runs_select_own ON public.style_runs;
CREATE POLICY style_runs_select_own ON public.style_runs
	FOR SELECT USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_runs_insert_own ON public.style_runs;
CREATE POLICY style_runs_insert_own ON public.style_runs
	FOR INSERT WITH CHECK (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_runs_update_own ON public.style_runs;
CREATE POLICY style_runs_update_own ON public.style_runs
	FOR UPDATE USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	) WITH CHECK (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_runs_delete_own ON public.style_runs;
CREATE POLICY style_runs_delete_own ON public.style_runs
	FOR DELETE USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.style_runs TO service_role; 
-- 018_style_lexicon.sql
-- Preferred/banned terms and synonyms map derived from corpus

create table if not exists public.style_lexicon (
	id uuid primary key default gen_random_uuid(),
	style_profile_version_id uuid not null references public.style_profile_versions(id) on delete cascade,
	preferred_terms jsonb not null default '[]',
	banned_terms jsonb not null default '[]',
	synonyms_map jsonb not null default '{}',
	created_at timestamptz not null default now()
);

create index if not exists idx_style_lexicon_version on public.style_lexicon(style_profile_version_id);

alter table public.style_lexicon enable row level security;

-- Ownership via version → profile.user_id
DROP POLICY IF EXISTS style_lexicon_select_own ON public.style_lexicon;
CREATE POLICY style_lexicon_select_own ON public.style_lexicon
	FOR SELECT USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_lexicon_insert_own ON public.style_lexicon;
CREATE POLICY style_lexicon_insert_own ON public.style_lexicon
	FOR INSERT WITH CHECK (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_lexicon_update_own ON public.style_lexicon;
CREATE POLICY style_lexicon_update_own ON public.style_lexicon
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

DROP POLICY IF EXISTS style_lexicon_delete_own ON public.style_lexicon;
CREATE POLICY style_lexicon_delete_own ON public.style_lexicon
	FOR DELETE USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.style_lexicon TO service_role; 
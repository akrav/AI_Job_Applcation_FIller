-- 017_style_exemplars.sql
-- Short, high-signal sentences used for few-shot prompting

create table if not exists public.style_exemplars (
	id uuid primary key default gen_random_uuid(),
	style_profile_version_id uuid not null references public.style_profile_versions(id) on delete cascade,
	text text not null,
	word_count integer not null,
	source_document_id uuid references public.style_documents(id) on delete set null,
	created_at timestamptz not null default now()
);

create index if not exists idx_style_exemplars_version on public.style_exemplars(style_profile_version_id);
create index if not exists idx_style_exemplars_source_doc on public.style_exemplars(source_document_id);

alter table public.style_exemplars enable row level security;

-- Policies derive ownership via joined style_profile_versions -> style_profiles.user_id
DROP POLICY IF EXISTS style_exemplars_select_own ON public.style_exemplars;
CREATE POLICY style_exemplars_select_own ON public.style_exemplars
	FOR SELECT USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_exemplars_insert_own ON public.style_exemplars;
CREATE POLICY style_exemplars_insert_own ON public.style_exemplars
	FOR INSERT WITH CHECK (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_exemplars_update_own ON public.style_exemplars;
CREATE POLICY style_exemplars_update_own ON public.style_exemplars
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

DROP POLICY IF EXISTS style_exemplars_delete_own ON public.style_exemplars;
CREATE POLICY style_exemplars_delete_own ON public.style_exemplars
	FOR DELETE USING (
		exists (
			select 1
			from public.style_profile_versions v
			join public.style_profiles sp on sp.id = v.style_profile_id
			where v.id = style_profile_version_id and sp.user_id = auth.uid()
		)
	);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.style_exemplars TO service_role; 
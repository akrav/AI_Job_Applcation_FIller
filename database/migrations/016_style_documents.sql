-- 016_style_documents.sql
-- Store metadata for uploaded corpus/source files tied to a style profile

create table if not exists public.style_documents (
	id uuid primary key default gen_random_uuid(),
	style_profile_id uuid not null references public.style_profiles(id) on delete cascade,
	file_name text not null,
	mime_type text not null,
	bytes_url text not null,
	text_chars text,
	created_at timestamptz not null default now()
);

create index if not exists idx_style_documents_profile on public.style_documents(style_profile_id);

alter table public.style_documents enable row level security;

DROP POLICY IF EXISTS style_documents_select_own ON public.style_documents;
CREATE POLICY style_documents_select_own ON public.style_documents
	FOR SELECT USING (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_documents_insert_own ON public.style_documents;
CREATE POLICY style_documents_insert_own ON public.style_documents
	FOR INSERT WITH CHECK (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS style_documents_update_own ON public.style_documents;
CREATE POLICY style_documents_update_own ON public.style_documents
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

DROP POLICY IF EXISTS style_documents_delete_own ON public.style_documents;
CREATE POLICY style_documents_delete_own ON public.style_documents
	FOR DELETE USING (
		exists (
			select 1 from public.style_profiles sp
			where sp.id = style_profile_id and sp.user_id = auth.uid()
		)
	);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.style_documents TO service_role; 
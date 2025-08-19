-- 013_user_doc_chunks.sql
-- Vectorized storage of user-uploaded document chunks for RAG

create extension if not exists vector;

create table if not exists public.user_document_chunks (
	id bigserial primary key,
	user_id uuid not null references auth.users(id) on delete cascade,
	source text not null, -- filename or logical source
	chunk_index integer not null,
	content text not null,
	metadata jsonb not null default '{}',
	embedding vector(1536),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- unique per user/source/chunk
create unique index if not exists idx_udc_user_source_chunk on public.user_document_chunks(user_id, source, chunk_index);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_udc_updated_at ON public.user_document_chunks;
CREATE TRIGGER trg_udc_updated_at
	BEFORE UPDATE ON public.user_document_chunks
	FOR EACH ROW
	EXECUTE FUNCTION public.set_updated_at();

-- RLS
alter table public.user_document_chunks enable row level security;

DROP POLICY IF EXISTS udc_select_own ON public.user_document_chunks;
CREATE POLICY udc_select_own ON public.user_document_chunks
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS udc_insert_own ON public.user_document_chunks;
CREATE POLICY udc_insert_own ON public.user_document_chunks
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS udc_update_own ON public.user_document_chunks;
CREATE POLICY udc_update_own ON public.user_document_chunks
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS udc_delete_own ON public.user_document_chunks;
CREATE POLICY udc_delete_own ON public.user_document_chunks
FOR DELETE USING (auth.uid() = user_id);

-- grant to service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_document_chunks TO service_role; 
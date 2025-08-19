-- 004_application_answers.sql
-- Enable pgvector extension for vector embeddings
create extension if not exists vector;

create table if not exists public.application_answers (
	id bigserial primary key,
	user_id uuid not null,
	question text not null,
	answer text not null,
	vector_embedding vector(1536),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

drop trigger if exists trg_app_answers_updated_at on public.application_answers;
create trigger trg_app_answers_updated_at
before update on public.application_answers
for each row execute function public.set_updated_at();

alter table public.application_answers enable row level security;

DROP POLICY IF EXISTS app_answers_select_own ON public.application_answers;
CREATE POLICY app_answers_select_own ON public.application_answers
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS app_answers_insert_own ON public.application_answers;
CREATE POLICY app_answers_insert_own ON public.application_answers
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS app_answers_update_own ON public.application_answers;
CREATE POLICY app_answers_update_own ON public.application_answers
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS app_answers_delete_own ON public.application_answers;
CREATE POLICY app_answers_delete_own ON public.application_answers
FOR DELETE USING (auth.uid() = user_id); 
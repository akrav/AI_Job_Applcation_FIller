-- 001_templates.sql
-- Create templates table and RLS policies

create table if not exists public.templates (
	id bigserial primary key,
	user_id uuid not null,
	content text not null,
	placeholders jsonb not null default '{}',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- simple updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists trg_templates_updated_at on public.templates;
create trigger trg_templates_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

-- RLS
alter table public.templates enable row level security;

-- Drop and recreate policies to be idempotent across runs
DROP POLICY IF EXISTS templates_select_own ON public.templates;
CREATE POLICY templates_select_own ON public.templates
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS templates_insert_own ON public.templates;
CREATE POLICY templates_insert_own ON public.templates
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS templates_update_own ON public.templates;
CREATE POLICY templates_update_own ON public.templates
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS templates_delete_own ON public.templates;
CREATE POLICY templates_delete_own ON public.templates
FOR DELETE USING (auth.uid() = user_id); 
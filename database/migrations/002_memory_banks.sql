-- 002_memory_banks.sql
create table if not exists public.memory_banks (
	id bigserial primary key,
	user_id uuid not null,
	data jsonb not null default '{}',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

drop trigger if exists trg_memory_banks_updated_at on public.memory_banks;
create trigger trg_memory_banks_updated_at
before update on public.memory_banks
for each row execute function public.set_updated_at();

alter table public.memory_banks enable row level security;

DROP POLICY IF EXISTS memory_banks_select_own ON public.memory_banks;
CREATE POLICY memory_banks_select_own ON public.memory_banks
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS memory_banks_insert_own ON public.memory_banks;
CREATE POLICY memory_banks_insert_own ON public.memory_banks
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS memory_banks_update_own ON public.memory_banks;
CREATE POLICY memory_banks_update_own ON public.memory_banks
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS memory_banks_delete_own ON public.memory_banks;
CREATE POLICY memory_banks_delete_own ON public.memory_banks
FOR DELETE USING (auth.uid() = user_id); 
-- 005_auth_user_trigger.sql
-- Harden the auth.users trigger path to never block signups

-- Optional helper table for demo/profile linkage
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	created_at timestamptz not null default now()
);

-- Robust function: perform side-effects only if targets exist; never raise
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	-- Seed profiles if table exists
	if to_regclass('public.profiles') is not null then
		begin
			insert into public.profiles(id) values (new.id)
			on conflict (id) do nothing;
		exception when others then
			null; -- never block auth insert
		end;
	end if;

	-- Seed memory_banks if table exists
	if to_regclass('public.memory_banks') is not null then
		begin
			insert into public.memory_banks(user_id, data)
			values (new.id, '{}'::jsonb)
			on conflict (user_id) do nothing;
		exception when others then
			null; -- never block auth insert
		end;
	end if;

	return new;
end;
$$;

-- Rebind trigger (safe if already bound)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user(); 
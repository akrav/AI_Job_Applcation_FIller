-- 006_seed_on_auth_user.sql
-- Extend seeding on auth.users insert to include writing_style_profiles and templates

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
		exception when others then null; end;
	end if;

	-- Seed memory_banks if table exists
	if to_regclass('public.memory_banks') is not null then
		begin
			insert into public.memory_banks(user_id, data)
			values (new.id, '{}'::jsonb)
			on conflict (user_id) do nothing;
		exception when others then null; end;
	end if;

	-- Seed writing_style_profiles if table exists
	if to_regclass('public.writing_style_profiles') is not null then
		begin
			insert into public.writing_style_profiles(user_id, profile_data)
			values (new.id, '{}'::jsonb)
			on conflict (user_id) do nothing;
		exception when others then null; end;
	end if;

	-- Seed a placeholder template if table exists
	if to_regclass('public.templates') is not null then
		begin
			insert into public.templates(user_id, content, placeholders)
			values (new.id, ''::text, '{}'::jsonb)
			on conflict do nothing; -- in case of a uniqueness you may add later
		exception when others then null; end;
	end if;

	return new;
end;
$$; 
-- 007_unique_user_constraints.sql
-- Enforce one-to-one rows per user_id and support ON CONFLICT usage

alter table if exists public.memory_banks
	add constraint memory_banks_user_id_key unique (user_id);

alter table if exists public.writing_style_profiles
	add constraint writing_style_profiles_user_id_key unique (user_id); 
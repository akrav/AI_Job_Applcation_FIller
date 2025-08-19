-- 010_grant_service_role_memory.sql
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.memory_banks to service_role;
grant select, insert, update, delete on table public.writing_style_profiles to service_role; 
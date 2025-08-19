-- 008_grant_service_role_templates.sql
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.templates to service_role; 
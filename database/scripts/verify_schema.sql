-- verify existence of key tables
select to_regclass('public.templates') as templates_table;
select to_regclass('public.style_profiles') as style_profiles_table;
select to_regclass('public.style_profile_versions') as style_profile_versions_table;
select to_regclass('public.style_documents') as style_documents_table;
select to_regclass('public.style_exemplars') as style_exemplars_table;
select to_regclass('public.style_lexicon') as style_lexicon_table;
select to_regclass('public.style_runs') as style_runs_table;

-- verify RLS enabled on key tables
select 'templates' as table_name, relrowsecurity from pg_class where relname = 'templates';
select 'style_profiles' as table_name, relrowsecurity from pg_class where relname = 'style_profiles';
select 'style_profile_versions' as table_name, relrowsecurity from pg_class where relname = 'style_profile_versions';
select 'style_documents' as table_name, relrowsecurity from pg_class where relname = 'style_documents';
select 'style_exemplars' as table_name, relrowsecurity from pg_class where relname = 'style_exemplars';
select 'style_lexicon' as table_name, relrowsecurity from pg_class where relname = 'style_lexicon';
select 'style_runs' as table_name, relrowsecurity from pg_class where relname = 'style_runs'; 
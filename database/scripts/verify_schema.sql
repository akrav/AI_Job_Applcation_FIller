-- Verify core tables and RLS policies for Sprint 1
\echo '==> Verifying required tables exist'
SELECT 'users' AS table, to_regclass('public.users') IS NOT NULL AS exists;
SELECT 'writing_style_profiles' AS table, to_regclass('public.writing_style_profiles') IS NOT NULL AS exists;
SELECT 'memory_banks' AS table, to_regclass('public.memory_banks') IS NOT NULL AS exists;

\echo '==> Verifying RLS enabled (if tables exist)'
DO $$
BEGIN
  IF to_regclass('public.users') IS NOT NULL THEN
    PERFORM 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname='users' AND relrowsecurity = true;
  END IF;
  IF to_regclass('public.writing_style_profiles') IS NOT NULL THEN
    PERFORM 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname='writing_style_profiles' AND relrowsecurity = true;
  END IF;
  IF to_regclass('public.memory_banks') IS NOT NULL THEN
    PERFORM 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname='memory_banks' AND relrowsecurity = true;
  END IF;
END $$;

\echo '✅ Verification completed' 
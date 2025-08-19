-- 009_grant_sequences.sql
-- Allow service_role to use sequences for inserts into serial/bigserial tables
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT sequence_schema, sequence_name FROM information_schema.sequences WHERE sequence_schema='public'
  LOOP
    EXECUTE format('GRANT USAGE, SELECT, UPDATE ON SEQUENCE %I.%I TO service_role;', r.sequence_schema, r.sequence_name);
  END LOOP;
END$$; 
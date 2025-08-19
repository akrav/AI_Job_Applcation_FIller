-- 012_source_attributions.sql
-- Stores source attribution records per generated line

CREATE TABLE IF NOT EXISTS public.source_attributions (
	id bigserial PRIMARY KEY,
	user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	placeholder text,
	line_text text NOT NULL,
	source_url text NOT NULL,
	quote_text text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_source_attr_updated_at ON public.source_attributions;
CREATE TRIGGER trg_source_attr_updated_at
	BEFORE UPDATE ON public.source_attributions
	FOR EACH ROW
	EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS and own-row policies
ALTER TABLE public.source_attributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS source_attr_select_own ON public.source_attributions;
CREATE POLICY source_attr_select_own ON public.source_attributions
	FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS source_attr_insert_own ON public.source_attributions;
CREATE POLICY source_attr_insert_own ON public.source_attributions
	FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS source_attr_update_own ON public.source_attributions;
CREATE POLICY source_attr_update_own ON public.source_attributions
	FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS source_attr_delete_own ON public.source_attributions;
CREATE POLICY source_attr_delete_own ON public.source_attributions
	FOR DELETE USING (auth.uid() = user_id);

-- Grant DML to service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.source_attributions TO service_role; 
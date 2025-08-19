-- 011_vector_search_fn.sql
-- Create RPC function for vector similarity search on application_answers

CREATE OR REPLACE FUNCTION public.match_application_answers(
	p_user_id uuid,
	p_query_embedding vector,
	p_match_limit integer DEFAULT 5
)
RETURNS TABLE (
	id bigint,
	user_id uuid,
	question text,
	answer text,
	distance double precision
)
LANGUAGE sql
STABLE
AS $$
	SELECT aa.id, aa.user_id, aa.question, aa.answer,
		(aa.vector_embedding <-> p_query_embedding) AS distance
	FROM public.application_answers AS aa
	WHERE aa.user_id = p_user_id
	ORDER BY aa.vector_embedding <-> p_query_embedding
	LIMIT GREATEST(1, p_match_limit);
$$;

-- Grant execute to service_role for server-side usage
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_proc p
		JOIN pg_namespace n ON n.oid = p.pronamespace
		WHERE p.proname = 'match_application_answers' AND n.nspname = 'public'
	) THEN
		-- noop; function created above
	END IF;
	GRANT EXECUTE ON FUNCTION public.match_application_answers(uuid, vector, integer) TO service_role;
EXCEPTION WHEN OTHERS THEN
	NULL;
END$$; 
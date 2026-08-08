-- ============================================================
-- 042_contacts_custom_fields_search.sql
--
-- Adds a server-side contact search function that matches standard
-- fields (name, phone, email) AND values inside custom fields
-- (contact_custom_values table), with optional tag filtering.
-- ============================================================

CREATE OR REPLACE FUNCTION public.search_contacts(
  p_search TEXT DEFAULT NULL,
  p_tag_ids UUID[] DEFAULT NULL,
  p_limit INT DEFAULT 25,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (contact contacts, total_count BIGINT)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH matched AS (
    SELECT DISTINCT c.id, c.created_at
    FROM contacts c
    LEFT JOIN contact_tags ct ON ct.contact_id = c.id
    WHERE (p_tag_ids IS NULL OR p_tag_ids = '{}'::UUID[] OR ct.tag_id = ANY(p_tag_ids))
      AND (
        p_search IS NULL OR p_search = ''
        OR c.name ILIKE '%' || p_search || '%'
        OR c.phone ILIKE '%' || p_search || '%'
        OR c.email ILIKE '%' || p_search || '%'
        OR EXISTS (
          SELECT 1 FROM contact_custom_values ccv
          WHERE ccv.contact_id = c.id
            AND ccv.value ILIKE '%' || p_search || '%'
        )
      )
  ),
  page AS (
    SELECT id, count(*) OVER() AS total_count
    FROM matched
    ORDER BY created_at DESC, id
    LIMIT p_limit OFFSET p_offset
  )
  SELECT c AS contact, page.total_count
  FROM page
  JOIN contacts c ON c.id = page.id
  ORDER BY c.created_at DESC, c.id;
$$;

ALTER FUNCTION public.search_contacts(TEXT, UUID[], INT, INT) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.search_contacts(TEXT, UUID[], INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_contacts(TEXT, UUID[], INT, INT) TO authenticated;

-- Enable trigram extension for wildcard case-insensitive search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN trigram index on custom field values
CREATE INDEX IF NOT EXISTS idx_contact_custom_values_value_trgm
  ON public.contact_custom_values USING gin (value gin_trgm_ops);

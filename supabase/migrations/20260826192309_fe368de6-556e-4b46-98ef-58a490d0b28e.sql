-- 1. Marcação de eventos de teste (aditiva, reversível)
ALTER TABLE public.conversion_events
  ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;

UPDATE public.conversion_events
  SET is_test = true
  WHERE order_id ILIKE 'TEST%' AND is_test = false;

CREATE INDEX IF NOT EXISTS conversion_events_created_at_idx
  ON public.conversion_events (created_at DESC);
CREATE INDEX IF NOT EXISTS conversion_events_event_created_idx
  ON public.conversion_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS conversion_events_order_id_idx
  ON public.conversion_events (order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS conversion_events_meta_status_idx
  ON public.conversion_events (meta_status) WHERE meta_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS conversion_events_is_test_idx
  ON public.conversion_events (is_test) WHERE is_test = true;

-- 2. Carrinhos abandonados
CREATE TABLE IF NOT EXISTS public.abandoned_checkouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_token text NOT NULL UNIQUE,
  customer_name text,
  customer_email text,
  customer_phone text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric,
  currency text NOT NULL DEFAULT 'BRL',
  recovery_url text,
  reorder_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  raw jsonb,
  abandoned_at timestamptz NOT NULL DEFAULT now(),
  recovered_at timestamptz,
  recovered_order_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.abandoned_checkouts TO authenticated;
GRANT ALL ON public.abandoned_checkouts TO service_role;

ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view abandoned checkouts"
  ON public.abandoned_checkouts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages abandoned checkouts"
  ON public.abandoned_checkouts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS abandoned_checkouts_abandoned_at_idx
  ON public.abandoned_checkouts (abandoned_at DESC);
CREATE INDEX IF NOT EXISTS abandoned_checkouts_email_idx
  ON public.abandoned_checkouts (customer_email);
CREATE INDEX IF NOT EXISTS abandoned_checkouts_phone_idx
  ON public.abandoned_checkouts (customer_phone);
CREATE INDEX IF NOT EXISTS abandoned_checkouts_recovered_idx
  ON public.abandoned_checkouts (recovered_at);

CREATE TRIGGER update_abandoned_checkouts_updated_at
  BEFORE UPDATE ON public.abandoned_checkouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Log de ações do MCP (idempotência + auditoria)
CREATE TABLE IF NOT EXISTS public.mcp_action_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  target_ref text,
  status text NOT NULL DEFAULT 'pending',
  request jsonb,
  response jsonb,
  actor_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.mcp_action_log TO authenticated;
GRANT ALL ON public.mcp_action_log TO service_role;

ALTER TABLE public.mcp_action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view mcp action log"
  ON public.mcp_action_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages mcp action log"
  ON public.mcp_action_log FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS mcp_action_log_action_created_idx
  ON public.mcp_action_log (action, created_at DESC);

CREATE TRIGGER update_mcp_action_log_updated_at
  BEFORE UPDATE ON public.mcp_action_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. RPCs de agregação (somente admin)
CREATE OR REPLACE FUNCTION public.mcp_conversion_summary(_days integer DEFAULT 30, _include_tests boolean DEFAULT false)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _since timestamptz := now() - make_interval(days => GREATEST(1, LEAST(365, _days)));
  _result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden: admin role required';
  END IF;

  WITH src AS (
    SELECT * FROM public.conversion_events
    WHERE created_at >= _since AND (_include_tests OR is_test = false)
  )
  SELECT jsonb_build_object(
    'days', GREATEST(1, LEAST(365, _days)),
    'include_tests', _include_tests,
    'total_events', (SELECT count(*) FROM src),
    'purchases', (SELECT count(*) FROM src WHERE event_name = 'Purchase'),
    'revenue_brl', (SELECT COALESCE(round(sum(value)::numeric, 2), 0) FROM src WHERE event_name = 'Purchase'),
    'events', COALESCE((SELECT jsonb_object_agg(event_name, c) FROM (
        SELECT event_name, count(*) AS c FROM src GROUP BY event_name) t), '{}'::jsonb),
    'by_utm_source', COALESCE((SELECT jsonb_object_agg(s, c) FROM (
        SELECT COALESCE(NULLIF(utm_source, ''), 'direto') AS s, count(*) AS c FROM src GROUP BY 1) t), '{}'::jsonb),
    'by_cta_location', COALESCE((SELECT jsonb_object_agg(l, c) FROM (
        SELECT cta_location AS l, count(*) AS c FROM src WHERE cta_location IS NOT NULL AND cta_location <> '' GROUP BY 1) t), '{}'::jsonb)
  ) INTO _result;

  RETURN _result;
END;
$$;

CREATE OR REPLACE FUNCTION public.mcp_sales_metrics(_days integer DEFAULT 30, _include_tests boolean DEFAULT false)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _since timestamptz := now() - make_interval(days => GREATEST(1, LEAST(365, _days)));
  _result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden: admin role required';
  END IF;

  WITH src AS (
    SELECT * FROM public.conversion_events
    WHERE created_at >= _since AND (_include_tests OR is_test = false)
  ),
  purchases AS (SELECT * FROM src WHERE event_name = 'Purchase'),
  agg AS (
    SELECT count(*) AS orders,
           count(DISTINCT order_id) AS unique_orders,
           COALESCE(round(sum(value)::numeric, 2), 0) AS revenue
    FROM purchases
  ),
  checkouts AS (SELECT count(*) AS c FROM src WHERE event_name = 'InitiateCheckout')
  SELECT jsonb_build_object(
    'days', GREATEST(1, LEAST(365, _days)),
    'include_tests', _include_tests,
    'orders', (SELECT orders FROM agg),
    'unique_buyers', (SELECT unique_orders FROM agg),
    'revenue_brl', (SELECT revenue FROM agg),
    'avg_ticket_brl', CASE WHEN (SELECT orders FROM agg) > 0
      THEN round((SELECT revenue FROM agg) / (SELECT orders FROM agg), 2) ELSE 0 END,
    'initiate_checkouts', (SELECT c FROM checkouts),
    'conversion_rate_pct', CASE WHEN (SELECT c FROM checkouts) > 0
      THEN round(((SELECT orders FROM agg)::numeric * 100) / (SELECT c FROM checkouts), 2) ELSE 0 END,
    'top_products', COALESCE((SELECT jsonb_agg(jsonb_build_object('product_name', p, 'orders', c, 'revenue_brl', r) ORDER BY c DESC) FROM (
        SELECT COALESCE(NULLIF(product_name, ''), 'não informado') AS p, count(*) AS c,
               COALESCE(round(sum(value)::numeric, 2), 0) AS r
        FROM purchases GROUP BY 1 ORDER BY c DESC LIMIT 10) t), '[]'::jsonb),
    'by_utm_source', COALESCE((SELECT jsonb_object_agg(s, c) FROM (
        SELECT COALESCE(NULLIF(utm_source, ''), 'direto') AS s, count(*) AS c FROM purchases GROUP BY 1) t), '{}'::jsonb)
  ) INTO _result;

  RETURN _result;
END;
$$;

CREATE OR REPLACE FUNCTION public.mcp_tracking_health(_days integer DEFAULT 7, _include_tests boolean DEFAULT false)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _since timestamptz := now() - make_interval(days => GREATEST(1, LEAST(365, _days)));
  _result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'forbidden: admin role required';
  END IF;

  WITH src AS (
    SELECT * FROM public.conversion_events
    WHERE created_at >= _since AND (_include_tests OR is_test = false)
  ),
  purchases AS (SELECT * FROM src WHERE event_name = 'Purchase')
  SELECT jsonb_build_object(
    'days', GREATEST(1, LEAST(365, _days)),
    'include_tests', _include_tests,
    'initiate_checkouts', (SELECT count(*) FROM src WHERE event_name = 'InitiateCheckout'),
    'abandoned_checkouts', (SELECT count(*) FROM public.abandoned_checkouts WHERE abandoned_at >= _since),
    'abandoned_recovered', (SELECT count(*) FROM public.abandoned_checkouts WHERE abandoned_at >= _since AND recovered_at IS NOT NULL),
    'internal_purchases', (SELECT count(*) FROM purchases),
    'purchases_from_yampi', (SELECT count(*) FROM purchases WHERE source = 'yampi'),
    'meta_sent', (SELECT count(*) FROM purchases WHERE meta_status LIKE 'sent_%'),
    'meta_errors', (SELECT count(*) FROM purchases WHERE meta_status LIKE 'error%'),
    'meta_error_404', (SELECT count(*) FROM purchases WHERE meta_status = 'error_404'),
    'meta_missing_status', (SELECT count(*) FROM purchases WHERE meta_status IS NULL),
    'price_mismatches', (SELECT count(*) FROM purchases WHERE (metadata->>'price_mismatch')::boolean IS TRUE),
    'by_meta_status', COALESCE((SELECT jsonb_object_agg(s, c) FROM (
        SELECT COALESCE(meta_status, 'null') AS s, count(*) AS c FROM purchases GROUP BY 1) t), '{}'::jsonb),
    'failed_order_ids', COALESCE((SELECT jsonb_agg(order_id) FROM (
        SELECT DISTINCT order_id FROM purchases
        WHERE order_id IS NOT NULL AND (meta_status IS NULL OR meta_status LIKE 'error%')
        LIMIT 50) t), '[]'::jsonb),
    'test_events_excluded', (SELECT count(*) FROM public.conversion_events WHERE created_at >= _since AND is_test = true)
  ) INTO _result;

  RETURN _result;
END;
$$;

REVOKE ALL ON FUNCTION public.mcp_conversion_summary(integer, boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mcp_sales_metrics(integer, boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mcp_tracking_health(integer, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_conversion_summary(integer, boolean) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mcp_sales_metrics(integer, boolean) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mcp_tracking_health(integer, boolean) TO authenticated, service_role;
ALTER TABLE public.conversion_events ADD COLUMN IF NOT EXISTS buyer_hash text;

CREATE INDEX IF NOT EXISTS conversion_events_buyer_hash_idx
  ON public.conversion_events (buyer_hash)
  WHERE buyer_hash IS NOT NULL;

CREATE OR REPLACE FUNCTION public.mcp_sales_metrics(_days integer DEFAULT 30, _include_tests boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
           count(DISTINCT buyer_hash) AS unique_buyers,
           count(*) FILTER (WHERE buyer_hash IS NOT NULL) AS identified_buyer_orders,
           count(*) FILTER (WHERE buyer_hash IS NULL) AS unidentified_buyer_orders,
           COALESCE(round(sum(value)::numeric, 2), 0) AS revenue
    FROM purchases
  ),
  checkouts AS (SELECT count(*) AS c FROM src WHERE event_name = 'InitiateCheckout')
  SELECT jsonb_build_object(
    'days', GREATEST(1, LEAST(365, _days)),
    'include_tests', _include_tests,
    'orders', (SELECT orders FROM agg),
    'unique_orders', (SELECT unique_orders FROM agg),
    'unique_buyers', (SELECT unique_buyers FROM agg),
    'identified_buyer_orders', (SELECT identified_buyer_orders FROM agg),
    'unidentified_buyer_orders', (SELECT unidentified_buyer_orders FROM agg),
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
$function$;
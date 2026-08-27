CREATE OR REPLACE FUNCTION public.mcp_tracking_health(_days integer DEFAULT 7, _include_tests boolean DEFAULT false)
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
  orders AS (
    SELECT * FROM public.yampi_orders
    WHERE last_seen_at >= _since AND (_include_tests OR is_test = false)
  )
  SELECT jsonb_build_object(
    'days', GREATEST(1, LEAST(365, _days)),
    'include_tests', _include_tests,
    'initiate_checkouts', (SELECT count(*) FROM src WHERE event_name = 'InitiateCheckout'),
    'abandoned_checkouts', (SELECT count(*) FROM public.abandoned_checkouts WHERE abandoned_at >= _since),
    'abandoned_recovered', (SELECT count(*) FROM public.abandoned_checkouts WHERE abandoned_at >= _since AND recovered_at IS NOT NULL),
    'yampi_orders_total', (SELECT count(*) FROM orders),
    'yampi_orders_waiting_payment', (SELECT count(*) FROM orders WHERE status IN ('waiting_payment','pending','waiting_pix')),
    'yampi_orders_paid', (SELECT count(*) FROM orders WHERE status IN ('paid','approved')),
    'yampi_orders_cancelled', (SELECT count(*) FROM orders WHERE status IN ('cancelled','canceled','refunded')),
    'yampi_orders_revenue_paid_brl', (SELECT COALESCE(round(sum(value_total)::numeric, 2), 0) FROM orders WHERE status IN ('paid','approved')),
    'yampi_price_mismatches', (SELECT count(*) FROM orders WHERE price_mismatch),
    'by_order_status', COALESCE((SELECT jsonb_object_agg(s, c) FROM (
        SELECT COALESCE(status, 'desconhecido') AS s, count(*) AS c FROM orders GROUP BY 1) t), '{}'::jsonb),
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
$function$;
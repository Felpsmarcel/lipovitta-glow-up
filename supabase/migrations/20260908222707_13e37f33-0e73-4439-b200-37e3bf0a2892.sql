CREATE OR REPLACE FUNCTION public.daily_sales_report(_report_date date DEFAULT (now() AT TIME ZONE 'America/Bahia')::date)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _y_start timestamptz := ((_report_date - 1)::timestamp) AT TIME ZONE 'America/Bahia';
  _y_end   timestamptz := (_report_date::timestamp) AT TIME ZONE 'America/Bahia';
  _t_start timestamptz := (_report_date::timestamp) AT TIME ZONE 'America/Bahia';
  _t_end   timestamptz := ((_report_date::timestamp) + interval '9 hours') AT TIME ZONE 'America/Bahia';
  _result jsonb;
BEGIN
  WITH bounds AS (
    SELECT 'yesterday'::text AS bucket, _y_start AS s, _y_end AS e
    UNION ALL SELECT 'today', _t_start, _t_end
  ),
  ord AS (
    SELECT b.bucket, o.*
    FROM bounds b
    JOIN public.yampi_orders o
      ON o.last_seen_at >= b.s AND o.last_seen_at < b.e
    WHERE o.is_test = false
  ),
  ev AS (
    SELECT b.bucket, c.*
    FROM bounds b
    JOIN public.conversion_events c
      ON c.created_at >= b.s AND c.created_at < b.e
    WHERE c.is_test = false
  ),
  ab AS (
    SELECT b.bucket, a.*
    FROM bounds b
    JOIN public.abandoned_checkouts a
      ON a.abandoned_at >= b.s AND a.abandoned_at < b.e
  ),
  per AS (
    SELECT b.bucket,
      (SELECT count(*) FROM ord o WHERE o.bucket = b.bucket AND o.status IN ('paid','approved')) AS paid_orders,
      COALESCE((SELECT round(sum(o.value_total)::numeric, 2) FROM ord o WHERE o.bucket = b.bucket AND o.status IN ('paid','approved')), 0) AS revenue,
      (SELECT count(*) FROM ord o WHERE o.bucket = b.bucket AND o.status IN ('waiting_payment','pending','waiting_pix')) AS waiting_orders,
      (SELECT count(*) FROM ord o WHERE o.bucket = b.bucket AND o.status IN ('cancelled','canceled','refunded')) AS cancelled_orders,
      (SELECT count(*) FROM ord o WHERE o.bucket = b.bucket AND o.price_mismatch) AS price_mismatches,
      (SELECT count(*) FROM ev e WHERE e.bucket = b.bucket AND e.event_name = 'InitiateCheckout') AS initiate_checkouts,
      (SELECT count(*) FROM ab a WHERE a.bucket = b.bucket) AS abandoned_checkouts
    FROM bounds b
  )
  SELECT jsonb_build_object(
    'report_date', to_char(_report_date, 'DD/MM/YYYY'),
    'yesterday_date', to_char(_report_date - 1, 'DD/MM/YYYY'),
    'timezone', 'America/Bahia',
    'yesterday', (
      SELECT jsonb_build_object(
        'paid_orders', p.paid_orders,
        'revenue_brl', p.revenue,
        'avg_ticket_brl', CASE WHEN p.paid_orders > 0 THEN round(p.revenue / p.paid_orders, 2) ELSE 0 END,
        'waiting_orders', p.waiting_orders,
        'cancelled_orders', p.cancelled_orders,
        'price_mismatches', p.price_mismatches,
        'initiate_checkouts', p.initiate_checkouts,
        'abandoned_checkouts', p.abandoned_checkouts
      ) FROM per p WHERE p.bucket = 'yesterday'),
    'today', (
      SELECT jsonb_build_object(
        'paid_orders', p.paid_orders,
        'revenue_brl', p.revenue,
        'avg_ticket_brl', CASE WHEN p.paid_orders > 0 THEN round(p.revenue / p.paid_orders, 2) ELSE 0 END,
        'waiting_orders', p.waiting_orders,
        'cancelled_orders', p.cancelled_orders,
        'price_mismatches', p.price_mismatches,
        'initiate_checkouts', p.initiate_checkouts,
        'abandoned_checkouts', p.abandoned_checkouts
      ) FROM per p WHERE p.bucket = 'today'),
    'top_products', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT COALESCE(NULLIF(i.item->>'name', ''), 'não informado') AS name,
               count(*) AS orders
        FROM ord o
        CROSS JOIN LATERAL jsonb_array_elements(COALESCE(o.items, '[]'::jsonb)) AS i(item)
        WHERE o.bucket = 'yesterday' AND o.status IN ('paid','approved')
          AND jsonb_typeof(o.items) = 'array'
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10
      ) t), '[]'::jsonb),
    'by_utm_source', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT COALESCE(NULLIF(o.utm_source, ''), 'direto') AS source, count(*) AS orders
        FROM ord o WHERE o.bucket = 'yesterday' AND o.status IN ('paid','approved')
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10
      ) t), '[]'::jsonb)
  ) INTO _result;

  RETURN _result;
END;
$function$;

REVOKE ALL ON FUNCTION public.daily_sales_report(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.daily_sales_report(date) TO service_role;

CREATE POLICY "Admins can read send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.email_send_log TO authenticated;
CREATE TABLE IF NOT EXISTS public.order_payments (
  order_id text PRIMARY KEY,
  paid_at timestamptz NOT NULL,
  paid_at_provenance text NOT NULL DEFAULT 'event_received_at',
  source text NOT NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.order_payments TO authenticated;
GRANT ALL ON public.order_payments TO service_role;

ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view order payments" ON public.order_payments;
CREATE POLICY "Admins can view order payments"
ON public.order_payments FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Service role manages order payments" ON public.order_payments;
CREATE POLICY "Service role manages order payments"
ON public.order_payments FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_order_payments_updated_at ON public.order_payments;
CREATE TRIGGER update_order_payments_updated_at
BEFORE UPDATE ON public.order_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS order_payments_paid_at_idx ON public.order_payments (paid_at);

-- Backfill: evidência legada de pagamento (uma linha por pedido)
INSERT INTO public.order_payments (order_id, paid_at, paid_at_provenance, source, evidence, is_test)
SELECT split_part(dedupe_key, ':', 2) AS order_id,
       min(created_at) AS paid_at,
       'event_received_at',
       'ghl_outbox:order.paid',
       jsonb_build_object('dedupe_key', min(dedupe_key)),
       bool_and(is_test)
FROM public.ghl_outbox
WHERE dedupe_key LIKE 'order.paid:%'
GROUP BY 1
ON CONFLICT (order_id) DO NOTHING;

INSERT INTO public.order_payments (order_id, paid_at, paid_at_provenance, source, evidence, is_test)
SELECT order_id, min(created_at), 'event_received_at', 'conversion_events:Purchase',
       '{}'::jsonb, bool_and(is_test)
FROM public.conversion_events
WHERE event_name = 'Purchase' AND order_id IS NOT NULL AND order_id <> ''
GROUP BY order_id
ON CONFLICT (order_id) DO NOTHING;

ALTER TABLE public.yampi_orders
  ADD COLUMN IF NOT EXISTS gift_source text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

UPDATE public.yampi_orders o
SET paid_at = p.paid_at
FROM public.order_payments p
WHERE p.order_id = o.order_id AND o.paid_at IS DISTINCT FROM p.paid_at;

UPDATE public.yampi_orders
SET gift_source = 'yampi_utm_content'
WHERE gift IS NOT NULL AND gift <> '' AND gift_source IS NULL;

-- Catálogo de brindes
CREATE OR REPLACE FUNCTION public.gift_display_name(_code text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE lower(btrim(coalesce(_code, '')))
    WHEN 'brinde_raspador' THEN 'Raspador de língua'
    WHEN 'raspador' THEN 'Raspador de língua'
    WHEN 'brinde_portacapsulas' THEN 'Porta cápsulas'
    WHEN 'portacapsulas' THEN 'Porta cápsulas'
    WHEN 'brinde_mixer' THEN 'Mixer Dosador'
    WHEN 'mixer' THEN 'Mixer Dosador'
    WHEN 'brinde_garrafa' THEN 'Garrafa Térmica'
    WHEN 'garrafa' THEN 'Garrafa Térmica'
    ELSE NULL
  END
$$;

-- Detalhe de pedidos pagos por janela de pagamento
CREATE OR REPLACE FUNCTION public.paid_orders_detail(_from timestamptz, _to timestamptz)
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH pay AS (
    SELECT p.*
    FROM public.order_payments p
    WHERE p.paid_at >= _from AND p.paid_at < _to
      AND p.is_test = false
      AND p.order_id <> '171482339'
  ),
  ord AS (
    SELECT pay.order_id, pay.paid_at, pay.paid_at_provenance, pay.source AS paid_source,
           o.order_number, o.status, o.value_total, o.items, o.gift, o.gift_source,
           o.utm_content, o.event_id, o.is_test
    FROM pay
    LEFT JOIN public.yampi_orders o ON o.order_id = pay.order_id
  ),
  resolved AS (
    SELECT ord.*,
      COALESCE(
        NULLIF(ord.gift, ''),
        NULLIF(ord.utm_content, ''),
        (SELECT NULLIF(COALESCE(c.gift, c.utm_content), '')
           FROM public.conversion_events c
          WHERE ord.event_id IS NOT NULL AND c.event_id = ord.event_id
            AND COALESCE(c.gift, c.utm_content) IS NOT NULL
          ORDER BY c.created_at ASC LIMIT 1)
      ) AS gift_code,
      CASE
        WHEN NULLIF(ord.gift, '') IS NOT NULL THEN COALESCE(ord.gift_source, 'pedido')
        WHEN NULLIF(ord.utm_content, '') IS NOT NULL THEN 'utm_content'
        ELSE 'evento_checkout'
      END AS gift_origin
    FROM ord
  )
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'order_id', r.order_id,
      'order_number', COALESCE(r.order_number, r.order_id),
      'status', COALESCE(r.status, 'desconhecido'),
      'paid_at', to_char(r.paid_at AT TIME ZONE 'America/Bahia', 'DD/MM/YYYY HH24:MI'),
      'paid_at_provenance', r.paid_at_provenance,
      'paid_source', r.paid_source,
      'cancelled', COALESCE(r.status, '') IN ('cancelled','canceled','refunded'),
      'value_total', COALESCE(round(r.value_total::numeric, 2), 0),
      'items', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'name', COALESCE(NULLIF(i.item->>'name',''), 'não informado'),
          'sku', COALESCE(NULLIF(i.item->>'sku',''), 'sem SKU'),
          'quantity', COALESCE((i.item->>'quantity')::numeric, 1),
          'variant', CASE
            WHEN COALESCE(i.item->>'name','') ~* '(ABACAXI|TANGERINA|LIMAO|LIMÃO|FRUTAS VERMELHAS|MORANGO|MARACUJ)'
            THEN upper((regexp_match(i.item->>'name', '(ABACAXI|TANGERINA|LIMAO|LIMÃO|FRUTAS VERMELHAS|MORANGO|MARACUJ[AÁ])', 'i'))[1])
            ELSE NULL END
        ))
        FROM jsonb_array_elements(CASE WHEN jsonb_typeof(r.items) = 'array' THEN r.items ELSE '[]'::jsonb END) AS i(item)
      ), '[]'::jsonb),
      'gift', CASE WHEN public.gift_display_name(r.gift_code) IS NOT NULL
        THEN jsonb_build_object(
          'code', lower(btrim(r.gift_code)),
          'name', public.gift_display_name(r.gift_code),
          'quantity', 1,
          'source', r.gift_origin)
        ELSE NULL END,
      'gift_pending', public.gift_display_name(r.gift_code) IS NULL,
      'order_missing', r.order_number IS NULL AND r.items IS NULL
    ) ORDER BY r.paid_at
  ), '[]'::jsonb)
  FROM resolved r
$$;

CREATE OR REPLACE FUNCTION public.daily_sales_report(_report_date date DEFAULT ((now() AT TIME ZONE 'America/Bahia'::text))::date)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _y_start timestamptz := ((_report_date - 1)::timestamp) AT TIME ZONE 'America/Bahia';
  _y_end   timestamptz := (_report_date::timestamp) AT TIME ZONE 'America/Bahia';
  _t_start timestamptz := (_report_date::timestamp) AT TIME ZONE 'America/Bahia';
  _t_end   timestamptz := ((_report_date::timestamp) + interval '9 hours') AT TIME ZONE 'America/Bahia';
  _y_orders jsonb := public.paid_orders_detail(_y_start, _y_end);
  _t_orders jsonb := public.paid_orders_detail(_t_start, _t_end);
  _result jsonb;

  FUNCTION_PLACEHOLDER text;
BEGIN
  WITH bounds AS (
    SELECT 'yesterday'::text AS bucket, _y_start AS s, _y_end AS e, _y_orders AS o
    UNION ALL SELECT 'today', _t_start, _t_end, _t_orders
  ),
  per AS (
    SELECT b.bucket,
      (SELECT count(*) FROM jsonb_array_elements(b.o) x WHERE NOT (x->>'cancelled')::boolean) AS paid_orders,
      COALESCE((SELECT round(sum((x->>'value_total')::numeric), 2) FROM jsonb_array_elements(b.o) x WHERE NOT (x->>'cancelled')::boolean), 0) AS revenue,
      (SELECT count(*) FROM jsonb_array_elements(b.o) x WHERE (x->>'cancelled')::boolean) AS cancelled_orders,
      (SELECT count(*) FROM jsonb_array_elements(b.o) x WHERE (x->>'gift_pending')::boolean) AS gift_pending,
      (SELECT count(*) FROM public.yampi_orders y
        WHERE y.last_seen_at >= b.s AND y.last_seen_at < b.e AND y.is_test = false
          AND y.status IN ('waiting_payment','pending','waiting_pix')) AS waiting_orders,
      (SELECT count(*) FROM public.yampi_orders y
        WHERE y.last_seen_at >= b.s AND y.last_seen_at < b.e AND y.is_test = false
          AND y.price_mismatch) AS price_mismatches,
      (SELECT count(*) FROM public.conversion_events c
        WHERE c.created_at >= b.s AND c.created_at < b.e AND c.is_test = false
          AND c.event_name = 'InitiateCheckout') AS initiate_checkouts,
      (SELECT count(*) FROM public.abandoned_checkouts a
        WHERE a.abandoned_at >= b.s AND a.abandoned_at < b.e) AS abandoned_checkouts
    FROM bounds b
  )
  SELECT jsonb_build_object(
    'report_date', to_char(_report_date, 'DD/MM/YYYY'),
    'yesterday_date', to_char(_report_date - 1, 'DD/MM/YYYY'),
    'timezone', 'America/Bahia',
    'yesterday', (SELECT jsonb_build_object(
        'paid_orders', p.paid_orders,
        'revenue_brl', p.revenue,
        'avg_ticket_brl', CASE WHEN p.paid_orders > 0 THEN round(p.revenue / p.paid_orders, 2) ELSE 0 END,
        'waiting_orders', p.waiting_orders,
        'cancelled_orders', p.cancelled_orders,
        'price_mismatches', p.price_mismatches,
        'initiate_checkouts', p.initiate_checkouts,
        'abandoned_checkouts', p.abandoned_checkouts,
        'gift_pending', p.gift_pending
      ) FROM per p WHERE p.bucket = 'yesterday'),
    'today', (SELECT jsonb_build_object(
        'paid_orders', p.paid_orders,
        'revenue_brl', p.revenue,
        'avg_ticket_brl', CASE WHEN p.paid_orders > 0 THEN round(p.revenue / p.paid_orders, 2) ELSE 0 END,
        'waiting_orders', p.waiting_orders,
        'cancelled_orders', p.cancelled_orders,
        'price_mismatches', p.price_mismatches,
        'initiate_checkouts', p.initiate_checkouts,
        'abandoned_checkouts', p.abandoned_checkouts,
        'gift_pending', p.gift_pending
      ) FROM per p WHERE p.bucket = 'today'),
    'yesterday_orders', _y_orders,
    'today_orders', _t_orders,
    'top_products', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT i->>'name' AS name, sum((i->>'quantity')::numeric)::int AS orders
        FROM jsonb_array_elements(_y_orders) x
        CROSS JOIN LATERAL jsonb_array_elements(x->'items') i
        WHERE NOT (x->>'cancelled')::boolean
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10
      ) t), '[]'::jsonb),
    'by_utm_source', COALESCE((
      SELECT jsonb_agg(t) FROM (
        SELECT COALESCE(NULLIF(o.utm_source, ''), 'direto') AS source, count(*) AS orders
        FROM jsonb_array_elements(_y_orders) x
        JOIN public.yampi_orders o ON o.order_id = x->>'order_id'
        WHERE NOT (x->>'cancelled')::boolean
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10
      ) t), '[]'::jsonb)
  ) INTO _result;

  RETURN _result;
END;
$function$;
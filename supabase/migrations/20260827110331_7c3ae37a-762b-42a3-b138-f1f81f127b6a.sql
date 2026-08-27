CREATE TABLE public.yampi_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  order_number text,
  status text,
  event text,
  value_total numeric,
  value_products numeric,
  value_discount numeric,
  payment_alias text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  event_id text,
  gift text,
  expected_value numeric,
  price_diff numeric,
  price_mismatch boolean NOT NULL DEFAULT false,
  is_test boolean NOT NULL DEFAULT false,
  created_at_yampi timestamptz,
  updated_at_yampi timestamptz,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.yampi_orders TO authenticated;
GRANT ALL ON public.yampi_orders TO service_role;

ALTER TABLE public.yampi_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view yampi orders"
ON public.yampi_orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages yampi orders"
ON public.yampi_orders FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX idx_yampi_orders_last_seen ON public.yampi_orders (last_seen_at DESC);
CREATE INDEX idx_yampi_orders_status ON public.yampi_orders (status);
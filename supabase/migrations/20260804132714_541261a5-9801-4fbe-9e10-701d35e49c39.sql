CREATE TABLE public.conversion_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  event_id text,
  source text NOT NULL DEFAULT 'web',
  cta_location text,
  product_name text,
  sku text,
  value numeric(12,2),
  currency text NOT NULL DEFAULT 'BRL',
  order_id text,
  gift text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  page_url text,
  meta_status text,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.conversion_events TO service_role;
GRANT SELECT ON public.conversion_events TO authenticated;

ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view conversion events"
ON public.conversion_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage conversion events"
ON public.conversion_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX idx_conversion_events_created_at ON public.conversion_events (created_at DESC);
CREATE INDEX idx_conversion_events_event_name ON public.conversion_events (event_name);
CREATE UNIQUE INDEX idx_conversion_events_order_purchase ON public.conversion_events (order_id) WHERE event_name = 'Purchase' AND order_id IS NOT NULL;
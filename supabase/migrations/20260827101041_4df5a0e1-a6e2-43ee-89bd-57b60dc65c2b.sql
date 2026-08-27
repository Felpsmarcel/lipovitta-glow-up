CREATE TABLE IF NOT EXISTS public.yampi_webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id text NOT NULL,
  event text,
  outcome text NOT NULL,
  reason text,
  ref text,
  is_test boolean NOT NULL DEFAULT false,
  signature_present boolean NOT NULL DEFAULT false,
  content_length integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.yampi_webhook_deliveries TO authenticated;
GRANT ALL ON public.yampi_webhook_deliveries TO service_role;

ALTER TABLE public.yampi_webhook_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view yampi webhook deliveries"
ON public.yampi_webhook_deliveries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages yampi webhook deliveries"
ON public.yampi_webhook_deliveries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_yampi_webhook_deliveries_created_at
  ON public.yampi_webhook_deliveries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_yampi_webhook_deliveries_outcome
  ON public.yampi_webhook_deliveries (outcome, created_at DESC);
CREATE TABLE public.campaign_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  campaign_name text,
  period_from date,
  period_to date,
  source_type text NOT NULL DEFAULT 'text',
  raw_input text NOT NULL,
  sales_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  result jsonb,
  model text,
  status text NOT NULL DEFAULT 'pending',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.campaign_analyses TO authenticated;
GRANT ALL ON public.campaign_analyses TO service_role;
ALTER TABLE public.campaign_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view campaign analyses" ON public.campaign_analyses FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete campaign analyses" ON public.campaign_analyses FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Service role manages campaign analyses" ON public.campaign_analyses FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX campaign_analyses_created_idx ON public.campaign_analyses (created_at DESC);
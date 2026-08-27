CREATE TABLE public.ghl_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  dedupe_key text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ghl_outbox TO authenticated;
GRANT ALL ON public.ghl_outbox TO service_role;

ALTER TABLE public.ghl_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ghl outbox"
  ON public.ghl_outbox FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages ghl outbox"
  ON public.ghl_outbox FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE UNIQUE INDEX ghl_outbox_event_dedupe_idx ON public.ghl_outbox (event_type, dedupe_key);
CREATE INDEX ghl_outbox_status_idx ON public.ghl_outbox (status, next_attempt_at);
CREATE INDEX ghl_outbox_created_idx ON public.ghl_outbox (created_at DESC);

CREATE TRIGGER update_ghl_outbox_updated_at
  BEFORE UPDATE ON public.ghl_outbox
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
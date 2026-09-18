CREATE TABLE public.lipolovers_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('essencial', 'master')),
  flavor text NOT NULL CHECK (flavor IN ('tangerina', 'limao', 'abacaxi')),
  origin text NOT NULL DEFAULT 'site-lipolovers' CHECK (origin = 'site-lipolovers'),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'cancelled', 'refunded')),
  paid_order_id text,
  paid_at timestamptz,
  ghl_status text NOT NULL DEFAULT 'pending' CHECK (ghl_status IN ('pending', 'sent', 'failed')),
  ghl_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.lipolovers_leads TO service_role;

ALTER TABLE public.lipolovers_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages Lipolovers leads"
ON public.lipolovers_leads FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX idx_lipolovers_leads_email ON public.lipolovers_leads (lower(email));
CREATE INDEX idx_lipolovers_leads_payment ON public.lipolovers_leads (payment_status, created_at DESC);

CREATE TRIGGER update_lipolovers_leads_updated_at
BEFORE UPDATE ON public.lipolovers_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.lipolovers_delivery_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES public.lipolovers_leads(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  postal_code text NOT NULL,
  street_address text NOT NULL,
  address_number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.lipolovers_delivery_details TO service_role;

ALTER TABLE public.lipolovers_delivery_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages Lipolovers delivery details"
ON public.lipolovers_delivery_details FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE TRIGGER update_lipolovers_delivery_details_updated_at
BEFORE UPDATE ON public.lipolovers_delivery_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
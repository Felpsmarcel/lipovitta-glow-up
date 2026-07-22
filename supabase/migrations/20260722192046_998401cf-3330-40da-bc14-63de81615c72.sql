CREATE TABLE public.commercial_partner_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  responsible_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  cnpj text NOT NULL,
  company_name text NOT NULL,
  business_type text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  volume_notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.commercial_partner_applications TO anon, authenticated;
GRANT ALL ON public.commercial_partner_applications TO service_role;

ALTER TABLE public.commercial_partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit partner applications"
ON public.commercial_partner_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND char_length(responsible_name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 255
  AND char_length(company_name) BETWEEN 2 AND 200
  AND char_length(cnpj) BETWEEN 11 AND 20
  AND char_length(business_type) BETWEEN 2 AND 60
  AND char_length(city) BETWEEN 2 AND 120
  AND char_length(state) = 2
);

CREATE TRIGGER update_commercial_partner_applications_updated_at
BEFORE UPDATE ON public.commercial_partner_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.lipolovers_leads
ADD COLUMN claim_token_hash text UNIQUE;

CREATE INDEX idx_lipolovers_leads_claim_token_hash
ON public.lipolovers_leads (claim_token_hash)
WHERE claim_token_hash IS NOT NULL;
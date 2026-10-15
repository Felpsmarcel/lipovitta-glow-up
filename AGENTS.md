# Project architecture

- Keep the Pré Black campaign configuration and countdown rules in `src/config/preBlack.ts`; a single source prevents inconsistent dates and unconfirmed WhatsApp destinations.
- Scope Pré Black styles and native motion to its page and dedicated hook/components; existing pages and tracking flows must remain unaffected.
- Keep `/black` as a redirect to `/pre-black` preserving query and hash, so campaign links share one page and retain attribution.- Keep campaign-insight sales aggregation in `supabase/functions/campaign-insights/aggregate.ts` (pure, vitest-covered); only paid, non-test, non-canceled orders may reach the AI, never customer PII.

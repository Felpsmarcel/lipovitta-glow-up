# Project architecture

- Keep the Pré Black campaign configuration and countdown rules in `src/config/preBlack.ts`; a single source prevents inconsistent dates and unconfirmed WhatsApp destinations.
- Scope Pré Black styles and native motion to its page and dedicated hook/components; existing pages and tracking flows must remain unaffected.
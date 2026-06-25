## Goal
Resolve the medium-severity dependency advisories flagged by the supply-chain scanner.

## Changes
- Bump `react-router-dom` from 6.30.1 to the latest patched 6.x release (>=6.31 / current 6.x) to pick up the fixed `react-router` that addresses the open-redirect advisories.
- Bump `recharts` from 2.15.4 to the latest 2.x release that ships a patched `lodash` (>=4.17.21 transitively) to clear the prototype-pollution advisories.
- Run `bun install` to refresh the lockfile, then re-run the dependency scan to confirm both findings are cleared.
- Mark the finding as fixed via `manage_security_finding` once resolved.

## Notes
- Staying within the same major versions (react-router 6.x, recharts 2.x) to avoid breaking API changes in the app's routing and charts.
- No application code changes expected; this is a dependency-only update.

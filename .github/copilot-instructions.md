# Copilot instructions: fcp-sfd-frontend

## What this is

Frontend service for the Single Front Door (SFD) on Defra's Future Farming and Countryside Programme. A Hapi.js server with Nunjucks templates using GOV.UK Frontend, serving **farmers and land managers** to view and manage their business and personal details. Data flows through the DAL (`fcp-dal-api`) via GraphQL to Rural Payments (KITS) upstream services.

`fcp-sfd-frontend-internal` is the sibling service for internal staff/caseworkers. Shared code lives in `@defra/fcp-sfd-frontend-engine` (see [Shared engine](#shared-engine)).

## Stack

- Node **>= 24**, ESM (`"type": "module"`) throughout — use `import`/`export`, file extensions required (`./file.js`).
- Hapi 21, Nunjucks + GOV.UK Frontend, Webpack (client assets), convict (config), Joi (validation).
- Session: `@hapi/yar` over Catbox (Redis in prod, memory locally).
- Auth: **Defra ID** via OpenID Connect (`@hapi/bell`).
- Tests: Vitest. Lint: **neostandard** (via eslint) + stylelint. No semicolons, 2-space indent.
- Platform: deployed on Defra CDP. Outbound HTTP goes through a proxy — `global-agent` bootstrapped in `src/server/common/helpers/proxy/setup-proxy.js`, `https-proxy-agent` configured in `src/utils/proxy.js` — and CDP secure context (`src/plugins/secure-context/`); metrics via `@defra/cdp-metrics`, tracing via `@defra/hapi-tracing`.

## Commands

**Everything runs in Docker.** The service can't run standalone — it depends on other services (DAL, upstream-mock, Redis, Mongo, Defra ID stub) that come up together via `docker compose`. Do not suggest host `npm run dev` / `npm start` / `npm run build`; they won't produce a working app on their own.

- `docker compose up` — run the full stack (frontend + all dependencies)
- `npm run docker:debug` — full stack with the Node debugger attached
- `npm run docker:test` — **run the full test suite (see Testing)**
- `npm run docker:test:watch` — full test suite in watch mode
- `npm run lint` / `npm run lint:fix` — neostandard + stylelint / auto-fix (the one thing safe to run on the host)

## Architecture

### Request lifecycle

`Routes → Services → DAL connector → fcp-dal-api (GraphQL) → KITS upstream`

- **Routes** (`src/routes/`): Hapi route definitions with GET/POST handlers, organised by domain (`personal/`, `business/`, `footer/`, `errors/`). Keep handlers thin — delegate to services.
- **Services** (`src/services/`): Business logic. Fetch data, orchestrate mutations, manage session state. Grouped by domain + shared services.
- **DAL** (`src/dal/`): GraphQL connector singleton initialised at server startup. Existing queries live locally in `queries/`; mutation definitions are imported from `@defra/fcp-sfd-frontend-engine` (`mutations/` only holds local section-map helpers for building dynamic update payloads) — see [New DAL query](#common-tasks) for where new ones should go.
- **Presenters** (`src/presenters/`): Transform data for view rendering, organised by domain. Shared formatting (addresses, phone numbers, back links) comes from the engine's `presenters` namespace export (`@defra/fcp-sfd-frontend-engine`) — e.g. `presenters.formatBackLink()`, `presenters.formatDisplayAddress()` — not a local base presenter.
- **Mappers** (`src/mappers/`): Transform DAL responses into domain objects used by services/presenters.
- **Schemas** (`src/schemas/`): Joi validation for DAL response shapes. Form payload schemas are shared, so they live in the engine and are used as `schemas.<domain>.<field>`.
- **Views** (`src/views/`): Nunjucks templates. `common/` has shared layout partials, `components/` reusable macros.
- **Plugins** (`src/plugins/`): Hapi server assembly, registered from `src/plugins/index.js` — routing (`router.js`), auth strategies (`auth.js`, `sso.js`), security (`content-security-policy.js`, `headers.js`, `secure-context/`), session, request logging/tracing, error handling, and template rendering.
- **Auth helpers** (`src/auth/`): Defra ID / OIDC support — token verification and refresh, permissions, SBI resolution, sign-out URL.

### Key patterns

- **DAL connector**: singleton initialised in `src/server.js` via `initDalConnector()`; services access it via `getDalConnector()`. Handles auth tokens (M2M + forwarded user token) automatically.
- **Credentials**: `{ sbi, crn, sessionId }` (sometimes `email`, `token`, `enrolmentCount`) live on `auth.credentials`. Destructure in the route and pass a service only the values it uses; always pass `{ sessionId }` to `dalConnector.query()` for authenticated calls. During OIDC sign-in (before the session cache is populated) pass `{ forwardedUserToken }` instead.
- **Cache**: session cache via `request.server.app.cache` — `.get(sessionId)` / `.set(sessionId, data, ttl)`. Re-fetch from DAL on cache miss.
- **Change/Fix journeys**: two-phase pattern — "change" routes let users edit one field; "fix" routes (interrupters) force users to correct invalid data before proceeding.
- **Address lookup**: postcode/address search via OS Places (`src/services/os-places/address-lookup-service.js`); a stub is used when `OS_PLACES_STUB=true`.
- **Flash notifications**: one-shot confirmation banners shown after a successful change via `src/utils/notifications/flash-notification.js` (session-backed, cleared on read).
- **Feature toggles**: boolean env vars via `src/config/feature-toggle.js` (convict).
- **Config**: convict with strict validation, split across `src/config/` by concern. Read with `config.get('path.to.value')`. See `.env.example`.
- **Errors**: throw Boom errors in routes (`Boom.badRequest()`, `Boom.notFound()`). Two separate `onPreResponse` extensions handle them: one registered in `src/plugins/errors.js`, and another (`catchAll`) registered directly in `src/server.js` from `src/utils/errors.js`.

### Client-side assets

Webpack bundles `src/client/` → `.public/`. Entry points: `src/client/javascripts/application.js` + `src/client/stylesheets/application.scss`. GOV.UK Frontend assets are copied in; asset manifest is used for cache-busting in production.

## Testing

**Always run tests in Docker: `npm run docker:test`.** Host `vitest` / `npm test` runs fail — integration tests need dependent services (DAL API, upstream-mock, Redis) that only `compose.test.yaml` provides. Watch mode: `npm run docker:test:watch`.

- **Unit tests** (`test/unit/`): mirror `src/` structure. Pure logic with `vi.mock`.
- **Integration tests** (`test/integration/narrow/`): spin up a real Hapi server (Redis mocked to CatboxMemory). Use `server.inject()` to test routes end-to-end. Import `test/mocks/setup-server-mocks.js` for OIDC/Redis stubbing.
- Test files must match `**/test/**/*.test.js`.

## Shared engine

`@defra/fcp-sfd-frontend-engine` holds code shared between `fcp-sfd-frontend` and `fcp-sfd-frontend-internal`. The internal (staff) service is being built to mirror this external (customer) one, with shared logic progressively extracted into the engine rather than duplicated. When adding or refactoring logic that exists in both services, prefer moving it into the engine.

- **Belongs in the engine** (generic, not tied to either service): Joi schemas, DAL queries, utility functions, presenter utils and mappers.
- **Must NOT go in the engine**: routes, authentication logic, anything coupled to request/response handling, and complex orchestration that needs back-and-forth between services.
- **Deliberate differences — do not unify these in the engine**: external (this repo) uses **Defra ID** auth and an external DAL gateway (Defra ID token) and has customer permission levels; internal uses **Microsoft Entra** and an internal gateway (user email in headers) with no permission levels.

## Common tasks

- **New service**: `src/services/{domain}/<verb>-<domain>-<field>-service.js`.
- **New route**: `src/routes/{domain}/{domain}-{field}-{change|check}-routes.js`, registered in `src/routes/routes.js`.
- **New DAL query**: add generic GraphQL queries to `@defra/fcp-sfd-frontend-engine`, then import the engine export in the service and call `dalConnector.query(query, variables, { sessionId })`.
- **Business selection/switching** (multiple enrolments): presenter adds link only when `enrolmentCount > 1`; route passes `auth.credentials.enrolmentCount`; template guards navigation with `{% if backLink %}`; auth plugin sets `forceReselection` for the route path to trigger Defra ID reselection.

## References

- Hapi — https://hapi.dev/
- GOV.UK Frontend / Design System — https://design-system.service.gov.uk/
- Environment config — `.env.example`

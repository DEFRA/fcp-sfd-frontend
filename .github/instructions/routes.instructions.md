---
description: Conventions for Hapi route modules.
applyTo: 'src/routes/**/*.js'
---

# Route conventions

- One journey step per file, named `<domain>-<field>-<change|check>-routes.js`.
- Define one `const` per method (`getX`, `postX`) as `{ method, path, handler }`, and export the set as an inline array: `export const xRoutes = [getX, postX]`. (Services, presenters and schemas use a trailing `export { }` block; routes keep the array export.)
- When a route needs `options`, the handler moves **inside** `options` alongside `auth` / `validate` / `pre` — so a validated POST is `{ method, path, options: { validate: { … }, handler } }`.
- Handlers are **thin**: destructure what's needed from `request`, call a service, pass its result to a presenter → `return h.view('<domain>/<template>', pageData)`. No business logic, no DAL calls in routes.
- **Change step (POST)** validates via `options.validate`: `payload: schemas.<domain>.<field>`, `options: { abortEarly: false }`, and a `failAction` that re-renders the same view with `utils.formatValidationErrors(err.details)` and `.code(constants.statusCodes.BAD_REQUEST).takeover()`.
- On a valid change POST: `setSessionData(...)` then `h.redirect('<next-step>')`. The **check step** POST calls the update service, then redirects to the details page.
- **Guard permissions with `options.auth.scope`** on every route that views or changes business details, using the permission arrays from `src/constants/scope/business-details.js` (`VIEW_PERMISSIONS`, `AMEND_PERMISSIONS`, `LEGAL_PERMISSIONS`, `FULL_PERMISSIONS`) — e.g. `options: { auth: { scope: AMEND_PERMISSIONS } }`. Apply the same scope to **both** the GET and the POST of a step, and choose the narrowest that fits: name / VAT / legal-status changes use `FULL_PERMISSIONS`, address / email / phone changes use `AMEND_PERMISSIONS`, the details page uses `VIEW_PERMISSIONS`.
- **Guard journey order with a `pre` handler** instead of repeating the check in each handler: `options: { pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessVat')] }`, importing `checkSessionDataGuard` from `src/routes/pre-handlers.js` and the journey constant from `src/constants/journeys.js`. Pass an array when a step needs several fields (`['changeBusinessPostcode', 'changeBusinessAddresses']`). It redirects to `journey.redirectPath` with `.takeover()` when data is missing, so check and select steps can't be deep-linked.
- Group engine imports: `import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'`.
- `path` is the public URL; keep the GET and POST paths identical for a step.
- **Pass only what's used**: extract the specific values a handler needs into variables and pass those to services/presenters, not whole `request` or `credentials` objects.
- Destructure what the handler needs from `request` at the top of the handler, e.g. `const { payload, yar, auth } = request`; only reach for `request.x` inline in a one-line handler.
- **External vs internal paths — do not unify.** This (external) service acts on the logged-in user, so paths carry no customer id (`/account-email-change`) and routes have no `params`. The internal service acts on a looked-up customer and uses `/customer/{crn}/...` with a `validateCrn` pre-handler. Keep this repo's paths customer-id-free, and take ids from the mapped data or `auth.credentials` rather than the path.

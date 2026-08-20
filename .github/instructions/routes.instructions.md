---
description: Conventions for Hapi route modules.
applyTo: 'src/routes/**/*.js'
---

# Route conventions

- One journey step per file, named `<domain>-<field>-<change|check>-routes.js`.
- Define one `const` per method (`getX`, `postX`) as `{ method, path, handler }`, and export the set as an array: `export const xRoutes = [getX, postX]`.
- Handlers are **thin**: destructure what's needed from `request`, call a service, pass its result to a presenter → `return h.view('<domain>/<template>', pageData)`. No business logic, no DAL calls in routes.
- **Change step (POST)** validates via `options.validate`: `payload: schemas.<domain>.<field>`, `options: { abortEarly: false }`, and a `failAction` that re-renders the same view with `utils.formatValidationErrors(err.details)` and `.code(constants.statusCodes.BAD_REQUEST).takeover()`.
- On a valid change POST: `setSessionData(...)` then `h.redirect('<next-step>')`. The **check step** POST calls the update service, then redirects to the details page.
- Group engine imports: `import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'`.
- `path` is the public URL; keep the GET and POST paths identical for a step.
- **Pass only what's used**: extract the specific values a handler needs into variables and pass those to services/presenters — not whole `request`, `credentials`, or `params` objects.
- Destructure what the handler needs from `request` once at the top, e.g. `const { payload, yar, auth, params } = request`.
- Take the record id (`sbi` / `crn`) from `params` — validated by the `pre` handler — **never from session**; `params` is the reliable source.
- Export the route set as an inline array: `export const xRoutes = [getX, postX]`. (Services, presenters and schemas use a trailing `export { }` block; routes keep the array export.)
- When a step needs a shared guard or lookup, use a Hapi `pre` handler in `options.pre` rather than repeating it in each handler (as the internal service does with `validateCrn`).
- **External vs internal paths — do not unify.** This (external) service acts on the logged-in user, so paths carry no customer id (`/account-email-change`). The internal service acts on a looked-up customer and uses `/customer/{crn}/...` with a `validateCrn` pre-handler. Keep this repo's paths customer-id-free.

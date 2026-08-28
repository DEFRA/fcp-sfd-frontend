---
description: Conventions for service-layer modules (business logic, DAL access, session handling).
applyTo: 'src/services/**/*.js'
---

# Service conventions

- One service per file, named `<verb>-<domain>-<field>-service.js` — verbs in use: `fetch-`, `update-`, `validate-`, `build-`, `set-`.
- Export a single named function via a **trailing `export { xService }` block** (not inline `export const`).
- Use a named arrow function: `const xService = async (yar, …values) => { … }`.
- Keep services free of Hapi request/response plumbing (no `h`, no `request`, no view rendering).
- **Pass only the specific values the service uses** — not the whole `credentials` object (see the 'pass only what's used' rule in routes).
- **Update services**: fetch the pending change from session first (`fetchPersonalChangeService`), then **guard with an early return** when the field is undefined/unchanged, before touching the DAL.
- Run mutations through `updateDalService(mutation, variables, <auth>)` — never call the DAL connector directly from a feature service.
- Build the mutation `variables` via the shared **build-update-variables util** (engine target — today `build-<domain>-update-variables-service`), rather than an inline `{ input: { … } }` in each service.
- After a successful mutation: **clear the session** (`yar.clear('personalDetailsUpdate')`), then `flashNotification(yar, 'Success', <message>)`.
- **Success messages come from the shared catalogue in the engine** (`constants.successMessages.<KEY>`), not inline strings.
- **Clear the session, don't get-and-reset it.** Do not read-then-rewrite the session bag or re-set ids (e.g. SBI) back into session — take ids from the mapped data or credentials instead. This follows the personal-details pattern.
- Session bag is `personalDetailsUpdate`; pending fields use the `change<Field>` prefix (e.g. `changePersonalEmail`).
- File-level JSDoc using `/**`, with `@module` and a one-line summary of what the service does; add `@param` only when an argument isn't self-evident.
- DAL mutations always go through `updateDalService` — a deliberately thin happy-path wrapper that throws on `response.errors`. Don't add bespoke DAL error handling in feature services; let it throw and be caught by the global handler. (Sanctioned pattern — identical in both the external and internal services.)
- **Data access differs by service — do not unify.** This (external) service authenticates DAL calls with `sessionId` (from Defra ID); internal uses the user `email` (header gateway). Pass whichever value the service needs (plus ids like `sbi`) and keep the two auth models separate.

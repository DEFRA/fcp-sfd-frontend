---
description: Conventions for schema modules (Joi validation).
applyTo: 'src/schemas/**/*.js'
---

# Schema conventions

- `src/schemas/` currently holds **DAL response** schemas (see `src/schemas/dal/`) — validating data coming back from the DAL.
- One schema per file, named `<thing>-schema.js`; export via a trailing `export { }` block, matching services and presenters.
- Callers validate with `{ abortEarly: false }` so every field error surfaces at once.
- **Placement (engine vs local) follows the shared-code rule — not a blanket policy.** Validation shared by both the external and internal services lives in the engine (imported as `schemas.<domain>.<field>`); validation specific to one service stays local. Shared-code migration is ongoing, so check where a given schema already lives before adding alongside it.

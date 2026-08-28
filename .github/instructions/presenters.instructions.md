---
description: Conventions for presenter modules (shape data for Nunjucks views).
applyTo: 'src/presenters/**/*.js'
---

# Presenter conventions

- **Pure function** — no side effects, no DAL access. Signature `(data, payload) => ({ … })`; the primary data parameter is named **`data`** (not `personalDetails` / `businessDetails`).
- Details and list presenters take the extra arguments they need after `data`, e.g. `(data, yar, hasValidPersonalDetails, sectionsNeedingUpdate)`. Reading the one-shot banner with `yar.flash('notification')[0]` is the **only** permitted session access — form presenters stay `(data, payload)`.
- Export via a trailing `export { xPresenter }`.
- File-level `/**` `@module` JSDoc naming the page it formats.
- Return a **flat object** leading with `backLink`, `pageTitle`, `metaDescription`, then the view fields.
- Direct-GET fallback chain so a page renders when there's no pending session change: `payload?.<field> ?? data.change<Field>?.<field> ?? data.<field>`, where `data.<field>` is the **flat, mapper-provided value** (e.g. `data.userName`, `data.businessEmail`) — see mappers conventions. Use `?? null` for optional display fields.
- Use **engine presenter utils** for shared formatting (dates, addresses, phone numbers) rather than re-implementing — e.g. `presenters.formatDateInputValues(...)` ([personal-dob-change-presenter.js](../../src/presenters/personal/personal-dob-change-presenter.js)).
- Source change links from the `PERSONAL_CHANGE_LINKS` / `BUSINESS_CHANGE_LINKS` constants in the local repo (`src/constants/`), not inline literals.

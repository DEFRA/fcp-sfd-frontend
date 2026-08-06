---
description: Conventions for Nunjucks view templates.
applyTo: 'src/views/**/*.njk'
---

# View conventions

- Use GOV.UK Frontend macros/components; don't hand-roll markup for standard components.
- Back link: call `{{ appBackSignOutLink(backLink) }}`, passing the presenter's `backLink` object **directly** — it already carries `{ backLink: true, href }`. Do not reconstruct the object in the template (e.g. `{ backLink: backLink, href: backLink.href }`).

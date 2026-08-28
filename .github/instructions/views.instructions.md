---
description: Conventions for Nunjucks view templates.
applyTo: 'src/views/**/*.njk'
---

# View conventions

- Use GOV.UK Frontend macros/components; don't hand-roll markup for standard components.
- Back link: `appBackSignOutLink(params)` reads `params.text` (defaults to "Back") and `params.href` (defaults to "/"). Pass it a shape matching that:
  - Presenter-supplied `backLink` is already `{ href }` or `{ text, href }` — pass it **directly**, `{{ appBackSignOutLink(backLink) }}`, don't reconstruct it.
  - Error and footer pages take `backLink` as a plain URL string from `request.headers.referer`, so wrap it: `{{ appBackSignOutLink({ href: backLink }) }}`.

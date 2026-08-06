---
description: Conventions for mapper modules (transform DAL responses into view-ready domain objects).
applyTo: 'src/mappers/**/*.js'
---

# Mapper conventions

- Named function, trailing `export { }`, `/**` `@module` JSDoc — same module style as services and presenters.
- **Output a flat, top-level shape** ready for presenters: `data.userName`, `data.businessEmail`, `data.businessName` — not nested `data.info.businessName` / `data.contact.email`. Flattening improves readability and gives presenters a consistent shape to read from.
- Map only the fields the views actually need; don't pass the raw DAL response shape straight through.

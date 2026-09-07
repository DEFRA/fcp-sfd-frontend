---
name: standards
description: Standard skills and patterns an agent should apply when working in this codebase
---

# Standards skill

## Context

This document defines the standards an agent must apply when reviewing or writing code in this project.

## Core principles

- Solve the problem as stated — do not over-engineer or anticipate future requirements
- Follow existing patterns in the codebase before introducing new ones
- Verify work before marking a task complete
- Run project commands in Docker (`docker compose exec dev ...`) or via VS Code tasks; do not run Node/NPM commands on the host

## Reading code

- Read the full function and its callers before making changes
- Check for existing utilities before writing new ones
- Use `grep` / search to find all usages of a symbol before renaming or removing it

## Writing code

- Match the style and conventions of the surrounding code
- All internal `import` paths must include the `.js` extension
- All `import` statements must be at the top of the file, after the `@module` JSDoc and before any function definitions
- No inline comments unless the *why* is genuinely non-obvious
- JSDoc is required on all public functions — use `@param`, `@returns`, and a description; controllers, seeds, and routes files are exempt from `@module` JSDoc
- The `@module` tag's description text (the comment line above it) must exactly match the first line of the default export function's own JSDoc description. This is unrelated to naming/casing — see "Naming conventions" below for how the `@module` value and the function name are each derived; they are independent conventions and will not always correspond
- No error handling for scenarios that cannot happen
- No abstractions for a single use case
- Private functions must be ordered alphabetically by name

## Refactoring

- Refactor in a separate commit from behaviour changes
- Do not rename or restructure things incidentally while fixing bugs

## Quality gates

Before completing any task:

1. Lint checks pass
2. Tests pass
3. No `console.log`, `console.dir`, or `describe.only` present
4. No commented out code
5. No unintended files changed

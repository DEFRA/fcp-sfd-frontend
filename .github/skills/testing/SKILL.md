---
name: testing
description: Testing standards and conventions for this project. Use when writing tests, reviewing test changes, or asked how to test frontend behaviour.
---

# Testing skill

## Framework

- Use `vitest`.
- Import test APIs explicitly from `vitest`.
- Test files are ESM and internal imports use `.js` extensions.

## Test layout

- Test files must match `**/test/**/*.test.js`.
- Unit tests live in `test/unit/` and mirror `src/`.
- Integration tests live in `test/integration/narrow/`.
- Integration route tests use `server.inject()` and can reuse stubs from `test/mocks/setup-server-mocks.js`.
- Test structure rules live in `.github/instructions/tests.instructions.md`.

## Test file structure and comments

Organize imports and declarations at the top of test files with these standard comments (in order, excluding groups not needed):

```js
// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Mocks
vi.mock('path/to/module-a.js', () => ({
  exportedFunction: vi.fn()
}))

vi.mock('path/to/module-b.js', () => ({
  exportedThing: vi.fn()
}))

// Test helpers
import { constants } from '@defra/fcp-sfd-frontend-engine'
import { testUtilityFunction } from '../../support/test-helpers.js'
import { exportedFunction, exportedThing } from 'path/to/module-a.js'

// Things under test
import { functionBeingTested } from '../../../src/services/my-service.js'
```

**Rules:**
- Each group must have a comment label
- Mocks must come before their corresponding imports
- Groups are listed alphabetically within each section
- Omit a group entirely if not needed (don't add empty sections)
- Test helpers include mocked imports, constants, and app utilities needed for testing
- "Things under test" contains only the actual code being tested

## Mocking and isolation

- Valid patterns in this repo include `vi.mock()`, `vi.doMock()`, `vi.spyOn()`, and `vi.fn()`.
- Reset or clear mocks between tests (for example `vi.clearAllMocks()`, `vi.resetModules()`, and `vi.restoreAllMocks()`).
- Never commit `describe.only()` or `it.only()`.

## Review expectations

- New or changed behaviour includes happy-path and key error-path coverage.
- Test names describe behaviour clearly.
- For review work, inspect tests first. If runtime verification is needed, ask the author to run Docker tests.

## Running tests

- Full suite in Docker: `npm run docker:test`.
- Watch mode in Docker: `npm run docker:test:watch`.
- Single-file run in Docker: `docker compose down -v; docker compose -f compose.yaml -f compose.test.yaml run --rm fcp-sfd-frontend npx vitest run <path-to-test-file>`.
- Do not rely on host `vitest` or `npm test` for full-suite verification.

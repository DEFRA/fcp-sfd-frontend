---
description: Conventions for Vitest unit tests.
applyTo: 'test/**/*.test.js'
---

# Test conventions

- Tests run in Docker (`npm run docker:test`) — see `.github/copilot-instructions.md`.
- Vitest only. Use `test(...)`, never `it(...)`; import from `vitest`.
- Mirror the `src/` structure — a test lives at the matching relative path under `test/unit/`.
- Use section comment banners in this order: `// Test framework dependencies`, `// Things we need to mock`, `// Test helpers`, `// Thing under test`, `// Mocks`.
- `vi.mock(...)` collaborators at module top; `vi.clearAllMocks()` in `beforeEach`.
- Nested `describe` blocks per scenario (`when …`, `the "X" property`), each setting its own state in `beforeEach`.
- **Presenter tests**: assert the whole returned object with `toEqual`, plus a `describe` per fallback property.
- **Service tests**: assert `updateDalService` was called `toHaveBeenCalledWith(mutation, { input: { … } }, sessionId)`, that the session was cleared, that a flash notification was added, and cover the early-return path when nothing changed.
- **Route tests**: destructure `const [getX, postX] = xRoutes`; call `getX.handler(request, h)` (or `postX.options.handler` for a validated POST); stub `h.view`/`h.redirect` with a response stub exposing chainable `code`/`takeover`. Assert method, path, service calls, and the view name + page data.
- Mock data comes from `test/mocks/` helpers (e.g. `mock-personal-details.js`) — do not hand-build fixtures inline when a helper exists.

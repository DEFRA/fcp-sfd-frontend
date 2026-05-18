# Code Review: resolve-merge-conflicts

**Date:** 16/04/2026 14:53
**Reviewer:** GitHub Copilot
**Grade:** D

## Summary

This branch resolves merge conflicts and removes several npm packages (`global-agent`, `date-fns`, `moment`, `cheerio`, `graphql`, `http-status-codes`, `https-proxy-agent`) to reduce the attack surface from supply-chain vulnerabilities. The replacements with native APIs (`Intl.DateTimeFormat`, `Date`, custom status-code constants) are generally sound, but **two critical bugs** were introduced: broken import paths in `setup-proxy.js` and an undefined `HttpsProxyAgent` reference in `src/utils/proxy.js`.

## Commits Reviewed

| SHA | Message |
|-----|---------|
| cd9bf9a | resolve merge conflicts |
| 624b5c9 | chore: remove packages after conflict resolution |

## Changed Files

| File | Status | Verdict |
|------|--------|---------|
| .npmrc | Modified | OK |
| package.json | Modified | Major Issues |
| package-lock.json | Modified | N/A (generated) |
| src/constants/status-codes.js | Modified | OK |
| src/plugins/template-renderer/filters/format-date.js | Modified | Minor Issues |
| src/presenters/personal/personal-details-presenter.js | Modified | OK |
| src/presenters/personal/personal-dob-check-presenter.js | Modified | OK |
| src/presenters/personal/personal-fix-check-presenter.js | Modified | OK |
| src/server.js | Modified | OK |
| src/server/common/helpers/proxy/setup-proxy.js | Modified | Major Issues |
| src/services/personal/update-personal-dob-change-service.js | Modified | OK |
| src/utils/errors.js | Modified | OK |
| src/utils/proxy.js | Modified | Major Issues |
| test/integration/narrow/routes/signed-out-routes.test.js | Modified | Minor Issues |
| test/unit/utils/errors.test.js | Modified | OK |
| test/unit/utils/setup-proxy.test.js | Modified | OK |

## Detailed Review

### src/server/common/helpers/proxy/setup-proxy.js

**Status:** Modified

**🔴 CRITICAL — Broken import paths**

The merge conflict resolution appears to have picked up import paths from the CDP template's directory structure rather than keeping the original ones:

```js
import { config } from '../config/index.js'    // resolves to src/server/common/helpers/config/index.js — DOES NOT EXIST
import { createLogger } from './logger.js'      // resolves to src/server/common/helpers/proxy/logger.js — DOES NOT EXIST
```

The original imports were correct:
```js
import { config } from '../../../../config/index.js'
import { createLogger } from '../../../../utils/logger.js'
```

This will cause a startup crash — `setupProxy()` is called from `src/server.js` before the server starts.

**✅ Removal of `bootstrap()` and `globalThis.GLOBAL_AGENT.HTTP_PROXY` — JUSTIFIED**

Removing `global-agent` and its associated `bootstrap()` / `globalThis.GLOBAL_AGENT.HTTP_PROXY = proxyUrl` is safe and correct for this codebase because:

1. **`global-agent` patches legacy HTTP clients** (axios, request, needle, etc.) by monkey-patching Node's `http.globalAgent` and `https.globalAgent`. The fcp-sfd-frontend codebase uses **none of these libraries** — no `axios`, no `request`, no `needle`, no `got`, no `superagent` imports exist in `src/`.

2. **All outbound HTTP goes through `fetch()` + undici.** The codebase uses the native `fetch()` API (via `proxyFetch` in `src/utils/proxy.js`) and the undici `ProxyAgent` with `setGlobalDispatcher()`. The `global-agent` proxy was redundant — it was proxying at the Node `http(s).globalAgent` level, which `fetch()` does not use.

3. **The CDP template still uses `global-agent`** because it's a generic template that must support downstream services that _might_ use axios or similar clients. fcp-sfd-frontend has matured past that — it exclusively uses `fetch()` and undici, so the template's defensive measure is unnecessary here.

4. **Divergence from the template is acceptable** here. The template keeps `global-agent` as a safety net; this service has no code paths that need it. Removing it eliminates a 3.0.0 package (with its own transitive dependencies) from the attack surface.

### src/utils/proxy.js

**Status:** Modified

**🔴 CRITICAL — `HttpsProxyAgent` is undefined**

The import `import { HttpsProxyAgent } from 'https-proxy-agent'` was removed, but line 33 still references `HttpsProxyAgent`:

```js
httpAndHttpsProxyAgent: new HttpsProxyAgent(url)
```

The package `https-proxy-agent` was also removed from `package.json`. This will cause a `ReferenceError` at runtime whenever `provideProxy()` is called with a proxy URL configured.

However, `httpAndHttpsProxyAgent` is not consumed anywhere in the codebase — `provideProxy()` is exported but only `proxyFetch()` uses it internally, and `proxyFetch()` only reads `proxy.proxyAgent` and `proxy.url`. **The fix should remove the `httpAndHttpsProxyAgent` property entirely** rather than restoring the dependency.

### package.json

**Status:** Modified

**Removed packages assessment:**

| Package | Removal Safe? | Notes |
|---------|--------------|-------|
| `global-agent` | ✅ Yes | No axios/request usage; undici handles all proxying |
| `date-fns` | ✅ Yes | Replaced with native `Intl.DateTimeFormat` + custom code |
| `moment` | ✅ Yes | Replaced with `Intl.DateTimeFormat` and manual ISO formatting |
| `cheerio` | ✅ Yes | Only used in one test; replaced with regex |
| `graphql` | ✅ Yes | No imports found in `src/` |
| `http-status-codes` | ✅ Yes | Replaced with local `status-codes.js` constants |
| `https-proxy-agent` | ⚠️ Partial | Import removed but usage remains (see above) |

**`ioredis` version bump** from 5.10.1 → 5.4.1 is a **downgrade**, not an upgrade. This may have been an artefact of conflict resolution.

**`.npmrc` change:** Adding `save-exact=true` is good practice for reproducibility.

### src/plugins/template-renderer/filters/format-date.js

**Status:** Modified

Solid replacement of `date-fns` with native APIs. The custom `formatWithPattern` function is well-structured with literal escaping, ordinal suffix handling, and `Intl.DateTimeFormat` for locale-aware month/weekday names.

**Minor observation:** Only a subset of `date-fns` format tokens are supported (`yyyy`, `MMMM`, `EEEE`, `EEE`, `do`, `h`, `mm`, `aaa`). This is fine if these are the only tokens used in the codebase's Nunjucks templates, but the function will silently pass through unsupported tokens rather than erroring — this is acceptable behaviour for a template filter.

### src/presenters/personal/personal-details-presenter.js

**Status:** Modified

Good replacement of `moment` with native `Date` and `Intl.DateTimeFormat`. The future-date check correctly uses end-of-day (23:59:59.999) for comparison, matching `moment`'s `isAfter(moment(), 'day')` semantics.

### src/presenters/personal/personal-dob-check-presenter.js

**Status:** Modified

Improvement: changed from `new Date([`${month}/${day}/${year}`])` (array-wrapped string, locale-ambiguous `M/D/Y` format) to `new Date(Number(year), Number(month) - 1, Number(day))` which is explicit and unambiguous. Good change.

### src/presenters/personal/personal-fix-check-presenter.js

**Status:** Modified

Same pattern as above. Added a validity check (`Number.isNaN`) which is an improvement over the previous code that would pass `Invalid Date` to moment.

### src/services/personal/update-personal-dob-change-service.js

**Status:** Modified

Replaced `moment` locale trick (`moment.locale('en-ca')` → `moment().format('L')` → `YYYY-MM-DD`) with explicit ISO formatting. Cleaner and avoids a global locale side-effect.

### src/utils/errors.js

**Status:** Modified

Clean 1:1 swap from `http-status-codes` `StatusCodes` enum to local constants. No logic changes.

### src/constants/status-codes.js

**Status:** Modified

Added `INTERNAL_SERVER_ERROR = 500` and `SERVICE_UNAVAILABLE = 503`. Values are correct.

### test/integration/narrow/routes/signed-out-routes.test.js

**Status:** Modified

Replaced `cheerio` HTML parsing with a regex. The regex works for this specific test case but is fragile — it assumes `id="main-content"` appears on the `<main>` tag and `<h1>` follows directly. This is acceptable for a narrow integration test targeting known HTML output, but worth noting if the template structure changes.

### test/unit/utils/errors.test.js & test/unit/utils/setup-proxy.test.js

**Status:** Modified

Tests updated to match the new implementations. The setup-proxy test correctly removes `global-agent` mocks and `globalThis.GLOBAL_AGENT` assertions.

## Recommendations

1. **🔴 Fix broken imports in `setup-proxy.js`** — Restore the correct relative paths:
   ```js
   import { config } from '../../../../config/index.js'
   import { createLogger } from '../../../../utils/logger.js'
   ```

2. **🔴 Remove the dead `httpAndHttpsProxyAgent` property in `src/utils/proxy.js`** — The `HttpsProxyAgent` import was removed but its usage on line 33 remains. Since nothing consumes this property, remove the line entirely rather than restoring the dependency.

3. **⚠️ Verify the `ioredis` version** — The change from 5.10.1 → 5.4.1 is a downgrade. Confirm this is intentional and not a merge conflict artefact.

4. **💡 Consider extracting the `Intl.DateTimeFormat` date-formatting pattern** used identically in three presenters into a shared utility to reduce duplication:
   ```js
   new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
   ```

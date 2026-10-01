# Investigation: Defra ID repeat Unauthorised loop

Jira: [FLS2-337](https://eaflood.atlassian.net/browse/FLS2-337)

This is a live-debugging investigation only. **No application code was changed.** It
was carried out against the production environment
(`https://farm-and-land.service.defra.gov.uk` / `https://fcp-sfd-frontend.prod.cdp-int.defra.cloud`)
using browser DevTools network/cookie tracing and server/nginx log correlation.

## Original prompt

> Investigate the Defra ID authentication bug below by debugging the application live in the browser. Do not make any code changes yet and do not propose a fix until we have established what is actually happening at runtime.
>
> ### Bug
> A user can get stuck in a repeat unauthorised journey because their Defra ID session remains active after navigating back to the home page.
>
> ### Steps to reproduce
>
> 1. From the home page, select **Start now**.
> 2. Sign in via **Defra ID**.
> 3. Select a business.
> 4. The user is shown the **Unauthorised** page.
> 5. Press the browser back button twice to return to the home page.
> 6. Select **Start now** again.
> 7. The Defra ID sign-in page does not appear because the user is still signed in.
> 8. The user selects their business again and is shown the **Unauthorised** page.
>
> ### How I want you to investigate
> Use the browser/devtools to trace the real runtime behaviour rather than trying to infer the flow from the code alone.
>
> I will provide the application URL. When authentication is required, I will enter the Defra ID credentials myself. Do not ask you to handle or expose credentials.
>
> Start by inspecting the relevant application code so you understand the expected authentication/session architecture, then use the browser to reproduce the issue.
>
> During the live investigation:
>
> - Open the supplied URL and reproduce the journey step by step.
> - Use the browser Network tab to identify requests involved in:
>
> - starting authentication
> - redirecting to Defra ID
> - returning from Defra ID
> - establishing/restoring the application session
> - loading the business selection
> - reaching the unauthorised page
> - navigating back to the home page
> - selecting Start now again
> - Inspect request and response headers where relevant, particularly:
>
> - cookies
> - `Set-Cookie`
> - redirects
> - status codes
> - authentication/session-related headers
> - Inspect the browser's Application/Storage area where useful to determine what cookies or other client-side state remain after reaching the unauthorised page and returning home.
> - Use the DevTools Console to inspect relevant runtime information where possible.
> - Compare the network requests from the first authentication journey with the second journey after navigating back to the home page.
> - Establish exactly why the second journey does not redirect to Defra ID.
> - Identify which application code decides whether an existing Defra ID/application session can be reused or whether the user must authenticate again.
> - Determine whether the unauthorised page clears, preserves, or otherwise modifies any application session state.
> - Determine whether navigating back to the home page causes any session reset, or whether the browser simply continues using the existing authenticated session.
> - If useful, inspect server/application logs alongside the browser Network trace. I can provide the logs page and help correlate timestamps/request IDs with the browser requests.
>
> Do not change application code, session configuration, cookies, or authentication settings while investigating.
>
> ### Important debugging approach
> Do not assume that the original hypothesis is correct.
>
> Specifically, establish whether the problem is caused by:
>
> - the Defra ID authentication session remaining valid;
> - the application's own session remaining valid;
> - the unauthorised journey failing to clear/reset something;
> - the home page/start journey intentionally reusing an existing authenticated session;
> - browser back/forward caching;
> - a redirect decision in the authentication middleware;
> - or some interaction between these.
>
> Use evidence from the actual browser requests, cookies, console output, application logs and source code to distinguish between these possibilities.
>
> If you find something significant, explain what it proves before moving on to the next step.
>
> ### What I want from the investigation
> At the end, provide:
>
> 1. **Runtime trace** — a concise step-by-step trace of what actually happens during the reproduction, including the important browser requests, redirects, cookies/session state and relevant server-side behaviour.
> 2. **Relevant code paths** — the files/functions involved in authentication, session handling, the unauthorised journey and the Start now/home-page flow, and the role each plays.
> 3. **Evidence for the root cause** — exactly why the Defra ID sign-in page is skipped on the second attempt, distinguishing observed evidence from inference.
> 4. **Session-state behaviour** — what happens to the application session and Defra ID authentication session when the user reaches the unauthorised page, and what remains when they return to the home page.
> 5. **Likely smallest fix** — the smallest appropriate code/configuration change that would prevent the repeat unauthorised loop, without implementing it, and why that location is preferable to broader changes.
> 6. **Regression tests** — the specific test(s) that should be added or updated, and what behaviour they should prove.
> 7. **Risks** — unintended consequences, particularly around legitimate authenticated users, back-button behaviour, session persistence and other journeys that may rely on the existing authentication session.

## Conversation summary

1. Read the authentication/session architecture before touching the browser:
   [`src/plugins/auth.js`](../../../src/plugins/auth.js), [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js),
   [`src/routes/home-routes.js`](../../../src/routes/home-routes.js), [`src/plugins/errors.js`](../../../src/plugins/errors.js),
   [`src/auth/get-permissions.js`](../../../src/auth/get-permissions.js), [`src/mappers/permissions-mapper.js`](../../../src/mappers/permissions-mapper.js),
   [`src/config/defra-id.js`](../../../src/config/defra-id.js), [`src/auth/get-sign-out-url.js`](../../../src/auth/get-sign-out-url.js).
2. Opened the supplied production URL in a controlled browser session, attached Playwright-level request/response/cookie instrumentation
   (recording method, URL, `Set-Cookie`, `Location`, and the cookie store via CDP `Network.getCookies`), and captured a baseline
   cookie state before any sign-in.
3. The user typed the CRN and password themselves; credentials were never handled or seen by the agent.
4. Reproduced "journey 1" starting from the CDP-internal hostname (`fcp-sfd-frontend.prod.cdp-int.defra.cloud`) end-to-end,
   capturing every redirect and `Set-Cookie` header from `/auth/sign-in` through to the Unauthorised page.
5. Confirmed the Unauthorised page was reached with **no application session cookie (`sid`) ever issued**, and that the
   `bell-defra-id` state cookie was written against a different host than the one the return leg landed on.
6. Reproduced "journey 2" from the home page, starting from the correct public hostname (`farm-and-land.service.defra.gov.uk`),
   and confirmed sign-in completed normally (password entry, business picker, successful `/home`) — proving permissions/business
   selection were not the cause.
7. Tested both available test businesses via the public host; both authorised successfully, ruling out a permissions-based
   `Boom.forbidden` as the root cause for the reported loop.
8. Returned to the CDP-internal hostname and repeated "Start now" — reproduced the exact reported loop (no password prompt,
   no business picker, straight to Unauthorised) deterministically.
9. Cross-referenced the authoritative CDP cookie store (not just response headers) to confirm `bell-defra-id` was stranded on
   the originating host in every failing run.
10. Correlated browser-observed request timestamps against production service logs and nginx access logs (via the OpenSearch
    Dashboards logs UI, which the user signed into themselves) across 8 total `/auth/sign-in` → `/auth/sign-in-oidc` attempts,
    confirming a 100% correlation between the originating host and success/failure, and confirming the failing requests never
    reached the point of calling the DAL (`#dal-token` log line only appears on successful attempts).
11. Reported findings without proposing or making any code changes, per the investigation brief.

## Outcome

### 1. Runtime trace

**Journey 1 — entered via `fcp-sfd-frontend.prod.cdp-int.defra.cloud`**

| # | Request | Result |
|---|---|---|
| 1 | `GET cdp-int…/` | 200, only `crumb` cookie exists. No app session. |
| 2 | `GET cdp-int…/auth/sign-in` | **302** → B2C `…/oauth2/v2.0/authorize`; `Set-Cookie: bell-defra-id=…; Secure; HttpOnly; SameSite=Strict; Path=/` **on the `cdp-int` host** |
| 3 | B2C → `your-account.defra.gov.uk` (CAP) | Sets `x-ms-cpim-sso:dcidm.onmicrosoft.com_0` on `.dcidm.b2clogin.com`, `_session`/`session_cookie_registration` on `your-account…` |
| 4 | CRN + password entered, business picker shown, business selected | — |
| 5 | `POST …/oauth2/authresp` | 302 → **`https://farm-and-land.service.defra.gov.uk/auth/sign-in-oidc?state=…&code=…`** — **different host** |
| 6 | `GET farm-and-land…/auth/sign-in-oidc` | **200** (Unauthorised view). Only `Set-Cookie` is a fresh `crumb`. **No `sid` session cookie issued.** Server log: `get /auth/sign-in-oidc 200 (1ms)` |

**Journey 2 — same browser, entered via `farm-and-land.service.defra.gov.uk`**

| # | Request | Result |
|---|---|---|
| 1 | `GET farm-and-land…/` | 200, only `crumb`. Still no app session. |
| 2 | `GET farm-and-land…/auth/sign-in` | 302 → B2C; `bell-defra-id` set **on `farm-and-land…`** |
| 3 | B2C → CAP → back | **No password prompt. No business picker.** ~5s end-to-end, zero human input. |
| 4 | `GET farm-and-land…/auth/sign-in-oidc` | **302 → `/home`**; clears `bell-defra-id` (`Max-Age=0`); sets `sid` + `session`. Server log: `302 (1032ms)` preceded by `#dal-token - cache hit` |
| 5 | `GET /home` | 200 — signed in as `test-prod-2-sfd-business-1`, SBI 201086577 |

**Journey 3 — back to `cdp-int` host, Start now again:** identical to journey 1 → Unauthorised, `200 (4ms)`, ~3s with no human input. **The loop.**

### 2. Relevant code paths

| File | Role |
|---|---|
| [`src/views/start.njk`](../../../src/views/start.njk) | "Start now" is a plain link to `/auth/sign-in` — **relative**, so it stays on whatever host the user is browsing |
| [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js) | `/auth/sign-in`, `options.auth: 'defra-id'`. Unconditional — always kicks off a fresh bell/OIDC authorize. There is no "do I already have a session?" check here |
| [`src/plugins/auth.js`](../../../src/plugins/auth.js) | `getBellOptions`. `location: () => config.get('defraId.redirectUrl')` — a **static absolute URL**, independent of the incoming request host. `providerParams` adds `forceReselection` **only** for `/auth/organisation` and `/auth/reselect-business` |
| [`src/config/defra-id.js`](../../../src/config/defra-id.js) | `defraId.redirectUrl` ← `DEFRA_ID_REDIRECT_URL`, set to the public `farm-and-land…` host in prod |
| [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js) | `/auth/sign-in-oidc`, `mode: 'try'`. On bell failure it renders `unauthorised` and **returns 200 with no logging, no session clear, no IdP sign-out** |
| [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js) | The *other* Unauthorised source — `Boom.forbidden` on permissions failure → [`src/plugins/errors.js`](../../../src/plugins/errors.js) |
| [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js) | `/auth/sign-out` — if `!request.auth.isAuthenticated` it just redirects to `/` and **never calls the IdP `end_session_endpoint`** |
| [`src/auth/get-sign-out-url.js`](../../../src/auth/get-sign-out-url.js) | Builds the Defra ID sign-out URL; requires an `id_token_hint`, so it can only run when an app session exists |
| [`src/plugins/auth.js`](../../../src/plugins/auth.js) | Cookie strategy; `redirectTo` sends unauthenticated users of protected routes back to `/auth/sign-in` |

### 3. Evidence for the root cause

**Directly observed** — nginx access logs correlated with service logs, 8 attempts, zero exceptions:

| `/auth/sign-in` initiated on host | `/auth/sign-in-oidc` outcome |
|---|---|
| `fcp-sfd-frontend.prod.cdp-int.defra.cloud` (12:03:04, 12:07:43, 12:08:25, 12:10:02, 12:13:33) | **200** — Unauthorised, every time |
| `farm-and-land.service.defra.gov.uk` (12:08:49, 12:12:16, + reselect 12:13:00) | **302 → /home** — success, every time |

Note the 12:03/12:07/12:08 entries are the user's own earlier manual reproductions, before agent-driven tracing started — same signature.

Supporting evidence:

- **Cookie store (CDP `Network.getCookies`, authoritative):** `bell-defra-id` is stranded on `fcp-sfd-frontend.prod.cdp-int.defra.cloud`; `farm-and-land.service.defra.gov.uk` never receives one in the failing journeys. In the succeeding journey it is set *and* cleared with `Max-Age=0` on the public host — proof bell consumed it.
- **Response timing is a reliable discriminator:** failing `/auth/sign-in-oidc` = **1–6 ms** with **no `#dal-token` log line**. Succeeding = **1032–1886 ms**, always immediately preceded by `#dal-token`. The failing request never reaches the handler body, so `verifyToken()` and `getPermissions()` are never called.
- **Permissions are not involved:** both available businesses (SBI 201086577 and 201086588) were signed into via the public host and both reached `/home` successfully.

**Conclusion:** the Unauthorised page is the `!request.auth.isAuthenticated` branch in [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js), not `Boom.forbidden`. Bell writes its state cookie against the *browsing* host but `location` pins `redirect_uri` to the *public* host, so on the return leg bell has no state cookie to validate and `mode: 'try'` silently yields `isAuthenticated: false`.

**Why the sign-in page is skipped on attempt 2** — directly observed: `/auth/sign-in` has `auth: 'defra-id'`, so it *always* starts a fresh authorize request; the app makes no reuse decision at all. The silence comes from the **IdP**: `x-ms-cpim-sso:dcidm.onmicrosoft.com_0` on `.dcidm.b2clogin.com` plus `_session` on `your-account.defra.gov.uk` are still valid, so B2C returns a code without prompting. The business picker is skipped because `forceReselection` is only added for `/auth/organisation` and `/auth/reselect-business`, so B2C reuses the remembered `currentRelationshipId`.

**Ruled out by evidence:** permissions/`Boom.forbidden` (both businesses authorise; timing shows DAL never called) · the application session remaining valid (no `sid` ever existed in the failing journeys — and in journey 3 a valid `sid` existed on the public host yet the outcome was still Unauthorised, so it is not consulted) · bfcache (every step produced a real network request with a fresh `state`) · a redirect decision in middleware (`/auth/sign-in` is unconditional).

### 4. Session-state behaviour

**On reaching Unauthorised:** the handler returns before `cache.set()` and `request.cookieAuth.set()`, so **no Redis session and no `sid` cookie are ever created**. The response is `200` — not 401/403. Nothing is cleared because nothing was created. `bell-defra-id` is left **uncleared** on the originating host (bell only clears it on success).

**What survives on returning to the home page:** the full IdP authentication state — `x-ms-cpim-sso:dcidm.onmicrosoft.com_0` (`.dcidm.b2clogin.com`) and `_session`, `_session.legacy`, `session_cookie_registration`, `ASLBSA` (`your-account.defra.gov.uk`). Nothing in the app's own journey touches these.

**Compounding factor:** the escape hatch is also broken. `/auth/sign-out` guards on `request.auth.isAuthenticated`; with no `sid` it redirects to `/` without ever calling the IdP `end_session_endpoint`. Observed at 12:08:45 — `get /auth/sign-out 302` then `get / 200`, and the next sign-in 3s later was still silent. **The user cannot break the loop from inside the service.**

### 5. Likely smallest fix

Two distinct defects. The loop is the symptom; the host mismatch is the trigger.

**Primary (stops the Unauthorised appearing at all): make bell's `redirect_uri` match the host the user is on.** In [`src/plugins/auth.js`](../../../src/plugins/auth.js), `location` already receives `request` but ignores it. Deriving the origin from the request (validated against an allow-list of permitted hosts — never trust `Host`/`X-Forwarded-Host` unfiltered) keeps the state cookie and the return leg on the same host.

Cheaper alternative if only one public host is ever meant to be used: redirect any non-canonical host to the canonical one at the edge or in an `onRequest` extension, so `/auth/sign-in` can never be initiated from `cdp-int`. This has zero auth-code risk, but it does mean the `cdp-int` URL stops working for testers.

**Secondary (breaks the loop even if auth legitimately fails): make the Unauthorised branch terminal rather than silently repeatable.** In [`src/routes/auth-routes.js`](../../../src/routes/auth-routes.js), log the bell failure (`request.auth.error`) — currently a completely silent failure, which is why this was hard to diagnose — return a non-200 status, and give the page an explicit escape route that performs a real Defra ID sign-out.

**Why these locations:** both are single, narrowly scoped changes inside the OIDC callback path. They do not touch the cookie strategy, the session cache, `validateToken()`, token refresh, or any authenticated route — so no existing signed-in journey changes behaviour. Broader alternatives (forcing `prompt=login`/`forceReselection` on `/auth/sign-in`, or dropping the IdP session on every failure) would re-prompt or re-pick a business for *every* user including legitimate ones, and would mask the real `redirect_uri` defect rather than fixing it.

### 6. Regression tests

Existing coverage to extend: [`test/unit/routes/auth-routes.test.js`](../../../test/unit/routes/auth-routes.test.js) and [`test/integration/narrow/routes/auth-routes.test.js`](../../../test/integration/narrow/routes/auth-routes.test.js).

1. **Unit — `getBellOptions().location(request)`** (new; currently untested). Prove it returns an origin derived from the request host for each allow-listed host, and falls back to the configured default for an unknown/spoofed `Host`. This is the test that would have caught the bug.
2. **Unit — `/auth/sign-in-oidc` unauthenticated branch.** Extend the existing test to assert the failure is logged and the response code is not 200.
3. **Integration — same-host round trip.** `server.inject()` `/auth/sign-in`, capture the `bell-defra-id` `Set-Cookie` and its host scope, assert the `redirect_uri` in the `Location` header targets the same host.
4. **Integration — loop prevention.** After an unauthenticated `/auth/sign-in-oidc`, assert no `sid` cookie is set *and* that the rendered page offers a route that performs a full IdP sign-out.
5. **Unit — `/auth/sign-out` with no app session.** Assert it still terminates the Defra ID session rather than bare-redirecting to `/`.

### 7. Risks

- **Host allow-list is a security boundary.** Deriving `redirect_uri` from `Host`/`X-Forwarded-Host` without strict validation is an open-redirect / token-leak vector, and every derived URI must also be registered in the Defra ID app registration or B2C will reject it with `AADB2C90006`. Registration is a change outside this repo and needs coordinating.
- **Canonical-host redirect would break the `cdp-int` URL** that testers are known to use. Confirm that is acceptable before choosing that option.
- **Changing the status code from 200** affects the `onPreResponse` handling in [`src/plugins/errors.js`](../../../src/plugins/errors.js) — a 403 would be re-templated to `unauthorised` anyway, but verify no double-handling with the `catchAll` extension registered separately in `src/server.js`.
- **Signing out of Defra ID is global, not per-service.** It will end the user's session across other Defra services sharing the IdP, so it must be an explicit user action, never automatic on this error path.
- **Do not add `prompt=login` or `forceReselection` to `/auth/sign-in`** as a shortcut — it would force re-entry of credentials or re-selection of a business for every legitimate user, and would degrade the single-business and `redirectTo` re-auth journeys in [`src/plugins/auth.js`](../../../src/plugins/auth.js).
- **The `/auth/sign-in-oidc` request was observed arriving twice** in every trace (two 200s, or a 200 then a 302 during business reselect). This was not explained during this investigation and is worth a separate look — a duplicate callback consuming the one-time `bell-defra-id` cookie could cause intermittent failures even on the correct host.

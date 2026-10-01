# Investigation: Reproducing the Defra ID repeat Unauthorised loop locally

Jira: [FLS2-337](https://eaflood.atlassian.net/browse/FLS2-337)

Follow-up to [README.md](./README.md), which investigated the bug against production. This
session established whether the same defect can be reproduced in the local Docker dev
environment (standard setup, real cpdev Defra ID — not the Defra ID stub), so that a fix can
be developed and verified locally. **No application code was changed.**

## Original prompt

> The investigation above was done on a deployed cloud environment not local. In order to properly debug and fix this issue we need to be able to recreate in our local build. Run our service locally in docker and see if it's possible to recreate this bug in our local build. do not use the stubbed dev setup because it doesnt connect to the real instance of defraid. use the standard setup that connects to the test environment which is set in our .env file using vs code task 'Up frontend'

## Conversation summary

1. Checked the running Docker stack and found it was using the `fcp-defra-id-stub` container
   rather than the real cpdev Defra ID — not suitable for this investigation.
2. Compared `.env` against [`compose.yaml`](../../../compose.yaml): `.env` points
   `DEFRA_ID_WELL_KNOWN_URL` at the real `your-account.cpdev.cui.defra.gov.uk` IdP, but
   `compose.yaml` **hardcodes** `DEFRA_ID_REDIRECT_URL: http://localhost:3000/auth/sign-in-oidc`,
   overriding whatever `.env` sets for that variable.
3. Ran the **⬆️ Up Frontend** VS Code task (`docker compose up --build`) and confirmed via
   `docker compose exec` that the recreated container was now resolving against the real cpdev
   `DEFRA_ID_WELL_KNOWN_URL`, not the stub.
4. Before touching the browser, ran a **non-interactive `curl` check** comparing
   `GET /auth/sign-in` from `localhost:3000` vs `127.0.0.1:3000`: both return a `redirect_uri` of
   `http://localhost:3000/auth/sign-in-oidc`, but the `bell-defra-id` `Set-Cookie` is scoped to
   whichever host the request was made against — an exact local analogue of the prod
   `cdp-int` vs `farm-and-land` host mismatch, with no hosts-file edits or config changes needed.
5. Opened a Playwright-controlled browser, attached the same request/response/`Set-Cookie`/cookie-store
   instrumentation used in the production investigation, and cleared stale local cookies left over
   from previous manual testing (scoped only to `localhost`/`127.0.0.1`, not touching any
   production or logs-dashboard session).
6. Reproduced **journey 1** from `http://127.0.0.1:3000/` — the user signed in with real cpdev
   credentials and selected a business themselves — and landed on the **Unauthorised** page, with
   no `sid` cookie issued and `bell-defra-id` stranded on `127.0.0.1`.
7. Reproduced **journey 2** (control) from `http://localhost:3000/` — the matching host — and
   reached `/home` successfully with no password prompt or business picker (same-browser IdP SSO),
   signed in as a real cpdev test user/business.
8. Reproduced **journey 3** — back to `http://127.0.0.1:3000/` with a valid `sid` session already
   present on `localhost` — and got the loop: silent sign-in (no prompt, no picker) straight back
   to Unauthorised in ~4 seconds, with zero human input.
9. Pulled the frontend container's own logs (`docker compose logs fcp-sfd-frontend`) and found the
   same timing signature observed in production: fast (`3–7ms`) `200` responses on
   `/auth/sign-in-oidc` with no `#dal-token` line for the failing journeys, versus a slow
   (`~3019ms`) `302` immediately preceded by `#dal-token` cache activity for the succeeding one.
10. Reported findings without implementing the fix, per the original investigation's deferral and
    this session's scope (reproduce only).

## Outcome

### Local reproduction recipe

The **default** local setup (browsing `http://localhost:3000/`) cannot reproduce the bug — bell's
hardcoded `redirect_uri` (`http://localhost:3000/...`) happens to match the host used by default,
which is exactly why this was never caught in local dev. The fix is to browse a **different**
hostname that still resolves to the same server:

1. Run the **⬆️ Up Frontend** task (`docker compose up --build`) — standard setup, no stub.
2. Browse **`http://127.0.0.1:3000/`** instead of `http://localhost:3000/`.
3. Click **Start now**, sign in with real cpdev credentials, select a business.
4. Result: **Unauthorised** page, no `sid` issued, `bell-defra-id` stranded on `127.0.0.1`.
5. Returning to `http://127.0.0.1:3000/` and clicking **Start now** again reproduces the loop
   (silent re-auth, no prompt, straight back to Unauthorised) — even while a valid `sid` session
   exists on `localhost` from a successful control run.

A non-interactive variant needing no sign-in at all, suitable for a quick manual check or scripted
smoke test:

```sh
curl -s -D - -o /dev/null http://127.0.0.1:3000/auth/sign-in
```

The `Set-Cookie: bell-defra-id=...` is scoped to `127.0.0.1`, while the `redirect_uri` query
parameter in the `Location` header says `localhost:3000` — the host mismatch is visible in a
single request/response pair.

### Evidence gathered locally

| | Browsing host | `bell-defra-id` scoped to | `redirect_uri` | Result |
|---|---|---|---|---|
| Control | `localhost:3000` | `localhost` | `http://localhost:3000/...` | ✅ signs in, reaches `/home` |
| Repro | `127.0.0.1:3000` | `127.0.0.1` | `http://localhost:3000/...` | ❌ Unauthorised |

Container log excerpt (`docker compose logs fcp-sfd-frontend`), matching the prod timing signature
exactly:

```
14:16:56  get /auth/sign-in-oidc 200 (7ms)      <- Unauthorised, no #dal-token (bell rejected early)
14:17:42  #dal-token - cache miss …
14:17:43  get /auth/sign-in-oidc 302 (3019ms)   <- success, DAL called
14:17:44  get /home 200 (346ms)
14:18:07  get /auth/sign-in-oidc 200 (4ms)      <- Unauthorised again — the loop
```

Cookie store (CDP `Network.getCookies`) after the full sequence: `127.0.0.1 bell-defra-id`
(stranded, never cleared) alongside `localhost sid` / `localhost session` (the valid session from
the control run) — confirming the application session is not consulted on the mismatched-host path,
consistent with the production findings.

### Relevant to the fix

[`compose.yaml`](../../../compose.yaml) hardcodes
`DEFRA_ID_REDIRECT_URL: http://localhost:3000/auth/sign-in-oidc`, overriding the `.env` value
(`https://fcp-sfd-frontend.test.cdp-int.defra.cloud/...`). This is what makes the default local
journey self-consistent and masks the bug — it's worth keeping in mind when writing the local
regression test described in the production investigation's [README.md](./README.md#6-regression-tests),
since the test needs to exercise a *mismatched* host deliberately rather than relying on whatever
the environment happens to default to.

### Open question carried over

As in production, every `/auth/sign-in-oidc` request was observed arriving **twice** locally (a
fast `200` followed by a slower `200`/`302`). This remains unexplained and is flagged again here in
case it affects which fix is correct — a duplicate callback consuming the single-use
`bell-defra-id` cookie could cause intermittent failures even on a correctly matched host.

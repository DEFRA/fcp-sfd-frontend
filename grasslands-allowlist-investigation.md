# Grasslands allow-list investigation

## Background

As part of the Grasslands integration work, we have been investigating the existing allow-list functionality within the Grants service and how this could be integrated into Single Front Door (SFD).

At present, SFD displays static grant cards to users. The intention is to move towards a more dynamic approach, whereby the grants available to a user are determined by the Grants service itself.

This discovery work aims to improve our understanding of the existing implementation, identify any dependencies and capture any outstanding questions before implementation work begins.

## Scope

The purpose of this investigation is to understand:

- how SFD interacts with the Grants service;
- how access to grants is controlled;
- how the allow list is managed and maintained;
- the structure of the request and response payloads;
- the dependencies and risks associated with the integration; and
- any changes required within SFD.

## Documentation reviewed

| Source | Purpose |
| --- | --- |
| `openapi.yaml` | Defines the API contract and available endpoints. |
| `README.md` | Provides an overview of the service. |
| Swagger documentation | Provides examples of requests and responses. |
| Repository documentation | Provides additional implementation information. |
| `grants-ui-backend/openapi.yaml` at main · DEFRA/grants-ui-backend | Reference implementation and contract details. |

## Solution overview

The Grants service uses an allow-list mechanism to determine which grants are available to individual users.

The service evaluates a combination of CRN (Customer Reference Number) and SBI (Single Business Identifier) values before returning the list of grants that should be made available.

SFD would then consume this response and display the relevant grant cards to the user.

## Current state (As-Is)

| Step | Description |
| --- | --- |
| 1 | User signs in to SFD |
| 2 | SFD displays static grant cards |
| 3 | User selects the relevant grant |
| 4 | User enters the grant journey |

## Proposed future state (to be validated)

| Step | Description |
| --- | --- |
| 1 | User signs in to SFD |
| 2 | User authentication takes place |
| 3 | SFD retrieves the necessary user information |
| 4 | SFD calls the allow-list endpoint |
| 5 | The Grants service validates the request |
| 6 | The service evaluates the allow-list rules |
| 7 | The eligible grants are returned |
| 8 | SFD displays the relevant cards |

## Findings

I have reviewed the Grants API documentation, Swagger/OpenAPI file and the information available in the `grants-ui-backend` repository to understand how the current allow-list works and whether this could be used by SFD to determine which grant cards a user should see.

The main findings so far are below.

| Area | Finding | What this means / notes |
| --- | --- | --- |
| Allow-list endpoint | There is an existing `GET /allowlist/grants` endpoint within the Grants service. | This gives us an existing way of getting the grants that are available to a user, rather than SFD having to hold its own version of the Grants allow-list. |
| How access is checked | The Grants service uses information about the user/business when checking the allow-list. CRN and SBI are referenced within the allow-list functionality. | We need to confirm exactly what SFD would need to provide when making the request and whether both CRN and SBI are always required. |
| Authentication information | The API documentation references the `x-encrypted-auth` header. The user information required for the allow-list check appears to come from the authentication information provided with the request. | We still need to understand how this would work from SFD and whether SFD already has everything needed to call the endpoint. |
| Where the allow-list check happens | The check against the allow-list is carried out within the Grants service. | This is useful because it means SFD should not need to duplicate the rules for deciding whether someone is on a particular grant’s allow-list. SFD would call Grants and use the result that comes back. |
| Allow-list configuration | The allow-list is configuration driven and uses an `allowlist.yaml` file. The configuration can differ between environments. | This suggests that the actual management of who has access to a grant sits with Grants rather than SFD. We should confirm who owns this and how updates are currently made. |
| `allowAll` | The configuration supports an `allowAll` option. | This allows a grant to be opened up without having to add individual CRNs/SBIs to the allow-list. We need to understand whether this makes any difference to SFD or whether Grants handles this completely before returning the response. |
| Grant information returned | The endpoint returns details about the grants available to the user. From the API documentation this includes information such as the grant code, title, description and URL. | These are some of the details we would need to display a grant card in SFD. We still need to check whether this is everything SFD needs or whether some information would still need to be held or configured within SFD. |
| Multiple grants | The endpoint is able to return grant information rather than being tied to one specific grant. | This potentially gives us a way of supporting more grants in future without adding separate logic for each grant within SFD. We need to confirm how multiple returned grants should be handled and displayed. |
| API responses | The API documentation covers successful and unsuccessful responses, including `200`, `401` and `500`. | The API tells us what responses can be returned, but it does not tell us what the SFD user experience should be in each situation. That will need to be agreed. |

## Summary of findings

The documentation shows that the Grants service already has functionality for checking an allow-list and determining which grants should be available to a user.

This suggests that SFD could use the existing Grants endpoint to determine which grant cards to display, rather than holding separate allow-list rules within SFD.

Based on what has been reviewed so far, the proposed flow would be for SFD to call the Grants allow-list endpoint using the required user/business information. Grants would carry out the allow-list check and return the grants available to that user. SFD could then use that response to display the relevant grant cards.

There are, however, some areas that are not clear from the documentation alone and will need to be confirmed before the proposed approach can be agreed.

## Findings and areas to confirm

| Area | Current position | Next action |
| --- | --- | --- |
| CRN / SBI | The API currently requires both CRN and SBI. RPA would prefer a CRN-only approach going forward. | Discuss with Grants and SFD — understand the proposed change and its impact on SFD. |
| Authentication | SFD will need an Authorisation header and a JWT-signed secret for `x-user-context`. Secrets/configuration will need to be shared for service-to-service authentication. | Technical follow-up — confirm what SFD needs to implement/configure. |
| Meaning of the response | Confirmed: a returned grant means the user is allowed to access that grant. It does not confirm that they meet all grant eligibility criteria. | Confirmed — no further action. |
| Grant card information | Confirmed that the response provides grant information for a consuming service such as SFD to determine what to display. | Confirmed, although SFD may still need to agree presentation/configuration. |
| When the API is called | Not yet agreed. | SFD decision — discuss with developers/UX as part of implementation design. |
| No grants returned | Not yet defined. | SFD requirement — agree expected homepage behaviour when the API successfully returns no grants. |
| API failure | Not yet defined. A failure needs to be distinguished from a successful response containing no grants. | SFD/technical discussion — define fallback behaviour. |
| Error responses | Not yet defined. | Technical discussion — agree handling/retry behaviour for responses such as 401/5xx and what, if anything, the user should see. |
| Multiple grants | The API can return grants available to the user, but presentation behaviour where multiple grants are returned still needs to be agreed. | SFD/product decision — confirm whether all returned grants are displayed and any ordering requirements. |
| Allow-list ownership | Confirmed: production allow lists are generally maintained by RPA; grant teams maintain non-production lists/test users. SFD should not maintain its own separate allow list. | Confirmed — no further action. |
| Changes to the allow-list | Not yet confirmed how quickly changes are reflected or whether/how SFD should cache responses. | Technical discussion — confirm API behaviour and SFD caching approach. |
| Monitoring | Not yet defined. | SFD technical discussion — identify appropriate logging, monitoring and alerting for the integration. |

## Next steps

The initial findings have now been reviewed with the Grants team and a number of the points identified above have been confirmed.

The next step is to review the remaining open points with the SFD team and identify where further technical or Product input is required. In particular, further discussion is needed around the proposed use of CRN only rather than CRN and SBI, and any impact this may have on the SFD integration.

There are also some SFD-specific points still to agree, including when the API should be called, how failures and no-grant responses should be handled, and how multiple grant cards should be presented.

A follow-up discussion with Grants will then be arranged with the appropriate people from SFD to work through any remaining cross-service questions.

Once the outstanding points have been agreed, the proposed future-state flow can be updated and the relevant requirements and Jira stories/tasks identified or refined for implementation.

## Outcomes and answers from technical spike

A technical spike was carried out directly against the `grants-ui-backend` codebase and a locally running instance of the service (`docker compose up`, `http://localhost:3001`) to answer as many of the open points above as possible without requiring further input from the Grants team. This section records what was confirmed, what live testing demonstrated, and what remains genuinely open.

### Live API verification

The `/allowlist/grants` endpoint was called directly using tokens generated with the project's own `npm run generate:env` tooling and the local `ENCRYPTED_AUTH_JWT_SECRET`. Temporary test data (a matched-grant case and an `allowAll` case) was seeded directly into the local MongoDB and removed again afterwards; no other environments or shared data were touched.

| Scenario | Result |
| --- | --- |
| Valid request, CRN/SBI with no allow-list entries | `200 { "grants": [] }` |
| Missing `x-user-context` header | `401 { "message": "crn and sbi are required in the x-user-context token" }` |
| Invalid `Authorization` bearer token | `401 { "message": "Invalid authentication credentials" }` |
| CRN + SBI both present in a grant's allow-list | `200`, returns that grant with `code`, `title`, `description`, `url` |
| CRN + SBI **not** matched, but grant has `allowAll: true` | `200`, grant is still returned — confirms `allowAll` bypasses CRN/SBI matching entirely |

This confirms that the "no grants" case is safely distinguishable from a failure (empty array vs `401`/`500`), the AND-matching logic (CRN **and** SBI) is real and currently enforced, and `allowAll` works as documented.

### Answers to the open points

- **CRN / SBI** — **Confirmed from code** (`grants-ui-backend/src/modules/allowlist/allowlist.routes.js`) and live testing: the API currently requires **both** CRN and SBI — a request is rejected with `401` if either is missing from the `x-user-context` token, and a grant only matches if the caller is in **both** the CRN list and the SBI list for that grant (`allowlist.service.js`, `resolveAllowedGrants()`). RPA's stated preference for a CRN-only approach is **not yet implemented**. **This remains a key open risk** — discuss with the Grants team whether and when CRN-only will land, since this changes the `x-user-context` JWT contract and SFD should not be hard-coded around "CRN + SBI always required" until it is settled.
- **Authentication** — **Confirmed**: two headers are required — `Authorization: Bearer <token>` (service-to-service token, HMAC-encrypted legacy format or AWS STS JWT) and `x-user-context: <JWT>` containing `{ crn, sbi }`, signed with a shared secret (`ENCRYPTED_AUTH_JWT_SECRET`). Verified by reading `src/plugins/auth.js` and by calling the local API with a self-signed token using the same secret. **SFD does not currently have any JWT-signing capability** — it only verifies inbound Defra ID tokens, never signs outbound tokens. This is new code SFD would need to build, not just configuration.
- **Grant card information** — **Confirmed and verified live**: response shape is `{ "grants": [{ "code", "title", "description", "url" }] }`. `title` and `description` come from the grant's active form definition config; `url` is built by Grants from a configured base URL and grant code. SFD does not need to hold a separate URL, title or description per grant, although it may still want to layer on additional presentation styling (for example icons) that the API does not provide.
- **When the API is called** — Recommendation: call once per session immediately after sign-in (alongside existing permissions/relationships lookups in `auth-routes.js`), and cache the result in the existing Redis session cache (`request.server.app.cache`) rather than calling on every home-page render.
- **No grants returned** — **Confirmed via live testing**: a successful call with no matching grants returns `200 { "grants": [] }`, not a `404` or error. Recommendation: SFD should treat an empty array as "hide the grants section" rather than showing an empty state or error message.
- **API failure** — **Confirmed distinguishable from "no grants"**: genuine failures return `401` (auth problem) or `500` (server error), never an empty `200`. Recommendation: treat a failed call the same as "no grants to show" for the user (log the error, degrade gracefully, do not block the homepage), following the existing pattern in `src/services/os-places/address-lookup-service.js` (log and return, do not throw a hard error for an optional feature).
- **Error responses** — **Confirmed via live testing**: `401` with `{ "error": "Unauthorized", "message": "..." }` for auth failures (invalid bearer token or missing CRN/SBI in the user-context token); `500` for server-side errors. No retry/backoff is implemented by the API itself. Recommendation: no retry, single call with a short timeout, fail gracefully as above; `401`s should be logged/alerted as they could indicate a misconfiguration of the shared secret.
- **Multiple grants** — Confirmed the API can return more than one grant in a single call (verified by seeding two matching grants locally and getting both back in one response). Recommendation: render one grant card per entry returned, in the order given by the API (no SFD-side sorting or filtering), reusing the existing `serviceCard` macro pattern already used for the single Woodland Management card in `src/views/home.njk`.
- **Changes to the allow-list** — **Confirmed from code**: allow-list changes are ingested from `allowlist.yaml` (published by the Grants Config Broker) via an SQS consumer into MongoDB, and the API additionally caches resolved results in memory for **2 minutes** per CRN/SBI pair (LRU cache, `allowlist.service.js`). So after a config change, a given user may see stale results for up to roughly 2 minutes plus any ingest delay. SFD does not need to build its own caching layer to protect the Grants API, but if SFD also caches the response in its own session cache, that adds on top of this latency — recommend a cache TTL of a few minutes, not the existing 58-minute default session TTL used elsewhere.
- **Monitoring** — **Confirmed from code**: the Grants API logs allow-list checks and auth failures via structured log codes (`ALLOWLIST.GRANTS_CHECKED`, `ALLOWLIST.GRANTS_UNAUTHORIZED`, etc.), but it has no bespoke metrics or alerting configured for this endpoint today. SFD should add its own logging around the outbound call (success/failure/latency), since Grants' logs will not be visible to the SFD team.

### Other technical dependencies identified

Beyond the points raised in the original findings, the spike identified the following additional work SFD would need to carry out:

- Build outbound JWT signing (none exists today) and manage a new shared secret, likely via CDP secure context.
- Add a `GRANTS_API` convict config block (base URL, secret, timeout) following the existing `os-places.js`/`services.js` pattern.
- Add a feature toggle (`feature-toggle.js` pattern) to roll this out safely per environment.

### Remaining open items

- **CRN + SBI vs CRN-only** — the current backend behaviour contradicts RPA's stated direction and must be resolved with the Grants team before the `x-user-context` contract is finalised for SFD.
- **Cache staleness** — the combination of Grants' 2-minute in-memory cache and any SFD-side session caching needs an agreed total staleness budget, particularly for support or debugging scenarios where an allow-list change needs to take effect quickly.
- The recommendations above for the SFD-specific points (when to call the API, handling of no-grants and failure responses, and presentation of multiple grant cards) should be reviewed and agreed with the SFD product and development team.

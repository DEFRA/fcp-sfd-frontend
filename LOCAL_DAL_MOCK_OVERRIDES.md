# Local DAL mock overrides

This setup uses the standard local topology:
`fcp-sfd-frontend -> fcp-dal-api -> fcp-dal-upstream-mock`.

The local Docker Compose override (`compose.override.yaml`) is configured to:
- build the upstream mock from local source so overrides are editable
- force `DAL_ENDPOINT` to the local DAL API container

## Where overrides live
- `fcp-dal-upstream-mock/src/factories/sfd-test-data.js` (SFD-specific lists)

Overrides are merged into generated data and require a mock restart to take effect.

## Current override scenario
Missing date of birth (DoB) for an SFD-provided user:
- personId: `5007704`
- CRN: `1100077049`
- orgId: `5583575`
- SBI: `107167406`
- Override: `dateOfBirth: null`

## How to use
1. Ensure `DAL_CONNECTION` is enabled so the frontend uses the DAL connector.
2. Start the local compose stack (frontend, DAL API, upstream mock).
3. Restart the upstream mock after any override changes.
4. Sign in using the chosen CRN and navigate to personal details.
5. The missing DoB should trigger the personal-details interrupter journey.

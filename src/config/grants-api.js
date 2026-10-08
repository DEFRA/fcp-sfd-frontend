/**
 * Configuration for the Grants API (`grants-ui-backend`), which owns the
 * allow lists that decide which grants a user is permitted to access.
 *
 * The API requires two credentials, both of which are shared secrets agreed
 * with the Grants team:
 * - `authToken` + `encryptionKey` produce the service-to-service `Authorization` header
 * - `userContextSecret` signs the `x-user-context` JWT carrying the user's CRN and SBI
 *
 * See `src/utils/grants/build-grants-api-headers.js` for how these are used.
 *
 * @module grantsApiConfig
 */

const DEFAULT_TIMEOUT_MS = 3000

export const grantsApiConfig = {
  grantsApiConfig: {
    baseUrl: {
      doc: 'Base URL of the Grants API (grants-ui-backend)',
      format: String,
      default: null,
      nullable: true,
      env: 'GRANTS_API_BASE_URL'
    },
    authToken: {
      doc: 'Shared service-to-service token, encrypted to form the Authorization header',
      format: String,
      default: null,
      nullable: true,
      sensitive: true,
      env: 'GRANTS_API_AUTH_TOKEN'
    },
    encryptionKey: {
      doc: 'Key used to AES-256-GCM encrypt the shared service-to-service token',
      format: String,
      default: null,
      nullable: true,
      sensitive: true,
      env: 'GRANTS_API_ENCRYPTION_KEY'
    },
    userContextSecret: {
      doc: 'Secret used to sign the x-user-context JWT containing the CRN and SBI',
      format: String,
      default: null,
      nullable: true,
      sensitive: true,
      env: 'GRANTS_API_USER_CONTEXT_SECRET'
    },
    timeout: {
      doc: 'Timeout in milliseconds for requests to the Grants API',
      format: Number,
      default: DEFAULT_TIMEOUT_MS,
      env: 'GRANTS_API_TIMEOUT_MS'
    }
  }
}

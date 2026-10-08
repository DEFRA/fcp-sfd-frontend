/**
 * Retrieves the grants a user is allowed to access from the Grants API
 * (`grants-ui-backend`).
 *
 * The Grants service owns the allow lists, so rather than duplicating those
 * rules here we ask it which grants the signed in user is permitted to see and
 * use the answer to decide which grant cards to render.
 *
 * The service:
 * - Builds the two authentication headers the Grants API requires
 * - Calls `GET /allowlist/grants` with a short timeout
 * - Reduces the response to the list of grant codes the caller is allowed
 * - Degrades gracefully, returning an empty list on any failure
 *
 * Degrading gracefully matters because this runs during sign in. The allow list
 * only controls optional promotional cards, so a Grants outage must never block
 * a user from signing in. The trade-off is that a failure is indistinguishable
 * from "no grants" to the caller, which is why failures are logged here.
 *
 * @module getAllowedGrantsService
 */

import { config } from '../../config/index.js'
import { createLogger } from '../../utils/logger.js'
import {
  buildAuthorizationHeader,
  buildUserContextHeader
} from '../../utils/grants/build-grants-api-headers.js'
import { proxyFetch } from '../../utils/proxy.js'

const logger = createLogger()

const ALLOW_LIST_PATH = '/allowlist/grants'

/**
 * Fetches the grant codes the given user is allowed to access.
 *
 * @param {string|number} sbi - Single Business Identifier of the selected business
 * @param {string|number} crn - Customer Reference Number of the signed in user
 * @returns {Promise<string[]>} Allowed grant codes, or an empty array if the call fails
 */
const getAllowedGrants = async (sbi, crn) => {
  const { baseUrl, timeout } = config.get('grantsApiConfig')

  try {
    const response = await proxyFetch(`${baseUrl}${ALLOW_LIST_PATH}`, {
      method: 'GET',
      headers: {
        Authorization: buildAuthorizationHeader(),
        'x-user-context': buildUserContextHeader(sbi, crn)
      },
      signal: AbortSignal.timeout(timeout)
    })

    if (!response.ok) {
      // A 401 here almost always means the shared secrets are misconfigured
      // rather than anything the user has done, so surface the status to help diagnose
      logger.error(
        { status: response.status },
        'Error response from the Grants API allow list endpoint'
      )
      return []
    }

    const { grants } = await response.json()

    return (grants ?? []).map((grant) => grant.code)
  } catch (error) {
    // Covers network failures and the AbortSignal timeout above
    logger.error(error, 'Error connecting to the Grants API allow list endpoint')
    return []
  }
}

export {
  getAllowedGrants
}

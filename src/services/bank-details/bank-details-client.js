import { config } from '../../config/index.js'
import { createLogger } from '../../utils/logger.js'
import { getWebIdentityToken } from './web-identity-token.js'

const logger = createLogger()

/**
 * Calls the fcp-sfd-bank-details service's health endpoint.
 *
 * This exists to prove server-to-server connectivity between fcp-sfd-frontend
 * and fcp-sfd-bank-details, ahead of any real bank details endpoints being built.
 *
 * @param {object} stsClient - The `STSClient` object
 * @returns {Promise<boolean>} true if the health check succeeded, false otherwise
 */
export const checkBankDetailsServiceHealth = async (stsClient) => {
  const endpoint = config.get('bankDetails.endpoint')

  if (!endpoint) {
    logger.info('BANK_DETAILS_ENDPOINT not configured, skipping health check')
    return false
  }

  try {
    const headers = await buildAuthorizationHeaders(stsClient)

    const response = await fetch(`${endpoint}/health`, { headers })

    if (!response.ok) {
      throw new Error(`Unexpected status code: ${response.status}`)
    }

    logger.info('fcp-sfd-bank-details health check succeeded')
    return true
  } catch (error) {
    logger.error(error, 'fcp-sfd-bank-details health check failed')
    return false
  }
}

/**
 * Calls the fcp-sfd-bank-details service's bank details endpoint for a given SBI.
 *
 * Currently returns a hardcoded fake data set from fcp-sfd-bank-details; this
 * exists to prove the frontend can call and consume real endpoints from that
 * service, ahead of any real data being available.
 *
 * @param {string} sbi
 * @param {object} stsClient - The `STSClient` object
 * @returns {Promise<object|null>} the bank details, or null if the call failed
 */
export const getBankDetails = async (sbi, stsClient) => {
  const endpoint = config.get('bankDetails.endpoint')

  if (!endpoint) {
    logger.info('BANK_DETAILS_ENDPOINT not configured, skipping bank details fetch')
    return null
  }

  try {
    const headers = await buildAuthorizationHeaders(stsClient)

    const response = await fetch(`${endpoint}/bank-details/${sbi}`, { headers })

    if (!response.ok) {
      throw new Error(`Unexpected status code: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    logger.error(error, 'fcp-sfd-bank-details bank details fetch failed')
    return null
  }
}

/**
 * Shared helper to build the authorization headers
 *
 * @param {object} stsClient - The `STSClient` object
 * @returns {object} headers - The 
 */
const buildAuthorizationHeaders = async (stsClient) => {
  const headers = {}
  const token = await getWebIdentityToken(stsClient)

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

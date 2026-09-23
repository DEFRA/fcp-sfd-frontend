import { config } from '../../config/index.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger()

/**
 * Calls the fcp-sfd-bank-details service's health endpoint.
 *
 * This exists to prove server-to-server connectivity between fcp-sfd-frontend
 * and fcp-sfd-bank-details, ahead of any real bank details endpoints being built.
 *
 * @returns {Promise<boolean>} true if the health check succeeded, false otherwise
 */
export const checkBankDetailsServiceHealth = async () => {
  const endpoint = config.get('bankDetailsConfig.endpoint')

  if (!endpoint) {
    logger.info('BANK_DETAILS_ENDPOINT not configured, skipping health check')
    return false
  }

  try {
    const response = await fetch(`${endpoint}/health`)

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

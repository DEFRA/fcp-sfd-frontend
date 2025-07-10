import { rawUserPermissionsSchema } from '../schemas/dal/user-permissions-schema.js'
import { createLogger } from '../utils/logger.js'

/**
 * Takes the raw data and maps it to a more usable format
 *
 * @param {Object} raw - The raw response payload from the DAL
 *
 * @returns {Object} Formatted user permission data
 */

export const mapUserPermissions = (raw) => {
  const logger = createLogger()

  const { error, value } = rawUserPermissionsSchema.validate(raw)

  if (error) {
    logger.error(`Validation fail for DAL response: ${error.message}`)
    throw new Error(`Validation fail for DAL response: ${error.message}`)
  }

  // identify what format we need the permissions in
  return {
    value
  }
}

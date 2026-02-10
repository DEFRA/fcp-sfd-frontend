/**
 * Runs a GraphQL mutation against the DAL
 * @module update-dal-service
 *
 * This helper is reused across update services to avoid duplicating code.
 * Right now it only handles successful responses ("happy path").
 * If DAL returns errors, it throws an exception.
 *
 * Having this in one place also makes it easier to add retries
 * or extra error handling in the future.
 */

import { dalConnector } from '../../dal/connector.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger()

const updateDalService = async (mutation, variables) => {
  logger.info('Executing DAL mutation')
  let response
  try {
    response = await dalConnector(mutation, variables)
  } catch (error) {
    logger.error(error, 'DAL mutation failed with exception')
    throw error
  }

  if (response.errors) {
    logger.error(
      { statusCode: response.statusCode, errors: JSON.stringify(response.errors) },
      'DAL mutation returned errors'
    )
    throw new Error('DAL error from mutation')
  }

  logger.info('DAL mutation completed successfully')
  return response
}

export {
  updateDalService
}

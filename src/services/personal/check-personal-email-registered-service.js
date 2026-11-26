/**
 * Checks whether a new personal email address is already registered to another customer
 *
 * Skips the DAL check when the email is unchanged, otherwise the customer's own email would be reported as registered
 * Returns a Joi-like error when the email is already registered so it can be rendered like a validation error
 *
 * @module checkPersonalEmailRegisteredService
 */

import { constants, queries } from '@defra/fcp-sfd-frontend-engine'
import { getDalConnector } from '../../dal/connector.js'
import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'

const checkPersonalEmailRegisteredService = async (personalEmail, credentials) => {
  const { email } = await fetchPersonalDetailsService(credentials)

  if (personalEmail.toLowerCase() === email?.toLowerCase()) {
    return {}
  }

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.query(
    queries.isCustomerEmailRegistered,
    { email: personalEmail },
    { sessionId: credentials.sessionId }
  )

  if (!dalResponse.data) {
    throw new Error('Failed to check personal email address')
  }

  if (dalResponse.data.isCustomerEmailRegistered) {
    return {
      error: [
        {
          message: constants.errorMessages.PERSONAL_EMAIL_ALREADY_REGISTERED,
          path: ['personalEmail']
        }
      ]
    }
  }

  return {}
}

export {
  checkPersonalEmailRegisteredService
}

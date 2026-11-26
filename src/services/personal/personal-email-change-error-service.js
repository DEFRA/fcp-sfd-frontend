/**
 * Prepares page data for the personal email change page when there are validation
 * or duplicate email errors.
 *
 * This service is used when:
 *  1. Joi validation fails for the user's input.
 *  2. The email address entered is already registered to another customer.
 *
 * Normally Joi's `failAction` only handles validation errors, however duplicate email errors are treated similarly,
 * so this service allows rendering the same page with appropriate errors.
 *
 * @module personalEmailChangeErrorService
 */

import { utils } from '@defra/fcp-sfd-frontend-engine'

import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { personalEmailChangePresenter } from '../../presenters/personal/personal-email-change-presenter.js'

const personalEmailChangeErrorService = async (yar, credentials, personalEmail, error = []) => {
  const errors = utils.formatValidationErrors(error)
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalEmail')
  const pageData = personalEmailChangePresenter(personalDetails, personalEmail)

  return {
    ...pageData,
    errors
  }
}

export {
  personalEmailChangeErrorService
}

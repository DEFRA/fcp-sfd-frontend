/**
 * Orchestrates validating the data for the `/business-details/address` page
 * @module SubmitAddressService
 */

import { AddressSchema } from '../../schemas/business-details/address.schema.js'
import { AddressPresenter } from '../../presenters/business-details/address.presenter.js'

/**
 * Orchestrates validating the data for the `/business-details/address` page
 *
 * @param {object} payload - The submitted form data
 * @param {object} h - the hapi response object
 *
 * @returns {Promise<object>} If no errors the page data for the check-address page else the validation error details
 */
async function go (payload, h) {
  const validationResult = _validate(payload)

    if (!validationResult) {
    // Saves the validated address values to the cookie-based session state
    await _save(payload, h)

    return {}
  }

  const submittedSessionData = _submittedSessionData(payload)

  return {
    error: validationResult,
    ...submittedSessionData
  }
}

async function _save (payload, h) {
  h.state('address1', payload.address1)
  h.state('address2', payload.address2)
  h.state('addressCity', payload.addressCity)
  h.state('addressCounty', payload.addressCounty)
  h.state('addressPostcode', payload.addressPostcode)
  h.state('addressCountry', payload.addressCountry)

  h.unstate('originalAddress')
}

/**
 * Combines the existing session data with the submitted payload formatted by the presenter. If nothing is submitted by
 * the user, payload will be an empty object.
 *
 * @private
 */
function _submittedSessionData(payload) {
  const sessionAddress = {
    address1: payload.address1 ?? null,
    address2: payload.address2 ?? null,
    addressCity: payload.addressCity ?? null,
    addressCounty: payload.addressCounty ?? null,
    addressPostcode: payload.addressPostcode ?? null,
    addressCountry: payload.addressCountry ?? null,
  }

  return AddressPresenter.go(sessionAddress)
}

function _validate (payload) {
  const validation = AddressSchema.go(payload)

  if (!validation.error) {
    return null
  }

  const result = {
    errorList: []
  }

  validation.error.details.forEach((detail) => {
    let href

    if (detail.context.key === 'address1') {
      href = '#address-1'
    } else if (detail.context.key === 'address2') {
      href = '#address-2'
    } else if (detail.context.key === 'addressCity') {
      href = '#address-city'
    } else if (detail.context.key === 'addressCounty') {
      href = '#address-county'
    } else if (detail.context.key === 'addressPostcode') {
      href = '#address-postcode'
    } else {
      href = '#address-country'
    }

    result.errorList.push({
      href,
      text: detail.message
    })

    result[detail.context.key] = { message: detail.message }
  })

  return result
}

export const SubmitAddressService = {
  go
}

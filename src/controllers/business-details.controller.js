/**
 * Controller for /business-details endpoints
 * @module BusinessDetailsController
 */

import { AddressService } from '../services/business-details/address.service.js'
import { SubmitAddressService } from '../services/business-details/submit-address.service.js'

async function address (request, h) {
  const pageData = await AddressService.go(request)

  h.state('originalAddress', JSON.stringify(pageData.originalAddress))

  return h.view('business-details/address', pageData)
}

async function submitAddress (request, h) {
  const pageData = await SubmitAddressService.go(request.payload, h)

  if (pageData.error) {
    return h.view('business-details/address', pageData)
  }

  return h.redirect('/business-address-check')
}

export const BusinessDetailsController = {
  address,
  submitAddress
}

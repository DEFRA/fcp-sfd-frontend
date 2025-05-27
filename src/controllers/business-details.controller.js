/**
 * Controller for /business-details endpoints
 * @module BusinessDetailsController
 */

import { BusinessDetailsService } from '../services/business-details/business-details.service.js'
import { AddressService } from '../services/business-details/address.service.js'

async function address (request, h) {
  const pageData = await AddressService.go(request)
  h.state('originalAddress', JSON.stringify(pageData.originalAddress))

  return h.view('business-details/address', pageData)
}

async function businessDetails (request, h) {
  const pageData = await BusinessDetailsService.go(request, h)

  return pageData
  // return h.view('business-details/business-details', pageData)
}

async function businessType (_request, h) {
  return h.view('business-details/type')
}

async function checkAddress (request, h) {
}

async function checkEmail (request, h) {
}

async function checkName (request, h) {
}

async function checkPhoneNumber (request, h) {
}

async function email (request, h) {
  const { businessEmail, originalBusinessEmail } = request.state
  const pageData = await EmailService.go(businessEmail, originalBusinessEmail)

  return h.view('business-details/email', pageData)
}

async function legalStatus (_request, h) {
  return h.view('business-details/legal-status')
}

async function name (request, h) {
}

async function phoneNumber (request, h) {
}

async function submitAddress (request, h) {
}

async function submitCheckAddress (request, h) {
}

async function submitCheckEmail (request, h) {
}

async function submitCheckName (request, h) {
}

async function submitCheckPhoneNumber (request, h) {
}

async function submitEmail (request, h) {
}

async function submitName (request, h) {
}

async function submitPhoneNumber (request, h) {
}

export const BusinessDetailsController = {
  address,
  businessDetails,
  businessType,
  checkAddress,
  checkEmail,
  checkName,
  checkPhoneNumber,
  email,
  legalStatus,
  name,
  phoneNumber,
  submitAddress,
  submitCheckAddress,
  submitCheckEmail,
  submitCheckName,
  submitCheckPhoneNumber,
  submitEmail,
  submitName,
  submitPhoneNumber
}

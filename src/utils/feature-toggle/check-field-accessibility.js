/**
 * Utility to check field accessibility based on feature toggles
 * @module checkFieldAccessibility
 */

import { config } from '../../config/index.js'

const PERSONAL_FIELDS = {
  name: 'updatePersonalDetailsName',
  dob: 'updatePersonalDetailsDob',
  address: 'updatePersonalDetailsAddress',
  phone: 'updatePersonalDetailsPhone',
  email: 'updatePersonalDetailsEmail'
}

const BUSINESS_FIELDS = {
  name: 'updateBusinessDetailsName',
  address: 'updateBusinessDetailsAddress',
  phone: 'updateBusinessDetailsPhone',
  email: 'updateBusinessDetailsEmail',
  vat: 'updateBusinessDetailsVat',
  registrationNumber: 'updateBusinessDetailsRegistrationNumber'
}

/**
 * Checks if a personal details field is accessible
 * Returns false if either the master toggle or field-level toggle is off
 *
 * @param {string} field - The field to check (name, dob, address, phone, email)
 * @returns {boolean} true if field is accessible, false if disabled
 */
const isPersonalFieldAccessible = (field) => {
  const masterToggle = config.get('featureToggle.personalDetails.updatePersonalDetails')
  if (!masterToggle) {
    return false
  }

  const fieldToggleName = PERSONAL_FIELDS[field]
  if (!fieldToggleName) {
    throw new Error(`Unknown personal field: ${field}`)
  }

  return config.get(`featureToggle.personalDetails.${fieldToggleName}`)
}

/**
 * Checks if a business details field is accessible
 * Returns false if either the master toggle or field-level toggle is off
 *
 * @param {string} field - The field to check (name, address, phone, email, vat, registrationNumber)
 * @returns {boolean} true if field is accessible, false if disabled
 */
const isBusinessFieldAccessible = (field) => {
  const masterToggle = config.get('featureToggle.businessDetails.updateBusinessDetails')
  if (!masterToggle) {
    return false
  }

  const fieldToggleName = BUSINESS_FIELDS[field]
  if (!fieldToggleName) {
    throw new Error(`Unknown business field: ${field}`)
  }

  return config.get(`featureToggle.businessDetails.${fieldToggleName}`)
}

/**
 * Gets the warning message for a disabled field
 *
 * @param {string} fieldLabel - The human-readable field label
 * @returns {string} The warning message
 */
const getDisabledFieldMessage = (fieldLabel) => {
  return `Sorry, there is a problem with the service. You cannot update your ${fieldLabel} right now. Please try again later.`
}

/**
 * Gets a notification banner object for a disabled field
 *
 * @param {string} fieldLabel - The human-readable field label
 * @returns {Object} Notification object to display as a banner
 */
const getDisabledFieldNotification = (fieldLabel) => {
  return {
    type: 'error',
    titleText: 'Important',
    text: getDisabledFieldMessage(fieldLabel)
  }
}

export {
  isPersonalFieldAccessible,
  isBusinessFieldAccessible,
  getDisabledFieldMessage,
  getDisabledFieldNotification,
  PERSONAL_FIELDS,
  BUSINESS_FIELDS
}

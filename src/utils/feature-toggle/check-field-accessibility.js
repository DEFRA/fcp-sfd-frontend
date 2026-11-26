/**
 * Utility to check field accessibility based on feature toggles
 * @module checkFieldAccessibility
 */

import { getConfigService } from '../../services/get-config-service.js'

const PERSONAL_FIELDS = {
  name: {
    toggleName: 'updatePersonalDetailsName',
    displayName: 'full name'
  },
  dob: {
    toggleName: 'updatePersonalDetailsDob',
    displayName: 'date of birth'
  },
  address: {
    toggleName: 'updatePersonalDetailsAddress',
    displayName: 'personal address'
  },
  phone: {
    toggleName: 'updatePersonalDetailsPhone',
    displayName: 'personal phone numbers'
  },
  email: {
    toggleName: 'updatePersonalDetailsEmail',
    displayName: 'personal email address'
  }
}

const BUSINESS_FIELDS = {
  name: {
    toggleName: 'updateBusinessDetailsName',
    displayName: 'business name'
  },
  address: {
    toggleName: 'updateBusinessDetailsAddress',
    displayName: 'business address'
  },
  phone: {
    toggleName: 'updateBusinessDetailsPhone',
    displayName: 'business phone numbers'
  },
  email: {
    toggleName: 'updateBusinessDetailsEmail',
    displayName: 'business email address'
  },
  vat: {
    toggleName: 'updateBusinessDetailsVat',
    displayName: 'VAT registration number'
  },
  registrationNumber: {
    toggleName: 'updateBusinessDetailsRegistrationNumber',
    displayName: 'registration number'
  }
}

/**
 * Checks if a personal details field is accessible
 * Returns false if either the master toggle or field-level toggle is off
 *
 * @param {string} field - The field to check (name, dob, address, phone, email)
 * @returns {boolean} true if field is accessible, false if disabled
 */
const isPersonalFieldAccessible = (field) => {
  const fieldConfig = PERSONAL_FIELDS[field]
  if (!fieldConfig) {
    throw new Error(`Unknown personal field: ${field}`)
  }

  const masterToggle = getConfigService('featureToggle.personalDetails.updatePersonalDetails')
  if (!masterToggle) {
    return false
  }

  return getConfigService(`featureToggle.personalDetails.${fieldConfig.toggleName}`)
}

/**
 * Checks if a business details field is accessible
 * Returns false if either the master toggle or field-level toggle is off
 *
 * @param {string} field - The field to check (name, address, phone, email, vat, registrationNumber)
 * @returns {boolean} true if field is accessible, false if disabled
 */
const isBusinessFieldAccessible = (field) => {
  const fieldConfig = BUSINESS_FIELDS[field]
  if (!fieldConfig) {
    throw new Error(`Unknown business field: ${field}`)
  }

  const masterToggle = getConfigService('featureToggle.businessDetails.updateBusinessDetails')
  if (!masterToggle) {
    return false
  }

  return getConfigService(`featureToggle.businessDetails.${fieldConfig.toggleName}`)
}

/**
 * Gets the display name for a personal field
 *
 * @param {string} field - The field to get the display name for
 * @returns {string} The human-readable field name
 */
const getPersonalFieldDisplayName = (field) => {
  const fieldConfig = PERSONAL_FIELDS[field]

  if (!fieldConfig) {
    throw new Error(`Unknown personal field: ${field}`)
  }

  return fieldConfig.displayName
}

/**
 * Gets the display name for a business field
 *
 * @param {string} field - The field to get the display name for
 * @returns {string} The human-readable field name
 */
const getBusinessFieldDisplayName = (field) => {
  const fieldConfig = BUSINESS_FIELDS[field]

  if (!fieldConfig) {
    throw new Error(`Unknown business field: ${field}`)
  }

  return fieldConfig.displayName
}

/**
 * Gets a notification banner object for a disabled field
 *
 * @param {string} fieldLabel - The human-readable field label
 * @returns {Object} Notification object to display as a banner
 */
const getDisabledFieldNotification = (fieldLabel) => {
  return {
    titleText: 'Important',
    text: `Sorry, there is a problem with the service. You cannot update your ${fieldLabel} right now. Please try again later.`
  }
}

/**
 * Finds the first disabled personal field from a list of fields
 * Returns the field name and display name, or null if all are accessible
 *
 * @param {string[]} fields - Array of personal fields to check
 * @returns {{field: string, displayName: string} | null} The first disabled field or null
 */
const findDisabledPersonalField = (fields) => {
  const masterToggle = getConfigService('featureToggle.personalDetails.updatePersonalDetails')
  if (!masterToggle) {
    return { field: 'all', displayName: 'personal details' }
  }

  for (const field of fields) {
    if (!isPersonalFieldAccessible(field)) {
      return {
        field,
        displayName: getPersonalFieldDisplayName(field)
      }
    }
  }
  return null
}

/**
 * Finds the first disabled business field from a list of fields
 * Returns the field name and display name, or null if all are accessible
 *
 * @param {string[]} fields - Array of business fields to check
 * @returns {{field: string, displayName: string} | null} The first disabled field or null
 */
const findDisabledBusinessField = (fields) => {
  const masterToggle = getConfigService('featureToggle.businessDetails.updateBusinessDetails')
  if (!masterToggle) {
    return { field: 'all', displayName: 'business details' }
  }

  for (const field of fields) {
    if (!isBusinessFieldAccessible(field)) {
      return {
        field,
        displayName: getBusinessFieldDisplayName(field)
      }
    }
  }
  return null
}

export {
  isPersonalFieldAccessible,
  isBusinessFieldAccessible,
  getPersonalFieldDisplayName,
  getBusinessFieldDisplayName,
  getDisabledFieldNotification,
  findDisabledPersonalField,
  findDisabledBusinessField,
  PERSONAL_FIELDS,
  BUSINESS_FIELDS
}

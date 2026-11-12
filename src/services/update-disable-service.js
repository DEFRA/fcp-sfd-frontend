/**
 * Service for managing field-level update disable toggles
 * Provides utilities to check if specific fields can be updated
 * and to generate warning banners when updates are disabled
 * @module updateDisableService
 */

import { config } from '../config/index.js'

/**
 * Field mapping for personal details
 */
const PERSONAL_DETAIL_FIELDS = {
  name: 'updatePersonalDetailsName',
  dob: 'updatePersonalDetailsDob',
  address: 'updatePersonalDetailsAddress',
  phone: 'updatePersonalDetailsPhone',
  email: 'updatePersonalDetailsEmail'
}

/**
 * Field mapping for business details
 */
const BUSINESS_DETAIL_FIELDS = {
  businessName: 'updateBusinessDetailsName',
  businessAddress: 'updateBusinessDetailsAddress',
  businessPhone: 'updateBusinessDetailsPhone',
  businessEmail: 'updateBusinessDetailsEmail',
  vat: 'updateBusinessDetailsVat',
  charityRegistration: 'updateBusinessDetailsCharityRegistration',
  companyRegistration: 'updateBusinessDetailsCompanyRegistration'
}

/**
 * Human-readable field names for warning messages
 */
const FIELD_DISPLAY_NAMES = {
  name: 'name',
  dob: 'date of birth',
  address: 'address',
  phone: 'phone number',
  email: 'email',
  businessName: 'business name',
  businessAddress: 'business address',
  businessPhone: 'phone number',
  businessEmail: 'email',
  vat: 'VAT',
  charityRegistration: 'charity registration',
  companyRegistration: 'company registration'
}

/**
 * Checks if a personal details field can be updated
 * @param {string} fieldKey - The field key (e.g., 'name', 'dob', 'address')
 * @returns {boolean} True if the field can be updated, false otherwise
 */
const canUpdatePersonalField = (fieldKey) => {
  const masterToggle = config.get('featureToggle.updatePersonalDetails')
  if (!masterToggle) return false

  const fieldToggle = PERSONAL_DETAIL_FIELDS[fieldKey]
  if (!fieldToggle) return true

  return config.get(`featureToggle.${fieldToggle}`)
}

/**
 * Checks if a business details field can be updated
 * @param {string} fieldKey - The field key (e.g., 'businessName', 'vat')
 * @returns {boolean} True if the field can be updated, false otherwise
 */
const canUpdateBusinessField = (fieldKey) => {
  const masterToggle = config.get('featureToggle.updateBusinessDetails')
  if (!masterToggle) return false

  const fieldToggle = BUSINESS_DETAIL_FIELDS[fieldKey]
  if (!fieldToggle) return true

  return config.get(`featureToggle.${fieldToggle}`)
}

/**
 * Gets all disabled personal detail fields
 * @returns {string[]} Array of disabled field display names
 */
const getDisabledPersonalFields = () => {
  const masterToggle = config.get('featureToggle.updatePersonalDetails')
  if (!masterToggle) {
    return Object.values(FIELD_DISPLAY_NAMES).slice(0, 5)
  }

  return Object.entries(PERSONAL_DETAIL_FIELDS)
    .filter(([, fieldToggle]) => !config.get(`featureToggle.${fieldToggle}`))
    .map(([fieldKey]) => FIELD_DISPLAY_NAMES[fieldKey])
}

/**
 * Gets all disabled business detail fields
 * @returns {string[]} Array of disabled field display names
 */
const getDisabledBusinessFields = () => {
  const masterToggle = config.get('featureToggle.updateBusinessDetails')
  if (!masterToggle) {
    return Object.values(FIELD_DISPLAY_NAMES).slice(5)
  }

  return Object.entries(BUSINESS_DETAIL_FIELDS)
    .filter(([, fieldToggle]) => !config.get(`featureToggle.${fieldToggle}`))
    .map(([fieldKey]) => FIELD_DISPLAY_NAMES[fieldKey])
}

/**
 * Generates a warning banner object for personal details
 * @returns {Object|null} Warning banner object or null if all fields can be updated
 */
const getPersonalDetailsWarning = () => {
  const disabledFields = getDisabledPersonalFields()
  if (disabledFields.length === 0) return null

  const fieldsList = disabledFields.join(', ')
  const displayFields = disabledFields.length > 1 ? `your ${fieldsList}` : `your ${fieldsList}`

  return {
    title: 'Important',
    text: `Sorry, there is a problem with the service. You cannot update ${displayFields} right now. Please try again later`
  }
}

/**
 * Generates a warning banner object for business details
 * @returns {Object|null} Warning banner object or null if all fields can be updated
 */
const getBusinessDetailsWarning = () => {
  const disabledFields = getDisabledBusinessFields()
  if (disabledFields.length === 0) return null

  const fieldsList = disabledFields.join(', ')
  const displayFields = disabledFields.length > 1 ? `your ${fieldsList}` : `your ${fieldsList}`

  return {
    title: 'Important',
    text: `Sorry, there is a problem with the service. You cannot update ${displayFields} right now. Please try again later`
  }
}

export {
  canUpdatePersonalField,
  canUpdateBusinessField,
  getDisabledPersonalFields,
  getDisabledBusinessFields,
  getPersonalDetailsWarning,
  getBusinessDetailsWarning,
  PERSONAL_DETAIL_FIELDS,
  BUSINESS_DETAIL_FIELDS
}

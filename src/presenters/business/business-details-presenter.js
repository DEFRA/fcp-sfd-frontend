/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

// Permissions
import { PERMISSION_GROUP } from '../../constants/scope/business-details.js'

// Presenters and constants
import { businessDetailsChangeLinksPresenter } from './business-details-change-links-presenter.js'
import { constants, presenters } from '@defra/fcp-sfd-frontend-engine'
import { getDisabledFieldNotification, findDisabledBusinessField, isBusinessFieldAccessible } from '../../utils/feature-toggle/check-field-accessibility.js'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external
const { NOT_ADDED_TEXT } = constants

const businessDetailsPresenter = (data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate) => {
  const changeLinks = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)
  const countyParishHoldingNumbers = presenters.formatCph(data.countyParishHoldingNumbers)

  return {
    backLink: {
      text: data.businessName ? presenters.formatBackLink(data.businessName) : 'Back',
      href: '/home'
    },
    businessNameHeader: data.businessName ?? null,
    notification: yar ? yar.flash('notification')[0] : null,
    disabledFieldNotification: getDisabledFieldNotificationIfNeeded(permissionLevel),
    pageTitle: getPageTitle(permissionLevel),
    metaDescription: 'View and update your business details.',
    userName: data.customer.userName ?? null,
    permissionsText: setPermissionsText(permissionLevel),
    businessAddress: buildBusinessAddressField(data, changeLinks),
    businessName: buildBusinessNameField(data, changeLinks),
    businessTelephone: buildBusinessTelephoneField(data, changeLinks),
    businessEmail: buildBusinessEmailField(data, changeLinks),
    sbi: data.sbi,
    vatNumber: buildVatDisplay(data.vat, changeLinks.vat),
    tradeNumber: data.traderNumber ?? null,
    vendorNumber: data.vendorNumber ?? null,
    countyParishHoldingNumbers,
    countyParishHoldingNumbersText: presenters.formatCphText(countyParishHoldingNumbers.length),
    businessLegalStatus: buildLegalStatusField(data, permissionLevel),
    legalStatusRegistrationNumber: buildLegalStatusRegistrationNumberDisplay(data, permissionLevel),
    businessType: buildBusinessTypeField(data, permissionLevel)
  }
}

const buildBusinessAddressField = (data, changeLinks) => {
  return {
    value: formatAddress(data.address),
    changeLink: changeLinks.businessAddress,
    action: presenters.getActionText(data.address?.lookup?.uprn || data.address?.manual?.line1)
  }
}

const buildBusinessEmailField = (data, changeLinks) => {
  return {
    value: data.email || NOT_ADDED_TEXT,
    action: presenters.getActionText(data.email),
    changeLink: changeLinks.businessEmail
  }
}

const buildBusinessNameField = (data, changeLinks) => {
  return {
    value: data.businessName || NOT_ADDED_TEXT,
    changeLink: changeLinks.businessName,
    action: presenters.getActionText(data.businessName)
  }
}

const buildBusinessTelephoneField = (data, changeLinks) => {
  return {
    telephone: data.landline || NOT_ADDED_TEXT,
    mobile: data.mobile || NOT_ADDED_TEXT,
    action: presenters.getActionText(data.landline || data.mobile),
    changeLink: changeLinks.businessTelephone
  }
}

const buildBusinessTypeField = (data, permissionLevel) => {
  return {
    value: data.type ?? NOT_ADDED_TEXT,
    action: presenters.getActionText(data.type),
    changeLink: getLegalOnlyChangeLink(permissionLevel, BUSINESS_CHANGE_LINKS.businessType)
  }
}

const buildLegalStatusField = (data, permissionLevel) => {
  return {
    value: data.legalStatus ?? NOT_ADDED_TEXT,
    action: presenters.getActionText(data.legalStatus),
    changeLink: getLegalOnlyChangeLink(permissionLevel, BUSINESS_CHANGE_LINKS.businessLegalStatus)
  }
}

/**
 * Builds the registration number row for the business details page.
 *
 * Only charity and company legal statuses hold a registration number, so this
 * returns null for every other status and the view omits the row entirely.
 * Only the number matching the legal status is shown.
 *
 * @param {Object} data - The mapped business details
 * @param {string} permissionLevel - The user's permission level, only 'legal' can add or change the number
 *
 * @returns {{label: string, value: string, action: string, changeLink: string|null}|null} The row data, or null when the legal status has no registration number
 */
const buildLegalStatusRegistrationNumberDisplay = (data, permissionLevel) => {
  // The DAL returns the legal status code as a number, the engine codes are strings
  const legalStatusCode = String(data.legalStatusCode ?? '')
  const registrationNumbers = data.registrationNumbers ?? {}

  let label
  let number
  let changeLink

  if (constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(legalStatusCode)) {
    label = 'Charity commission registration number'
    number = registrationNumbers.charityCommission
    changeLink = BUSINESS_CHANGE_LINKS.businessCharityRegistrationNumber
  } else if (constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES.includes(legalStatusCode)) {
    label = 'Company registration number'
    number = registrationNumbers.companiesHouse
    changeLink = BUSINESS_CHANGE_LINKS.businessCompanyRegistrationNumber
  } else {
    return null
  }

  // Hide the change link when the registration number is switched off by a feature toggle
  if (!isBusinessFieldAccessible('registrationNumber')) {
    changeLink = null
  }

  return {
    label,
    value: number || NOT_ADDED_TEXT,
    action: presenters.getActionText(number),
    changeLink: getLegalOnlyChangeLink(permissionLevel, changeLink)
  }
}

/**
 * Builds the VAT row data for the business details page.
 *
 * VAT is more complex than other fields because:
 * - Users may or may not have permission to change VAT details
 * - VAT supports multiple actions (add, change, remove)
 * - During the business details interrupter flow, VAT actions may need
 *   to route via the business-fix journey instead of the normal pages
 *
 * This function does not return direct URLs in all cases.
 * Instead, it returns the data needed by the view to render:
 * - the displayed VAT value
 * - the action text (Add / Change)
 * - either a single change link, multiple links (Change / Remove),
 *   or no links at all
 *
 * Behaviour summary:
 * - If `vatChangeState` is null, the user does not have permission to
 *   change VAT and no actions are shown.
 * - If `vatChangeState` is `'interrupter'`, links are routed via the
 *   business-fix pages to force the user through the interrupter journey.
 * - Otherwise, normal add/change/remove links are returned.
 */
const buildVatDisplay = (vatNumber, vatChangeState) => {
  const hasVat = Boolean(vatNumber)
  const value = vatNumber || NOT_ADDED_TEXT

  // If no vatChangeState it means the user does not have permission to change VAT details
  if (!vatChangeState) {
    return {
      value,
      action: null,
      changeLink: null
    }
  }

  // Interrupter flow: invalid data, user has permission, must go via business-fix
  if (vatChangeState === 'interrupter') {
    const changeLink = '/business-fix?source=vat'
    // Links still need to display the same as normal, but if no VAT number, link goes to interrupter add page
    if (!hasVat) {
      return {
        value,
        action: 'Add',
        changeLink
      }
    }

    // If VAT number exists, show normal change/remove links but via interrupter pages
    return {
      value: vatNumber,
      action: 'Change',
      changeLink: buildVatLinks(changeLink, changeLink)
    }
  }

  // Normal flow: user has permission and no interrupter
  if (!hasVat) {
    return {
      value,
      action: 'Add',
      changeLink: BUSINESS_CHANGE_LINKS.businessVat
    }
  }

  return {
    value,
    action: 'Change',
    changeLink: buildVatLinks(BUSINESS_CHANGE_LINKS.businessVat, BUSINESS_CHANGE_LINKS.businessVatRemove)
  }
}

const buildVatLinks = (changeHref, removeHref) => {
  const classes = 'govuk-link--no-visited-state'
  const visuallyHiddenText = 'VAT registration number'

  return {
    items: [
      { href: changeHref, text: 'Change', visuallyHiddenText, classes },
      { href: removeHref, text: 'Remove', visuallyHiddenText, classes }
    ]
  }
}

const formatAddress = (businessAddress) => {
  const lines = presenters.formatBusinessAddress(businessAddress)
  return lines.length > 0 ? lines : NOT_ADDED_TEXT
}

/**
 * Checks if any business field the user can update is currently disabled by feature toggle
 * Returns a notification banner if a field is disabled, otherwise null
 */
const getDisabledFieldNotificationIfNeeded = (permissionLevel) => {
  const fieldsToCheck = getUpdatableFields(permissionLevel)

  // Users who cannot update anything never need to see the banner
  if (fieldsToCheck.length === 0) {
    return null
  }

  const disabledField = findDisabledBusinessField(fieldsToCheck)

  if (disabledField) {
    return getDisabledFieldNotification(disabledField.displayName)
  }

  return null
}

// Only users with the legal permission level can change these fields
const getLegalOnlyChangeLink = (permissionLevel, changeLink) => {
  return permissionLevel === PERMISSION_GROUP.LEGAL ? changeLink : null
}

const getPageTitle = (permissionLevel) => {
  return permissionLevel === PERMISSION_GROUP.VIEW ? 'View business details' : 'View and update your business details'
}

// The fields each permission level is allowed to update
const getUpdatableFields = (permissionLevel) => {
  if (permissionLevel === PERMISSION_GROUP.LEGAL) {
    return ['name', 'address', 'phone', 'email', 'vat', 'registrationNumber']
  }

  if (permissionLevel === PERMISSION_GROUP.AMEND) {
    return ['address', 'phone', 'email']
  }

  return []
}

const setPermissionsText = (permissionLevel) => {
  if (permissionLevel === PERMISSION_GROUP.AMEND) {
    return 'You only have permission to update contact details for this business. You can ask the business to raise your permission level.'
  }

  if (permissionLevel === PERMISSION_GROUP.VIEW) {
    return 'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
  }

  return null
}

export {
  businessDetailsPresenter
}

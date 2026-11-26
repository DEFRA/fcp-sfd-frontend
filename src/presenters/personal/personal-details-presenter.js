/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import { constants, presenters } from '@defra/fcp-sfd-frontend-engine'
import { getConfigService } from '../../services/get-config-service.js'
import {
  isPersonalFieldAccessible,
  getDisabledFieldNotification,
  findDisabledPersonalField
} from '../../utils/feature-toggle/check-field-accessibility.js'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external
const { NOT_ADDED_TEXT } = constants

const personalDetailsPresenter = (data, yar, hasValidPersonalDetails, sectionsNeedingUpdate) => {
  const changeLinks = formatChangeLinks(hasValidPersonalDetails, sectionsNeedingUpdate)
  const { action: dobAction, formattedDob } = formatDob(data.dateOfBirth.full)

  return {
    backLink: {
      text: data.business.name ? presenters.formatBackLink(data.business.name) : 'Back',
      href: '/home'
    },
    notification: yar ? yar.flash('notification')[0] : null,
    disabledFieldNotification: getDisabledFieldNotificationIfNeeded(),
    pageTitle: 'View and update your personal details',
    metaDescription: 'View and update your personal details.',
    userName: data.userName ?? null,
    crn: data.crn,
    personalName: {
      fullName: data.fullNameJoined,
      action: getActionText(data.fullNameJoined),
      changeLink: changeLinks.name
    },
    dob: {
      fullDateOfBirth: formattedDob,
      action: dobAction,
      changeLink: changeLinks.dob
    },
    personalAddress: {
      address: formatAddress(data.address),
      action: getActionText(data.address?.lookup?.uprn || data.address?.manual?.line1),
      changeLink: changeLinks.address
    },
    personalTelephone: {
      telephone: data.telephone || NOT_ADDED_TEXT,
      mobile: data.mobile || NOT_ADDED_TEXT,
      action: getActionText(data.telephone || data.mobile),
      changeLink: changeLinks.phone
    },
    personalEmail: {
      email: data.email || NOT_ADDED_TEXT,
      action: getActionText(data.email),
      changeLink: changeLinks.email
    }
  }
}

const formatAddress = (personalAddress) => {
  let addressText = NOT_ADDED_TEXT

  if (personalAddress.lookup?.uprn || personalAddress.manual?.line1) {
    addressText = presenters.formatDisplayAddress(personalAddress)
  }

  return addressText
}

const getActionText = (value) => {
  return value ? 'Change' : 'Add'
}

/**
 * Checks if any personal field is currently disabled by feature toggle
 * Returns a notification banner if a field is disabled, otherwise null
 */
const getDisabledFieldNotificationIfNeeded = () => {
  const fieldsToCheck = ['name', 'dob', 'address', 'phone', 'email']
  const disabledField = findDisabledPersonalField(fieldsToCheck)

  if (disabledField) {
    return getDisabledFieldNotification(disabledField.displayName)
  }

  return null
}

/**
 * Builds change links for personal details based on whether the
 * personal details interrupter is enabled, feature toggles are set,
 * and the validity of the data.
 *
 * When the interrupter is disabled, feature toggles are all enabled,
 * and all personal details are valid, standard change links are returned.
 *
 * When the interrupter is enabled and details are invalid:
 * - If only one section needs updating, its normal change link is used
 * - Otherwise, all links point to the personal details fix journey
 *
 * When a field is disabled by feature toggle:
 * - That field's change link is set to null (hidden)
 */
const formatChangeLinks = (hasValidPersonalDetails, sectionsNeedingUpdate = []) => {
  const CHANGE_LINKS = {
    name: isPersonalFieldAccessible('name') ? PERSONAL_CHANGE_LINKS.personalName : null,
    address: isPersonalFieldAccessible('address') ? PERSONAL_CHANGE_LINKS.personalAddress : null,
    phone: isPersonalFieldAccessible('phone') ? PERSONAL_CHANGE_LINKS.personalPhone : null,
    email: isPersonalFieldAccessible('email') ? PERSONAL_CHANGE_LINKS.personalEmail : null,
    dob: isPersonalFieldAccessible('dob') ? PERSONAL_CHANGE_LINKS.personalDateOfBirth : null
  }

  const personalDetailsInterrupterEnabled = getConfigService('featureToggle.personalDetailsInterrupterEnabled')

  // Happy path – interrupter off or data is valid
  if (!personalDetailsInterrupterEnabled || hasValidPersonalDetails || sectionsNeedingUpdate.length === 0) {
    return CHANGE_LINKS
  }

  // Interrupter on and data invalid
  const singleSection = sectionsNeedingUpdate.length === 1 ? sectionsNeedingUpdate[0] : null

  return {
    name: resolveInterrupterLink('name', singleSection, CHANGE_LINKS.name),
    address: resolveInterrupterLink('address', singleSection, CHANGE_LINKS.address),
    phone: resolveInterrupterLink('phone', singleSection, CHANGE_LINKS.phone),
    email: resolveInterrupterLink('email', singleSection, CHANGE_LINKS.email),
    dob: resolveInterrupterLink('dob', singleSection, CHANGE_LINKS.dob)
  }
}

/**
 * Works out the change link for one field while the interrupter is active.
 * - A disabled field has no link, so the link stays hidden
 * - The one section that needs fixing links to its normal change page
 * - Every other section links to the personal details fix page
 */
const resolveInterrupterLink = (field, singleSection, normalLink) => {
  if (!normalLink) {
    return null
  }

  if (singleSection === field) {
    return normalLink
  }

  return `/personal-fix?source=${field}`
}

const formatDob = (dob) => {
  if (!dob) {
    return { formattedDob: NOT_ADDED_TEXT, action: 'Add' }
  }

  const date = new Date(dob)

  // getTime() returns NaN for invalid dates
  if (Number.isNaN(date.getTime()) || date > new Date()) {
    return { formattedDob: NOT_ADDED_TEXT, action: 'Add' }
  }

  return {
    formattedDob: presenters.formatLongDate(date),
    action: 'Change'
  }
}

export {
  personalDetailsPresenter
}

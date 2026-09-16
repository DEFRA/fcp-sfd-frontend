/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import { constants, presenters } from '@defra/fcp-sfd-frontend-engine'
import { config } from '../../config/index.js'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external

const personalDetailsPresenter = (data, yar, hasValidPersonalDetails, sectionsNeedingUpdate) => {
  const changeLinks = formatChangeLinks(hasValidPersonalDetails, sectionsNeedingUpdate)
  const { action: dobAction, formattedDob } = formatDob(data.dateOfBirth.full)

  return {
    backLink: {
      text: data.business.info.name ? presenters.formatBackLink(data.business.info.name) : 'Back',
      href: '/home'
    },
    notification: yar ? yar.flash('notification')[0] : null,
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
      telephone: data.telephone || 'Not added',
      mobile: data.mobile || 'Not added',
      action: getActionText(data.telephone || data.mobile),
      changeLink: changeLinks.phone
    },
    personalEmail: {
      email: data.email || 'Not added',
      action: getActionText(data.email),
      changeLink: changeLinks.email
    }
  }
}

const formatAddress = (personalAddress) => {
  let addressText = 'Not added'

  if (personalAddress.lookup?.uprn || personalAddress.manual?.line1) {
    addressText = presenters.formatDisplayAddress(personalAddress)
  }

  return addressText
}

const getActionText = (value) => {
  return value ? 'Change' : 'Add'
}

/**
 * Builds change links for personal details based on whether the
 * personal details interrupter is enabled and the validity of the data.
 *
 * When the interrupter is disabled or all personal details are valid,
 * standard change links are returned.
 *
 * When the interrupter is enabled and details are invalid:
 * - If only one section needs updating, its normal change link is used
 * - Otherwise, all links point to the personal details fix journey
 */
const formatChangeLinks = (hasValidPersonalDetails, sectionsNeedingUpdate = []) => {
  const CHANGE_LINKS = {
    name: PERSONAL_CHANGE_LINKS.personalName,
    address: PERSONAL_CHANGE_LINKS.personalAddress,
    phone: PERSONAL_CHANGE_LINKS.personalPhone,
    email: PERSONAL_CHANGE_LINKS.personalEmail,
    dob: PERSONAL_CHANGE_LINKS.personalDateOfBirth
  }

  const personalDetailsInterrupterEnabled = config.get('featureToggle.personalDetailsInterrupterEnabled')

  // Happy path – interrupter off or data is valid
  if (!personalDetailsInterrupterEnabled || hasValidPersonalDetails || sectionsNeedingUpdate.length === 0) {
    return CHANGE_LINKS
  }

  // Interrupter on and data invalid
  const singleSection = sectionsNeedingUpdate.length === 1 ? sectionsNeedingUpdate[0] : null

  return {
    name: singleSection === 'name' ? CHANGE_LINKS.name : '/personal-fix?source=name',
    address: singleSection === 'address' ? CHANGE_LINKS.address : '/personal-fix?source=address',
    phone: singleSection === 'phone' ? CHANGE_LINKS.phone : '/personal-fix?source=phone',
    email: singleSection === 'email' ? CHANGE_LINKS.email : '/personal-fix?source=email',
    dob: singleSection === 'dob' ? CHANGE_LINKS.dob : '/personal-fix?source=dob'
  }
}

const formatDob = (dob) => {
  if (!dob) {
    return { formattedDob: 'Not added', action: 'Add' }
  }

  const date = new Date(dob)

  // getTime() returns NaN for invalid dates
  if (Number.isNaN(date.getTime()) || date > new Date()) {
    return { formattedDob: 'Not added', action: 'Add' }
  }

  return {
    formattedDob: presenters.formatLongDate(date),
    action: 'Change'
  }
}

export {
  personalDetailsPresenter
}

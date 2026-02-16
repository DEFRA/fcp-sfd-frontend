/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import moment from 'moment'
import { formatBackLink, formatDisplayAddress } from '../base-presenter.js'
import { config } from '../../config/index.js'

const personalDetailsPresenter = (data, yar, hasValidPersonalDetails, sectionsNeedingUpdate) => {
  const changeLinks = formatChangeLinks(hasValidPersonalDetails, sectionsNeedingUpdate)
  const { action: dobAction, formattedDob } = formatDob(data.info.dateOfBirth.full)

  return {
    backLink: {
      text: data.business.info.name ? formatBackLink(data.business.info.name) : 'Back',
      href: '/home'
    },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your personal details',
    metaDescription: 'View and update your personal details.',
    userName: data.info.userName ?? null,
    crn: data.crn,
    personalName: {
      fullName: data.info.fullNameJoined,
      action: getActionText(data.info.fullNameJoined),
      changeLink: changeLinks.name
    },
    dob: {
      fullDateOfBirth: formattedDob,
      action: dobAction,
      changeLink: changeLinks.dob
    },
    personalAddress: {
      address: formatDisplayAddress(data.address),
      action: 'Change',
      changeLink: changeLinks.address
    },
    personalTelephone: {
      telephone: data.contact.telephone ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added',
      action: getActionText(data.contact.telephone || data.contact.mobile),
      changeLink: changeLinks.phone
    },
    personalEmail: {
      email: data.contact.email ?? 'Not added',
      action: getActionText(data.contact.email),
      changeLink: changeLinks.email
    }
  }
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
    name: '/account-name-change',
    address: '/account-address-change',
    phone: '/account-phone-numbers-change',
    email: '/account-email-change',
    dob: '/account-date-of-birth-change'
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
  // We check if dob exists because moment will default to the current date if
  // passed undefined
  let formattedDob = 'Not added'
  let action = 'Add'
  if (dob && moment(dob).isValid()) {
    const dobMoment = moment(dob)
    formattedDob = dobMoment.format('D MMMM YYYY')
    if (!dobMoment.isAfter(moment(), 'day')) {
      action = 'Change'
    }
  }
  return { formattedDob, action }
}

export {
  personalDetailsPresenter
}

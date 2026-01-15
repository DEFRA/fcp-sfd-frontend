/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import moment from 'moment'
import { formatBackLink, formatDisplayAddress } from '../base-presenter.js'

const personalDetailsPresenter = (data, yar) => {
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
    address: formatDisplayAddress(data.address),
    fullName: data.info.fullNameJoined,
    personalTelephone: {
      telephone: data.contact.telephone ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added',
      action: data.contact.telephone || data.contact.mobile ? 'Change' : 'Add',
      link: '/account-phone-numbers-change'
    },
    personalEmail: {
      email: data.contact.email ?? 'Not added',
      action: data.contact.email ? 'Change' : 'Add',
      link: '/account-email-change'
    },
    dateOfBirth: {
      dob: formatDob(data.info.dateOfBirth.full) ?? 'Not added',
      action: formatDob(data.info.dateOfBirth.full) ? 'Change' : 'Add',
      link: '/account-date-of-birth-change'
    }
  }
}

const formatDob = (dob) => {
  // We check if dob exists because moment will default to the current date if
  // passed undefined
  const formattedDob = dob && moment(dob).isValid() ? moment(dob).format('D MMMM YYYY') : null

  return formattedDob
}

export {
  personalDetailsPresenter
}

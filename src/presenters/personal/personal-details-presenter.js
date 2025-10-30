/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import moment from 'moment'
import { formatFullName, formatDisplayAddress } from '../base-presenter.js'

const personalDetailsPresenter = (data, yar) => {
  moment.locale('en-gb')
  return {
    backLink: {
      text: data.businessName ? formatBackLink(data.businessName) : 'Back',
      href: '/home'
    },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your personal details',
    metaDescription: 'View and update your personal details.',
    crn: data.crn,
    address: formatDisplayAddress(data.address),
    fullName: formatFullName(data.info.fullName),
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
    dateOfBirth: moment(data.info.dateOfBirth).format('LL'),
    dobChangeLink: '/account-date-of-birth-change'
  }
}

const formatBackLink = (businessName) => {
  if (businessName.length > 50) {
    return `Back to ${businessName.slice(0, 50)}…`
  }
  return `Back to ${businessName}`
}

export {
  personalDetailsPresenter
}

/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import moment from 'moment'
import { formatBackLink, formatDisplayAddress } from '../base-presenter.js'

const personalDetailsPresenter = (data, yar) => {
  moment.locale('en-gb')
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
    dateOfBirth: moment(data.info.dateOfBirth).format('LL'),
    dobChangeLink: '/account-date-of-birth-change'
  }
}

export {
  personalDetailsPresenter
}

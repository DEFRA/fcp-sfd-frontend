/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import { formatAddress } from '../base-presenter.js'

const personalDetailsPresenter = (data, yar) => {
  return {
    backLink: { href: '/home' },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your personal details',
    metaDescription: 'View and update your personal details.',
    crn: data.crn,
    address: formatAddress(data.address),
    fullName: formatFullName(data.info.fullName),
    personalTelephone: {
      telephone: data.contact.telephone ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added',
      action: data.contact.telephone || data.contact.mobile ? 'Change' : 'Add',
      link: '/account-phone-numbers-change'
    },
    personalEmail: data.contact.email,
    dateOfBirth: data.info.dateOfBirth
  }
}

const formatFullName = (fullName) => {
  const { first, middle, last } = fullName

  return `${first} ${middle ? middle + ' ' : ''}${last}`
}

export {
  personalDetailsPresenter
}

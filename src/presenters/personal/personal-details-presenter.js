/**
 * Formats data ready for presenting in the `/personal-details` page
 * @module personalDetailsPresenter
 */

import moment from 'moment'
import { formatBackLink, formatDisplayAddress } from '../base-presenter.js'

moment.locale('en-gb')

const personalDetailsPresenter = (data, yar, validated) => {
  const isValid = Boolean(validated)

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
    addressChangeLink: isValid ? '/account-address-change' : '/personal-fix?source=address',
    fullName: data.info.fullNameJoined,
    fullNameChangeLink: isValid ? '/account-name-change' : '/personal-fix?source=name',
    personalTelephone: {
      telephone: data.contact.telephone ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added',
      action: data.contact.telephone || data.contact.mobile ? 'Change' : 'Add',
      changeLink: isValid ? '/account-phone-numbers-change' : '/personal-fix?source=phone'
    },
    personalEmail: {
      email: data.contact.email ?? 'Not added',
      action: data.contact.email ? 'Change' : 'Add',
      changeLink: isValid ? '/account-email-change' : '/personal-fix?source=email'
    },
    dateOfBirth: moment(data.info.dateOfBirth).format('LL'),
    dobChangeLink: isValid ? '/account-date-of-birth-change' : '/personal-fix?source=dob'
  }
}

export {
  personalDetailsPresenter
}

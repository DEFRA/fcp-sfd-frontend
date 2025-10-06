/**
 * Formats data ready for presenting in the `/personal-phone-numbers-change` page
 * @module personalPhoneNumbersChangePresenter
 */

import { formatNumber } from '../base-presenter.js'

const personalPhoneNumbersChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What are your personal phone numbers?',
    metaDescription: 'Update the phone numbers for your personal account.',
    userName: data.info.fullName.fullNameJoined ?? null,
    personalTelephone: formatNumber(payload?.personalTelephone, data.changePersonalPhoneNumbers?.personalTelephone, data.contact.telephone),
    personalMobile: formatNumber(payload?.personalMobile, data.changePersonalPhoneNumbers?.personalMobile, data.contact.mobile)
  }
}

export { personalPhoneNumbersChangePresenter }

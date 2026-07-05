/**
 * Formats data ready for presenting in the `/personal-phone-numbers-change` page
 * @module personalPhoneNumbersChangePresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const personalPhoneNumbersChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What are your personal phone numbers?',
    metaDescription: 'Update the phone numbers for your personal account.',
    userName: data.info.userName ?? null,
    personalTelephone: presenters.formatNumber(payload?.personalTelephone, data.changePersonalPhoneNumbers?.personalTelephone, data.contact.telephone),
    personalMobile: presenters.formatNumber(payload?.personalMobile, data.changePersonalPhoneNumbers?.personalMobile, data.contact.mobile)
  }
}

export { personalPhoneNumbersChangePresenter }

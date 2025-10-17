/**
 * Formats data ready for presenting in the `/business-phone-number-change` page
 * @module businessPhoneNumberChangePresenter
 */

import { formatNumber } from '../base-presenter.js'

const businessPhoneNumbersChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What are your business phone numbers?',
    metaDescription: 'Update the phone numbers for your business.',
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null,
    businessTelephone: formatNumber(payload?.businessTelephone, data.changeBusinessPhoneNumbers?.businessTelephone, data.contact.landline),
    businessMobile: formatNumber(payload?.businessMobile, data.changeBusinessPhoneNumbers?.businessMobile, data.contact.mobile)
  }
}

export {
  businessPhoneNumbersChangePresenter
}

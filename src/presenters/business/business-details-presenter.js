/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

import { addressPresenter } from '../address-presenter.js'

const businessDetailsPresenter = (data, yar) => {
  return {
    backLink: { href: '/home' },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    address: addressPresenter.formatAddress(data.address),
    businessName: data.info.businessName,
    businessTelephone: {
      telephone: data.contact.landline ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added'
    },
    businessPhoneAction: data.contact.landline || data.contact.mobile ? 'Change' : 'Add',
    businessEmail: data.contact.email,
    sbi: data.info.sbi,
    vatNumber: data.info.vat ?? 'Number not added',
    hasVatNumber: data.info.vat ?? false,
    vatRemoveLink: '/business-vat-registration-remove',
    vatChangeLink: '/business-vat-registration-number-change',
    tradeNumber: data.info.traderNumber ?? null,
    vendorRegistrationNumber: data.info.vendorNumber ?? null,
    countyParishHoldingNumbers: formatCph(data.info.countyParishHoldingNumbers),
    businessLegalStatus: data.info.legalStatus,
    businessType: data.info.type,
    userName: data.customer.fullName
  }
}

const formatCph = (countyParishHoldings) => {
  return countyParishHoldings.map(cph => cph.cphNumber)
}

export {
  businessDetailsPresenter
}

/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

import { basePresenter } from '../base-presenter.js'

const businessDetailsPresenter = (data, yar) => {
  return {
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    address: basePresenter.formatAddress(data.address),
    businessName: data.info.businessName,
    businessTelephone: data.contact.landline ?? 'Not added',
    businessMobile: data.contact.mobile ?? 'Not added',
    businessEmail: data.contact.email,
    sbi: data.info.sbi,
    vatNumber: data.info.vat ?? null,
    tradeNumber: data.info.traderNumber ?? null,
    vendorRegistrationNumber: data.info.vendorNumber ?? null,
    countyParishHoldingNumber: null,
    businessLegalStatus: data.info.legalStatus,
    businessType: data.info.type,
    userName: data.customer.fullName
  }
}

export {
  businessDetailsPresenter
}

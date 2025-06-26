/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

const businessDetailsPresenter = (data, yar) => {
  return {
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    address: formatAddress(data.business.info.address),
    businessName: data.business.info.name,
    businessTelephone: data.business.info.phone.landline ?? 'Not added',
    businessMobile: data.business.info.phone.mobile ?? 'Not added',
    businessEmail: data.business.info.email.address,
    sbi: data.business.sbi ?? null,
    vatNumber: data.business.info.vat ?? null,
    tradeNumber: data.business.info.traderNumber ?? null,
    vendorRegistrationNumber: data.business.info.vendorNumber ?? null,
    countyParishHoldingNumber: null,
    businessLegalStatus: data.business.info.legalStatus.type ?? null,
    businessType: data.business.info.type.type ?? null,
    userName: `${data.customer.info.name.title} ${data.customer.info.name.first} ${data.customer.info.name.last}`
  }
}

/**
 * Formats the business address by removing any falsy values (e.g. empty strings, null, undefined)
 * @private
 */
const formatAddress = (businessAddress) => {
  return Object.values(businessAddress).filter(Boolean)
}

export {
  businessDetailsPresenter
}

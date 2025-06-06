/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

const businessDetailsPresenter = (data, yar) => {
  return {
    notification: yar.flash('notification')[0],
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    address: _formatAddress(data.businessAddress),
    businessName: data.businessName,
    businessTelephone: data.businessTelephone ?? 'Not added',
    businessMobile: data.businessMobile ?? 'Not added',
    businessEmail: data.businessEmail,
    singleBusinessIdentifier: data.singleBusinessIdentifier ?? null,
    vatNumber: data.vatNumber ?? null,
    tradeNumber: data.tradeNumber ?? null,
    vendorRegistrationNumber: data.vendorRegistrationNumber ?? null,
    countyParishHoldingNumber: data.countyParishHoldingNumber ?? null,
    businessLegalStatus: data.businessLegalStatus ?? null,
    businessType: data.businessType ?? null,
    userName: data.userName
  }
}

/**
 * Formats the business address by removing any falsy values (e.g. empty strings, null, undefined)
 * @private
 */
const _formatAddress = (businessAddress) => {
  return Object.values(businessAddress).filter(Boolean)
}

export {
  businessDetailsPresenter
}

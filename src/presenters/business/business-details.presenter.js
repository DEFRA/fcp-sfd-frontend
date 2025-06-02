/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

/**
 * Formats the data ready for presenting in the `/business-details` page
 *
 * @param {object} data - The business details data fetched from the API
 * @param {object} yar - The Hapi `request.yar` session manager
 *
 * @returns {object} page data needed for the `/business-details` page
 */
const businessDetailsPresenter = (data, yar) => {
  return {
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    notification: yar.flash('notification')[0],
    address: _formatAddress(data.businessAddress),
    businessName: data.businessName,
    businessTelephone: data.businessTelephone,
    businessMobile: data.businessMobile,
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

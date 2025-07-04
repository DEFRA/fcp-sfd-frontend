/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

const businessDetailsPresenter = (data, yar) => {
  return {
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    address: formatAddress(data.address),
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

/**
 * Identify the correct array of address fields to use from the DAL response
 * If **any** field in `addressFromLookup` is non-`null`, its values
 * are returned as an array; otherwise the `manualInput` is returned as an array.
 * Postcode and county are common to both address inputs and appended.
 * @private
 * @param {Object} businessAddress the complete address object for the business
  * @returns {string[]} An array of address fields (either from lookup or manual)
 */

const formatAddress = (address) => {
  const addressFromLookup = address.lookup
  const manualInput = address.manual

  const validLookupAddress = Object.values(addressFromLookup).some(values => values !== null)
  const userAddress = validLookupAddress ? addressFromLookup : manualInput

  if (userAddress.buildingNumberRange && userAddress.street) {
    // without this the number and street are sperate entitiys and displayed on seperate lines
    userAddress.street = `${userAddress.buildingNumberRange} ${userAddress.street}`
    userAddress.buildingNumberRange = null
  }
  const filteredUserAddress = Object.values(userAddress).filter(Boolean)

  return Array.from(Object.values({
    ...filteredUserAddress,
    postcode: address.postCode,
    country: address.country
  }))
}

export {
  businessDetailsPresenter
}

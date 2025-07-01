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
 * Identify the correct array of address fields to use from the DAL response
 * If **any** field in `addressFromLookup` is non-`null`, its values
 * are returned as an array; otherwise the `manualInput` is returned as an array.
 * Postcode and county are common to both address inputs and appended.
 * @private
 * @param {Object} businessAddress the complete address object for the buisness
  * @returns {string[]} An array of address fields (either from lookup or manual)
 */

const formatAddress = (businessAddress) => {
  const addressFromLookup = {
    flatname: businessAddress.flatName,
    number: businessAddress.buildingNumberRange,
    buildingName: businessAddress.buildingName,
    street: businessAddress.street,
    city: businessAddress.city,
    county: businessAddress.county
  }

  const manualInput = {
    line1: businessAddress.line1,
    line2: businessAddress.line2,
    line3: businessAddress.line3,
    line4: businessAddress.line4,
    line5: businessAddress.line5,

  }

  const validLookupAddress = Object.values(addressFromLookup).some(values => values !== null)
  const userAddress = validLookupAddress ? addressFromLookup : manualInput
  // if there is a number and a street
  //  combine them and delete the number only
  if (userAddress.number && userAddress.street) {
    userAddress.street = `${userAddress.number} ${userAddress.street}`
    userAddress.number = null
  }
  const filteredUserAddress = Object.values(userAddress).filter(Boolean)

  return Array.from(Object.values({
    ...filteredUserAddress,
    postcode: businessAddress.postalCode,
    country: businessAddress.country
  }))
}

export {
  businessDetailsPresenter
}

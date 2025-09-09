/**
 * Identify the correct address to use from the DAL response.
 *
 * An address lookup is where a user enters a postcode and selects an address
 * returned from an API. Manual input is when a user chooses to type the address in themselves.
 *
 * If the UPRN is populated, the user has selected an address from the lookup.
 * UPRN is only returned by the lookup API; manual addresses will always have `uprn = null`.
 *
 * If both a building number range and a street are present, they are combined into one line so they display together.
 *
 * Postcode and country are always appended to the final address array.
 *
 * @param {Object} address - The complete address object
 *
 * @returns {string[]} An array of address fields (either from lookup or manual)
 *
 * @private
 */

const formatAddress = (address) => {
  const { lookup, manual, postcode, country } = address

  let addressLines = []

  if (lookup.uprn) {
    // If the uprn is populated then the user has selected an address from the lookup
    const buildingAndStreet = lookup.buildingNumberRange && lookup.street
      ? `${lookup.buildingNumberRange} ${lookup.street}`
      : lookup.street

    addressLines = [
      lookup.flatName,
      lookup.buildingName,
      buildingAndStreet,
      lookup.county,
      lookup.city
    ]
  } else {
    // Otherwise the user manually entered the address
    addressLines = [
      manual.line1,
      manual.line2,
      manual.line3,
      manual.line4,
      manual.line5
    ]
  }

  return [
    ...addressLines.filter(Boolean),
    postcode,
    country
  ]
}

export const addressPresenter = {
  formatAddress
}

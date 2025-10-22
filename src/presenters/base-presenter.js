/**
 * Base presenter for formatting data for display
 */

/**
 * Formats the full name (first, middle and last) into a single string
 */
export const formatFullName = (nameData) => {
  return [
    nameData.first,
    nameData.middle,
    nameData.last
  ].filter(Boolean).join(' ')
}

/**
 * The first time a user loads the phone numbers change page they won't have entered any data, so a payload
 * or a changedNumber won't be present. If a user has a validation issue then we want to replay the payload data to them.
 * We check if payload is not undefined because it could be a user has removed the 'mobile' number for example but
 * incorrectly entered the telephone number so the payload for this would appear as an empty string.
 *
 * Payload is the priority to check and then after that if changedNumber is present then we display that value.
 *
 * @private
 */
export const formatNumber = (payloadNumber, changedNumber, originalNumber) => {
  if (payloadNumber !== undefined) {
    return payloadNumber
  }

  if (changedNumber !== undefined) {
    return changedNumber
  }

  return originalNumber
}

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

export const formatDisplayAddress = (address) => {
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
      lookup.city,
      lookup.county
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

/**
 * Formats an original address fetched from the DAL into a flattened structure
 * suitable for display or form population on the `address-enter` pages.
 *
 * If the address contains a UPRN, it is treated as a lookup address;
 * otherwise, it is treated as a manually entered address.
 *
 * @param {Object} originalAddress - The full address object from the DAL
 *
 * @returns {Object} A flattened address object with consistent keys
 */
export const formatOriginalAddress = (originalAddress) => {
  const { manual, country, postcode, lookup } = originalAddress

  if (lookup.uprn) {
    const addressLine1 = [lookup.flatName, lookup.buildingName, lookup.buildingNumberRange].filter(Boolean).join(', ')

    return {
      address1: addressLine1 || null,
      address2: lookup.street ?? null,
      address3: null,
      city: lookup.city ?? null,
      county: lookup.county ?? null,
      country: country ?? null,
      postcode: postcode ?? null
    }
  }

  return {
    address1: manual.line1 ?? null,
    address2: manual.line2 ?? null,
    address3: manual.line3 ?? null,
    city: manual.line4 ?? null,
    county: manual.line5 ?? null,
    country: country ?? null,
    postcode: postcode ?? null
  }
}

/**
 * Formats a changed address object into a consistent structure for form display.
 *
 * If the address includes a UPRN, it indicates the user selected it from an address lookup.
 * In that case, the lookup fields (`flatName`, `buildingName`, and `buildingNumberRange`)
 * are combined into `address1` and mapped into the manual address format used by the form.
 *
 * If the address does not include a UPRN, it is assumed to be manually entered and returned as-is.
 *
 * @param {Object} changeBusinessAddress - The changed address object to format
 *
 * @returns {Object} A formatted address object with fields `address1`, `address2`, `address3`,
 * `city`, `county`, `country`, and `postcode`.
 */
export const formatChangedAddress = (changeBusinessAddress) => {
  // If the change address has a UPRN we need to map the lookup address to the manual one
  if (changeBusinessAddress.uprn) {
    const { flatName, buildingName, buildingNumberRange, street, city, county, country, postcode } = changeBusinessAddress

    const addressLine1 = [flatName, buildingName, buildingNumberRange].filter(Boolean).join(', ')

    return {
      address1: addressLine1 || null,
      address2: street ?? null,
      address3: null,
      city: city ?? null,
      county: county ?? null,
      country: country ?? null,
      postcode: postcode ?? null
    }
  } else {
    // If the change address has no UPRN it means its been manually entered and we don't need to map it
    return changeBusinessAddress
  }
}

/**
 * Formats a list of address objects for display in a dropdown menu.
 *
 * Each address object is transformed into an option with:
 * - `value`: a concatenation of the address UPRN and displayAddress
 * - `text`: the formatted display address string
 * - `selected`: true only if it matches the previously picked address
 *
 * A summary option is prepended to the start of the list, showing how many
 * addresses were found. This summary option is selected by default unless
 * a previously picked address exists.
 *
 * This function is shared across presenters that display address selection
 * lists (e.g. personal or business address flows).
 *
 * Note: The `value` combines `uprn` and `displayAddress` to ensure uniqueness.
 * Some addresses (for example, postcode LL55 2NF) have been observed to share
 * the same UPRN, which caused incorrect selections when UPRN alone was used.
 * Concatenating both fields guarantees each dropdown option has a unique value.
 *
 * @param {Array<Object>} addresses - List of address objects with `uprn` and `displayAddress` properties
 * @param {Object} [previouslyPickedAddress] - Optional object representing the address previously selected by the user
 *
 * @returns {Array<Object>} Array of formatted address options ready for display
 */
export const formatDisplayAddresses = (addresses, previouslyPickedAddress) => {
  const displayAddresses = addresses.map(address => ({
    value: `${address.uprn}${address.displayAddress}`,
    text: address.displayAddress,
    selected:
      previouslyPickedAddress?.uprn === address.uprn &&
      previouslyPickedAddress?.displayAddress === address.displayAddress
  }))

  // Check if any address is already selected
  const hasSelectedAddress = displayAddresses.some(addr => addr.selected)

  // Add a display summary option to the beginning of the list
  // e.g. "18 addresses found"
  const text = addresses.length === 1 ? '1 address found' : `${addresses.length} addresses found`

  displayAddresses.unshift({
    value: 'display',
    text,
    selected: !hasSelectedAddress
  })

  return displayAddresses
}

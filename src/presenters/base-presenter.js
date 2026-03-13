/**
 * Base presenter for formatting data for display
 */

/**
 * Formats the business name into back link text.
 * If the business name is greater than 50 characters, it will be truncated with an ellipsis.
*/
const BACK_LINK_DISPLAY_MAX = 50

export const formatBackLink = (businessName) => {
  if (businessName.length > BACK_LINK_DISPLAY_MAX) {
    return `Back to ${businessName.slice(0, BACK_LINK_DISPLAY_MAX)}…`
  }
  return `Back to ${businessName}`
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
 * City, postcode and country are always appended to the final address array.
 *
 * @param {Object} address - The complete address object
 *
 * @returns {string[]} An array of address fields (either from lookup or manual)
 *
 * @private
 */

export const formatDisplayAddress = (address) => {
  const { lookup, manual, postcode, country, city } = address

  let addressLines = []

  if (lookup.uprn) {
    // If the uprn is populated then the user has selected an address from the lookup
    const buildingAndStreet = [
      lookup.buildingNumberRange,
      lookup.street
    ].filter(Boolean).join(' ')

    addressLines = [
      lookup.pafOrganisationName,
      lookup.flatName,
      lookup.buildingName,
      buildingAndStreet,
      lookup.doubleDependentLocality,
      lookup.dependentLocality,
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
    city,
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
  const { lookup, manual, city, country, postcode } = originalAddress

  if (lookup.uprn) {
    const addressLine1 = [
      lookup.pafOrganisationName,
      lookup.flatName,
      lookup.buildingName
    ].filter(Boolean).join(', ')

    const addressLine2 = [
      lookup.buildingNumberRange,
      lookup.street
    ].filter(Boolean).join(' ')

    const addressLine3 = [
      lookup.doubleDependentLocality,
      lookup.dependentLocality
    ].filter(Boolean).join(', ')

    return {
      address1: addressLine1 || null,
      address2: addressLine2 || null,
      address3: addressLine3 || null,
      county: lookup.county ?? null,
      city: city ?? null,
      country: country ?? null,
      postcode: postcode ?? null
    }
  }

  return {
    address1: manual.line1 ?? null,
    address2: manual.line2 ?? null,
    address3: manual.line3 ?? null,
    city: city ?? null,
    county: manual.line4 ?? null,
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
  if (changeBusinessAddress.uprn) {
    const {
      pafOrganisationName,
      flatName,
      buildingName,
      buildingNumberRange,
      street,
      doubleDependentLocality,
      dependentLocality,
      city,
      county,
      country,
      postcode
    } = changeBusinessAddress

    const addressLine1 = [
      pafOrganisationName,
      flatName,
      buildingName
    ].filter(Boolean).join(', ')

    const addressLine2 = [
      buildingNumberRange,
      street
    ].filter(Boolean).join(' ')

    const addressLine3 = [
      doubleDependentLocality,
      dependentLocality
    ].filter(Boolean).join(', ')

    return {
      address1: addressLine1 || null,
      address2: addressLine2 || null,
      address3: addressLine3 || null,
      city: city ?? null,
      county: county ?? null,
      country: country ?? null,
      postcode: postcode ?? null
    }
  }

  // manual address (no lookup used)
  return changeBusinessAddress
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

/**
 * Shared helper used by base presenters to sort validation errors so they
 * appear in the same order as the sections and fields shown on a Fix List page.
 *
 * Fix List pages are built dynamically depending on:
 * - which sections need fixing, and
 * - which field the user originally selected.
 *
 * Because of that, we can’t rely on the order of the validation object.
 * We need to deliberately sort the errors so they match:
 *   1. The order the sections appear on the page, and
 *   2. The logical order of fields within each section.
 *
 * This function keeps that logic in one reusable place so it can be used
 * by Business, Personal, or any future Fix List presenter.
 *
 * It returns the errors as an array, already arranged in the correct
 * display order for the UI.
 */
export const sortErrorsBySectionOrder = (errors, orderedSectionsToFix, SECTION_FIELD_ORDER) => {
  const sortedErrors = []

  for (const section of orderedSectionsToFix) {
    // A section (i.e 'address') can have multiple fields (i.e 'line1', 'line2', 'line3')
    const fieldsInSection = SECTION_FIELD_ORDER[section] || []

    for (const field of fieldsInSection) {
      // If there's an error for this field, add it to the sorted list with the error details
      if (errors[field]) {
        sortedErrors.push({
          field,
          ...errors[field]
        })
      }
    }
  }

  return sortedErrors
}

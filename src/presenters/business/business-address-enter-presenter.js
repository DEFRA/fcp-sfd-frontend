/**
 * Formats data ready for presenting in the `/business-address-enter` page
 * @module businessAddressEnterPresenter
 */

const businessAddressEnterPresenter = (data, payload) => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: formatAddress(payload, data.changeBusinessAddress, data.address),
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null
  }
}

/**
 * Formats an address for display based on the available data.
 *
 * The function prioritises the input parameters in the following order:
 *
 * 1. If `payload` exists, it returns `payload` as-is (usually due to a validation error).
 *
 * 2. If `changeBusinessAddress` exists:
 *    - Returns a formatted address combining `flatName`, `buildingName`, and `buildingNumberRange` into `address1`
 *      if it contains a `uprn` (selected from address lookup).
 *
 *    - Otherwise, returns `changeBusinessAddress` as-is (manually entered address).
 *
 * 3. If `originalAddress` exists:
 *    - Returns a formatted address from `lookup` if `lookup.uprn` is present (selected from postcode lookup).
 *    - Otherwise, returns a formatted address from `manual` lines.
 */
const formatAddress = (payload, changeBusinessAddress, originalAddress) => {
  // Return the payload as is
  if (payload) {
    return payload
  }

  if (changeBusinessAddress) {
    // If the change address has a UPRN we need to map the lookup address to the manual one
    if (changeBusinessAddress.uprn) {
      const { flatName, buildingName, buildingNumberRange, street, city, county, country, postcode } = changeBusinessAddress

      const addressLine1 = [flatName, buildingName, buildingNumberRange].filter(Boolean).join(', ')

      return {
        address1: addressLine1 ?? null,
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

  if (originalAddress) {
    const { manual, country, postcode, lookup } = originalAddress

    if (lookup.uprn) {
      const addressLine1 = [lookup.flatName, lookup.buildingName, lookup.buildingNumberRange].filter(Boolean).join(', ')

      return {
        address1: addressLine1?? null,
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

  return null
}

export {
  businessAddressEnterPresenter
}

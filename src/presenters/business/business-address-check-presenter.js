/**
 * Formats data ready for presenting in the `/business-address-check` page
 * @module businessAddressCheckPresenter
 */

const businessAddressCheckPresenter = (businessDetails) => {
  const { changeBusinessAddress, address, info, customer } = businessDetails

  return {
    backLink: backLink(changeBusinessAddress?.postcodeLookup),
    changeLink: changeLink(changeBusinessAddress?.postcodeLookup),
    pageTitle: 'Check your business address is correct before submitting',
    metaDescription: 'Check the address for your business is correct.',
    address: formatAddress(changeBusinessAddress ?? address),
    businessName: info.businessName ?? null,
    sbi: info.sbi ?? null,
    userName: customer.fullName ?? null
  }
}

/**
 * Formats the business address into an array of address parts.
 * - Removes falsy values (null, undefined, empty strings)
 * - When from postcode lookup, excludes `uprn`, `displayAddress` and `postcodeLookup` keys
 */
const formatAddress = (businessAddress) => {
  if (businessAddress.postcodeLookup) {
    const { uprn, displayAddress, postcodeLookup, ...addressParts } = businessAddress

    return Object.values(addressParts).filter(Boolean)
  } else {
    return Object.values(businessAddress).filter(Boolean)
  }
}

const backLink = (postcodeLookup) => {
  if (postcodeLookup) {
    return { href: '/business-address-select-change' }
  } else {
    return { href: '/business-address-enter' }
  }
}

const changeLink = (postcodeLookup) => {
  if (postcodeLookup) {
    return '/business-address-select-change'
  } else {
    return '/business-address-enter'
  }
}

export {
  businessAddressCheckPresenter
}

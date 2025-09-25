/**
 * Formats data ready for presenting in the `/business-address-check` page
 * @module businessAddressCheckPresenter
 */

const businessAddressCheckPresenter = (businessDetails) => {
  console.log('🚀 ~ businessDetails:', businessDetails)
  return {
    backLink: backLink(businessDetails.changeBusinessAddress?.postcodeLookup),
    changeLink: changeLink(businessDetails.changeBusinessAddress?.postcodeLookup),
    pageTitle: 'Check your business address is correct before submitting',
    metaDescription: 'Check the address for your business is correct.',
    address: formatAddress(businessDetails.changeBusinessAddress ?? businessDetails.address),
    businessName: businessDetails.info.businessName ?? null,
    sbi: businessDetails.info.sbi ?? null,
    userName: businessDetails.customer.fullName ?? null
  }
}

/**
 * Formats the business address by removing any falsy values (e.g. empty strings, null, undefined)
 * @private
 */
const formatAddress = (businessAddress) => {
  if (businessAddress.postcodeLookup) {
    const { uprn, displayAddress, postcodeLookup, ...rest } = businessAddress

    return Object.values(rest).filter(Boolean)
  }

  return Object.values(businessAddress).filter(Boolean)
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

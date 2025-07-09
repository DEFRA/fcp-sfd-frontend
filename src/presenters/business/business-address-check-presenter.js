/**
 * Formats data ready for presenting in the `/business-address-check` page
 * @module businessAddressCheckPresenter
 */

const businessAddressCheckPresenter = (businessDetails, session) => {
  return {
    backLink: { href: '/business-address-enter' },
    cancelLink: '/business-details',
    changeLink: '/business-address-enter',
    pageTitle: 'Check your business address is correct before submitting',
    metaDescription: 'Check the address for your business is correct.',
    address: formatAddress(session ?? businessDetails.changeBusinessAddress),
    businessName: businessDetails.businessName ?? null,
    sbi: businessDetails.sbi ?? null,
    userName: businessDetails.userName ?? null
  }
}

/**
 * Formats the business address by removing any falsy values (e.g. empty strings, null, undefined)
 * @private
 */
const formatAddress = (businessAddress) => {
  return Object.values(businessAddress).filter(Boolean)
}

export {
  businessAddressCheckPresenter
}

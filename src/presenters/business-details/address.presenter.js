/**
 * Formats data for the `/business-details/address` page
 * @module AddressPresenter
 */

/**
 * Formats data for the `/business-details/address` page
 *
 * @param {object} data - The address data needed
 *
 * @returns {object} - Page data needed for the `/business-details/address` page
 */
function go (addressData) {
  return {
    backLink: '/business-details',
    businessName: 'Agile Farm Ltd',
    metaDescription: 'Enter the address for your business.',
    originalAddress: addressData,
    pageTitle: 'Enter your business address',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

export const AddressPresenter = {
  go
}

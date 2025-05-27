/**
 * Formats data for the `/business-details/address` page
 * @module AddressPresenter
 */

/**
 *
 * @param {*} request
 */
function go (request) {
  const originalAddress = {
        address1: request.state.address1 || '10 Skirbeck Way',
        address2: request.state.address2 || '',
        addressCity: request.state.addressCity || 'Maidstone',
        addressCounty: request.state.addressCounty || '',
        addressPostcode: request.state.addressPostcode || 'SK22 1DL',
        addressCountry: request.state.addressCountry || 'United Kingdom'
    }

  return {
    businessName: 'Agile Farm Ltd',
    metaDescription: 'Enter the address for your business.',
    pageTitle: 'Enter your business address',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    originalAddress
  }
}

export const AddressPresenter = {
  go
}

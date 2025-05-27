/**
 * Fetches the address for a business to display on the `/business-details/address` page
 * @module FetchAddressService
 */

/**
 * Fetches the address for a business to use on the `/business-details/address` page
 * Fetches the address by making an API call to ...
 *
 * @param request - The hapi request object
 *
 * @returns {object} - An object containing the address
 */
async function go (request) {
  const address1 = request.state.address1 || '10 Skirbeck Way'
  const address2 = request.state.address2 || ''
  const addressCity = request.state.addressCity || 'Maidstone'
  const addressCounty = request.state.addressCounty || ''
  const addressPostcode = request.state.addressPostcode || 'SK22 1DL'
  const addressCountry = request.state.addressCountry || 'United Kingdom'

  return {
      address1,
      address2,
      addressCity,
      addressCounty,
      addressPostcode,
      addressCountry
    }
}

export const FetchAddressService = {
  go
}

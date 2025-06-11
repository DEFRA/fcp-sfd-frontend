/**
 * Fetches the business address associated with the logged in users business
 * @module fetchBusinessAddressService
 */

const fetchBusinessAddressService = async (_request) => {
  // Refactor: Remove stubbed data and instead call the API to get the business address associated with the users log in
  // The data needed for the business address page.
  return {
    businessName: 'Agile Farm Ltd',
    businessAddress: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    singleBusinessIdentifier: '123456789',
    userName: 'Alfred Waldron'
  }
}

export {
  fetchBusinessAddressService
}

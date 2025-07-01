/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessDetailsService
 */

const fetchBusinessDetailsService = async (yar) => {
  // Refactor: Remove stubbed data and instead call the API to get the business details associated with the users log in
  // This will be using the consolidated view API
  // The data needed for the business details page.

  const businessDetails = yar.get('businessDetails')
    ? yar.get('businessDetails')
    : {
        businessName: 'Agile Farm Ltd',
        businessAddress: {
          address1: '10 Skirbeck Way',
          address2: '',
          city: 'Maidstone',
          county: '',
          postcode: 'SK22 1DL',
          country: 'United Kingdom'
        },
        businessPhones: {
          telephone: '01234567890',
          mobile: '01234567811'
        },
        businessEmail: 'a.farmer@farms.com',
        sbi: '123456789',
        vatNumber: '',
        tradeNumber: '987654',
        vendorRegistrationNumber: '699368',
        countyParishHoldingNumber: '12/563/0998',
        businessLegalStatus: 'Sole proprietorship',
        businessType: 'Central or local government',
        userName: 'Alfred Waldron'
      }
  yar.set('businessDetails', businessDetails)
  return businessDetails
}

export {
  fetchBusinessDetailsService
}

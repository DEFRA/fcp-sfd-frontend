/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessDetailsService
 */

const fetchBusinessDetailsService = async (yar) => {
  const sessionData  = yar.get('businessDetailsData')

  // If sessionData is null it means it has never been set and therefore this is the first time the user
  // has hit the page. In this case return the mock data (this will be replaced with an API call)

  // If the sessionData.businessDetailsUpdated is true then it means the user has updated the data on the change pages
  // and therefore we need to return the mock data (this will be replaced with an API call)
  if(sessionData === null || sessionData.businessDetailsUpdated === true) {
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
      businessTelephone: '01234567890',
      businessMobile: '01234567890',
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
  }

  // Otherwise the data has not been updated so return the session data
  return sessionData
}

export {
  fetchBusinessDetailsService
}

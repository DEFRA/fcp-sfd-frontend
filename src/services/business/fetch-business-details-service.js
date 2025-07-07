/**
 * Returns the `businessDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchBusinessDetailsService
 */

import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery } from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'

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
  yar.set('businessDetails', businessDetails)
  return businessDetails
}

export {
  fetchBusinessDetailsService
}

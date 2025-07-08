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
<<<<<<< HEAD

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
=======

const fetchBusinessDetailsService = async (yar) => {
  return yar.get('businessDetails') ?? await getFromDal(yar)
}

const getFromDal = async (yar) => {
  // replace variables and email when defraId is setup
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'not-a-real-email@test.co.uk'

  const dalResponse = await dalConnector(businessDetailsQuery, variables, email)

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)
    yar.set('businessDetails', mappedResponse)

    return mappedResponse
  }

  return dalResponse
>>>>>>> 7cae884aa15f5b4bcb1bcba2dd72238d71d86850
}

export {
  fetchBusinessDetailsService
}

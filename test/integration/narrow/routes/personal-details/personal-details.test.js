import { describe, test, expect } from 'vitest'
import * as cheerio from 'cheerio'

import { createServer } from '../../../../../src/server.js'
import { dalConnector } from '../../../../../src/dal/connector.js'
import { personalDetailsQuery } from '../../../../../src/dal/queries/personal-details.js'

describe('/business-details', async () => {
  const url = '/business-details'
  const dataFromDal = await dalConnector(personalDetailsQuery, { sbi: '107183280', crn: '9477368292' }, 'mr-farmer@test.co.uk')

  describe('when making a GET request', async () => {
    const server = await createServer()
    await server.initialize()
    const response = await server.inject({
      method: 'GET',
      url
    })
    const $ = cheerio.load(response.result)

    describe('the "Reference numbers" section should use data from the DAL associated with the given crn', async () => {
      const $referenceNumbers = $('.govuk-summary-list').eq(1)

      test('it should display the correct crn', async () => {
        const $crn = $referenceNumbers.find('.govuk-summary-list__value').eq(0).text().trim()
        expect($crn).toBe(dataFromDal.data.customer.crn)
      })
      test('it should display the correct date of birth', async () => {
        const $dob = $referenceNumbers.find('.govuk-summary-list__value').eq(1).text().trim()
        expect($dob).toBe(dataFromDal.data.customer.info.dateOfBirth)
      })

      test('it should display the correct personal contact email', async () => {
        const $email = $referenceNumbers.find('.govuk-summary-list__value').eq(2).text().trim()
        expect($email).toBe(dataFromDal.data.customer.info.email.address)
      })
      test('it should display the correct personal phone number', async () => {
        const $phone = $referenceNumbers.find('.govuk-summary-list__value').eq(3).text().trim()
        expect($phone).toBe(dataFromDal.data.customer.info.phone.landline
      })
    })
  })
})

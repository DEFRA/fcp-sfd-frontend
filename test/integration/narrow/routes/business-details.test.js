import { describe, test, expect } from 'vitest'
import * as cheerio from 'cheerio'

import { createServer } from '../../../../src/server.js'
import { dalConnector } from '../../../../src/dal/connector.js'
import { businessDetailsQuery } from '../../../../src/dal/queries/business-details.js'

describe('/business-details', async () => {
  const url = '/business-details'
  const dataFromDal = await dalConnector(businessDetailsQuery, { sbi: '107183280', crn: '9477368292' }, 'mr-farmer@test.co.uk')

  describe('when making a GET request', async () => {
    const server = await createServer()
    await server.initialize()
    const response = await server.inject({
      method: 'GET',
      url
    })
    const $ = cheerio.load(response.result)

    describe('the Business contact details section should use data from the DAL associated with the given sbi', async () => {
      const $businessContactDetails = $('.govuk-summary-list')

      test('it should display the correct business name', async () => {
        const $businessName = $businessContactDetails.find('.govuk-summary-list__value').eq(0).text().trim()
        expect($businessName).toBe(dataFromDal.data.business.info.name)
      })

      test('it should display the correct business address', async () => {
        const $businessAddress = $businessContactDetails.find('.govuk-summary-list__value').eq(1).text().replace(/\s+/g, ' ').trim()
        expect($businessAddress).toBe('THE COACH HOUSE 7 STOCKWELL HALL HAREWOOD AVENUE DARLINGTON Dorset CO9 3LS United Kingdom')
      })

      test('it should display the correct business landline phone number', async () => {
        const $landlinePhoneNumber = $businessContactDetails.find('.govuk-summary-list__value').eq(2).find('div.govuk-hint').eq(0).text()
        expect($landlinePhoneNumber).toBe(dataFromDal.data.business.info.phone.landline)
      })

      test('it should display "Not added" when the business mobile phone number is null', async () => {
        const $mobilePhoneNumber = $businessContactDetails.find('.govuk-summary-list__value').eq(2).find('div.govuk-hint').eq(1).text()
        expect($mobilePhoneNumber).toBe('Not added')
      })

      test('it should display the correct business email', async () => {
        const $businessEmail = $businessContactDetails.find('.govuk-summary-list__value').eq(3).text().trim()
        expect($businessEmail).toBe(dataFromDal.data.business.info.email.address)
      })
    })

    describe('the "Reference numbers" section should use data from the DAL associated with the given sbi', async () => {
      const $referenceNumbers = $('.govuk-summary-list').eq(1)

      test('it should display the correct sbi', async () => {
        const $sbi = $referenceNumbers.find('.govuk-summary-list__value').eq(0).text().trim()
        expect($sbi).toBe(dataFromDal.data.business.sbi)
      })

      test('it should display the vat number', async () => {
        const $vat = $referenceNumbers.find('.govuk-summary-list__value').eq(1).text().trim()
        expect($vat).toBe(dataFromDal.data.business.info.vat)
      })

      test('it should display the trader number', async () => {
        const $trader = $referenceNumbers.find('.govuk-summary-list__value').eq(2).text().trim()
        expect($trader).toBe(dataFromDal.data.business.info.traderNumber)
      })

      test('it should display the vendor registration number', async () => {
        const $vendor = $referenceNumbers.find('.govuk-summary-list__value').eq(3).text().trim()
        expect($vendor).toBe(dataFromDal.data.business.info.vendorNumber)
      })

      // TODO add a test around the CPH number once we introduce dynamic sections
    })

    describe('the "Additional details" section should use data from the DAL associated with the given sbi', async () => {
      const $referenceNumbers = $('.govuk-summary-list').eq(2)

      test('it should display the business legal status', async () => {
        const $sbi = $referenceNumbers.find('.govuk-summary-list__value').eq(0).text().trim()
        expect($sbi).toBe(dataFromDal.data.business.info.legalStatus.type)
      })

      test('it should display the business type', async () => {
        const $sbi = $referenceNumbers.find('.govuk-summary-list__value').eq(1).text().trim()
        expect($sbi).toBe(dataFromDal.data.business.info.type.type)
      })
    })
  })
})

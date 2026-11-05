import { constants } from '@defra/fcp-sfd-frontend-engine'
import { vi, beforeAll, afterAll, describe, test, expect } from 'vitest'
import * as cheerio from 'cheerio'
import '../../../mocks/setup-server-mocks.js'

vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn().mockResolvedValue({
    businessName: 'Agile Farm Ltd',
    sbi: '876543210',
    legalStatusCode: 102109,
    registrationNumbers: { companiesHouse: '12345678', charityCommission: null },
    customer: { userName: 'Alfred Waldron' }
  })
}))

vi.mock('../../../../src/services/business/validate-business-details-service.js', () => ({
  validateBusinessDetailsService: vi.fn().mockReturnValue({ hasValidBusinessDetails: true, sectionsNeedingUpdate: [] })
}))

const { createServer } = await import('../../../../src/server.js')

const getBusinessDetails = (scope) => server.inject({
  url: '/business-details',
  auth: {
    strategy: 'session',
    credentials: { sessionId: 'session-id', sbi: '876543210', crn: '9876543210', scope }
  }
})

let server

describe('business details route', () => {
  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  describe('when the user has full permission', () => {
    test('it shows the legal change links', async () => {
      const response = await getBusinessDetails(['BUSINESS_DETAILS:FULL_PERMISSION'])
      const $ = cheerio.load(response.result)

      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect($('a[href="/business-name-change"]').length).toBe(1)
      expect($('a[href="/business-vat-registration-number-change"]').length).toBe(1)
      expect($('a[href="/business-type-change"]').length).toBe(1)
      expect($('a[href="/business-legal-status-change"]').length).toBe(1)
      expect($('a[href="/business-company-registration-number-change"]').length).toBe(1)
    })
  })

  describe('when the user has make legal changes permission', () => {
    test('it shows the legal change links', async () => {
      const response = await getBusinessDetails(['BUSINESS_DETAILS:MAKE_LEGAL_CHANGES'])
      const $ = cheerio.load(response.result)

      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect($('a[href="/business-name-change"]').length).toBe(1)
      expect($('a[href="/business-vat-registration-number-change"]').length).toBe(1)
      expect($('a[href="/business-type-change"]').length).toBe(1)
      expect($('a[href="/business-legal-status-change"]').length).toBe(1)
      expect($('a[href="/business-company-registration-number-change"]').length).toBe(1)
    })
  })

  describe('when the user has amend permission', () => {
    test('it does not show the legal change links', async () => {
      const response = await getBusinessDetails(['BUSINESS_DETAILS:AMEND'])
      const $ = cheerio.load(response.result)

      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect($('a[href="/business-name-change"]').length).toBe(0)
      expect($('a[href="/business-vat-registration-number-change"]').length).toBe(0)
      expect($('a[href="/business-type-change"]').length).toBe(0)
      expect($('a[href="/business-legal-status-change"]').length).toBe(0)
      expect($('a[href="/business-company-registration-number-change"]').length).toBe(0)
    })
  })

  describe('when the user has view permission', () => {
    test('it does not show the legal change links', async () => {
      const response = await getBusinessDetails(['BUSINESS_DETAILS:VIEW'])
      const $ = cheerio.load(response.result)

      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect($('a[href="/business-name-change"]').length).toBe(0)
      expect($('a[href="/business-vat-registration-number-change"]').length).toBe(0)
      expect($('a[href="/business-type-change"]').length).toBe(0)
      expect($('a[href="/business-legal-status-change"]').length).toBe(0)
      expect($('a[href="/business-company-registration-number-change"]').length).toBe(0)
      expect($('a[href="/business-address-change"]').length).toBe(0)
    })
  })
})

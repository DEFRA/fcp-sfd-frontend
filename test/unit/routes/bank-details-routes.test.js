// Test framework dependencies
import { vi, beforeEach, describe, test, expect } from 'vitest'
import Hapi from '@hapi/hapi'

// Things we need to mock
const mockCheckBankDetailsServiceHealth = vi.fn()
const mockGetBankDetails = vi.fn()

vi.mock('../../../src/services/bank-details/bank-details-client.js', () => ({
  checkBankDetailsServiceHealth: mockCheckBankDetailsServiceHealth,
  getBankDetails: mockGetBankDetails
}))

// Thing under test
const { bankDetailsRoutes } = await import('../../../src/routes/bank-details-routes.js')

const mockStsClient = { send: vi.fn() }
const mockBankDetails = { sbi: '800000001', bankName: 'Test Bank' }

const mockResponse = {
  code: vi.fn().mockReturnThis()
}

const mockH = {
  response: vi.fn().mockReturnValue(mockResponse)
}

const getRoute = (path) => bankDetailsRoutes.find((route) => route.path === path)

describe('bank details routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /bank-details-check', () => {
    const route = getRoute('/bank-details-check')
    const request = { sts: mockStsClient }

    test('should have the correct method and not require auth', () => {
      expect(route.method).toBe('GET')
      expect(route.options.auth).toBe(false)
    })

    test('should pass the STS client to the health check', async () => {
      mockCheckBankDetailsServiceHealth.mockResolvedValue(true)

      await route.handler(request, mockH)

      expect(mockCheckBankDetailsServiceHealth).toHaveBeenCalledWith(mockStsClient)
    })

    test('should return success when the service is healthy', async () => {
      mockCheckBankDetailsServiceHealth.mockResolvedValue(true)

      await route.handler(request, mockH)

      expect(mockH.response).toHaveBeenCalledWith({ message: 'success' })
    })

    test('should return failure when the service is not healthy', async () => {
      mockCheckBankDetailsServiceHealth.mockResolvedValue(false)

      await route.handler(request, mockH)

      expect(mockH.response).toHaveBeenCalledWith({ message: 'failure' })
    })
  })

  describe('GET /bank-details-check/{sbi}', () => {
    const route = getRoute('/bank-details-check/{sbi}')
    const request = { params: { sbi: '800000001' }, sts: mockStsClient }

    test('should have the correct method and not require auth', () => {
      expect(route.method).toBe('GET')
      expect(route.options.auth).toBe(false)
    })

    test('should pass the SBI and STS client to the bank details client', async () => {
      mockGetBankDetails.mockResolvedValue(mockBankDetails)

      await route.handler(request, mockH)

      expect(mockGetBankDetails).toHaveBeenCalledWith('800000001', mockStsClient)
    })

    test('should return the bank details when they are found', async () => {
      mockGetBankDetails.mockResolvedValue(mockBankDetails)

      const result = await route.handler(request, mockH)

      expect(mockH.response).toHaveBeenCalledWith(mockBankDetails)
      expect(mockResponse.code).not.toHaveBeenCalled()
      expect(result).toBe(mockResponse)
    })

    test('should return 502 with failure when the bank details call fails', async () => {
      mockGetBankDetails.mockResolvedValue(null)

      await route.handler(request, mockH)

      expect(mockH.response).toHaveBeenCalledWith({ message: 'failure' })
      expect(mockResponse.code).toHaveBeenCalledWith(502)
    })

    // The handler tests above bypass Joi, so validation needs a real server
    describe('SBI validation', () => {
      let server

      beforeEach(async () => {
        server = Hapi.server()
        server.route(route)
      })

      test('should accept a valid 9 digit SBI', async () => {
        mockGetBankDetails.mockResolvedValue(mockBankDetails)

        const response = await server.inject({ method: 'GET', url: '/bank-details-check/800000001' })

        expect(response.statusCode).toBe(200)
        expect(mockGetBankDetails).toHaveBeenCalledWith('800000001', undefined)
      })

      test.each([
        ['an encoded traversal', '/bank-details-check/..%2Fhealth'],
        ['a nested encoded traversal', '/bank-details-check/..%2F..%2Fanything'],
        ['a non-numeric value', '/bank-details-check/abc'],
        ['too few digits', '/bank-details-check/12345678']
      ])('should reject %s with 400 without calling the bank details client', async (_description, url) => {
        const response = await server.inject({ method: 'GET', url })

        expect(response.statusCode).toBe(400)
        expect(mockGetBankDetails).not.toHaveBeenCalled()
      })
    })
  })
})

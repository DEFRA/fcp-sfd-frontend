// Test framework dependencies
import { vi, beforeEach, describe, test, expect } from 'vitest'

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
const mockBankDetails = { sbi: '123456789', bankName: 'Test Bank' }

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
    const request = { params: { sbi: '123456789' }, sts: mockStsClient }

    test('should have the correct method and not require auth', () => {
      expect(route.method).toBe('GET')
      expect(route.options.auth).toBe(false)
    })

    test('should pass the SBI and STS client to the bank details client', async () => {
      mockGetBankDetails.mockResolvedValue(mockBankDetails)

      await route.handler(request, mockH)

      expect(mockGetBankDetails).toHaveBeenCalledWith('123456789', mockStsClient)
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
  })
})

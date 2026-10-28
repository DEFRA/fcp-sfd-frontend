// Test framework dependencies
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'

// Things we need to mock
const mockConfigGet = vi.fn()
const mockGetWebIdentityToken = vi.fn()
const mockLogger = { info: vi.fn(), error: vi.fn() }
const mockFetch = vi.fn()

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: mockConfigGet
  }
}))

vi.mock('../../../../src/services/bank-details/web-identity-token.js', () => ({
  getWebIdentityToken: mockGetWebIdentityToken
}))

vi.mock('../../../../src/utils/logger.js', () => ({
  createLogger: () => mockLogger
}))

// Thing under test
const {
  checkBankDetailsServiceHealth,
  getBankDetails
} = await import('../../../../src/services/bank-details/bank-details-client.js')

const endpoint = 'https://fcp-sfd-bank-details.test'
const mockStsClient = { send: vi.fn() }
const mockToken = 'mock-web-identity-token'
const mockBankDetails = {
  sbi: '123456789',
  accountName: 'Test Account',
  accountNumber: '00000000',
  sortCode: '00-00-00',
  bankName: 'Test Bank'
}

describe('bank details client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)

    mockConfigGet.mockReturnValue(endpoint)
    mockGetWebIdentityToken.mockResolvedValue(mockToken)
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: vi.fn().mockResolvedValue(mockBankDetails) })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('checkBankDetailsServiceHealth', () => {
    describe('when the endpoint is not configured', () => {
      test('should return false without requesting a token or calling the service', async () => {
        mockConfigGet.mockReturnValue(null)

        const result = await checkBankDetailsServiceHealth(mockStsClient)

        expect(result).toBe(false)
        expect(mockGetWebIdentityToken).not.toHaveBeenCalled()
        expect(mockFetch).not.toHaveBeenCalled()
      })
    })

    describe('when a token is available', () => {
      test('should request the token using the STS client', async () => {
        await checkBankDetailsServiceHealth(mockStsClient)

        expect(mockGetWebIdentityToken).toHaveBeenCalledWith(mockStsClient)
      })

      test('should call the health endpoint with the bearer token', async () => {
        await checkBankDetailsServiceHealth(mockStsClient)

        expect(mockFetch).toHaveBeenCalledWith(`${endpoint}/health`, {
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      })

      test('should return true when the service responds ok', async () => {
        const result = await checkBankDetailsServiceHealth(mockStsClient)

        expect(result).toBe(true)
      })
    })

    describe('when no token is returned (local)', () => {
      test('should call the health endpoint without an Authorization header', async () => {
        mockGetWebIdentityToken.mockResolvedValue(null)

        await checkBankDetailsServiceHealth(mockStsClient)

        expect(mockFetch).toHaveBeenCalledWith(`${endpoint}/health`, { headers: {} })
      })
    })

    describe('when requesting the token fails', () => {
      test('should return false without calling the service', async () => {
        mockGetWebIdentityToken.mockRejectedValue(new Error('AccessDenied'))

        const result = await checkBankDetailsServiceHealth(mockStsClient)

        expect(result).toBe(false)
        expect(mockFetch).not.toHaveBeenCalled()
        expect(mockLogger.error).toHaveBeenCalled()
      })
    })

    describe('when the service responds with an error status', () => {
      test('should return false', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 401 })

        const result = await checkBankDetailsServiceHealth(mockStsClient)

        expect(result).toBe(false)
        expect(mockLogger.error).toHaveBeenCalled()
      })
    })

    describe('when the request to the service fails', () => {
      test('should return false', async () => {
        mockFetch.mockRejectedValue(new Error('ECONNREFUSED'))

        const result = await checkBankDetailsServiceHealth(mockStsClient)

        expect(result).toBe(false)
      })
    })
  })

  describe('getBankDetails', () => {
    const sbi = '123456789'

    describe('when the endpoint is not configured', () => {
      test('should return null without requesting a token or calling the service', async () => {
        mockConfigGet.mockReturnValue(null)

        const result = await getBankDetails(sbi, mockStsClient)

        expect(result).toBeNull()
        expect(mockGetWebIdentityToken).not.toHaveBeenCalled()
        expect(mockFetch).not.toHaveBeenCalled()
      })
    })

    describe('when a token is available', () => {
      test('should request the token using the STS client', async () => {
        await getBankDetails(sbi, mockStsClient)

        expect(mockGetWebIdentityToken).toHaveBeenCalledWith(mockStsClient)
      })

      test('should call the bank details endpoint for the SBI with the bearer token', async () => {
        await getBankDetails(sbi, mockStsClient)

        expect(mockFetch).toHaveBeenCalledWith(`${endpoint}/bank-details/${sbi}`, {
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      })

      test('should return the bank details when the service responds ok', async () => {
        const result = await getBankDetails(sbi, mockStsClient)

        expect(result).toEqual(mockBankDetails)
      })
    })

    describe('when no token is returned (local)', () => {
      test('should call the bank details endpoint without an Authorization header', async () => {
        mockGetWebIdentityToken.mockResolvedValue(null)

        await getBankDetails(sbi, mockStsClient)

        expect(mockFetch).toHaveBeenCalledWith(`${endpoint}/bank-details/${sbi}`, { headers: {} })
      })
    })

    describe('when requesting the token fails', () => {
      test('should return null without calling the service', async () => {
        mockGetWebIdentityToken.mockRejectedValue(new Error('AccessDenied'))

        const result = await getBankDetails(sbi, mockStsClient)

        expect(result).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
        expect(mockLogger.error).toHaveBeenCalled()
      })
    })

    describe('when the service responds with an error status', () => {
      test('should return null', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 401 })

        const result = await getBankDetails(sbi, mockStsClient)

        expect(result).toBeNull()
        expect(mockLogger.error).toHaveBeenCalled()
      })
    })

    describe('when the request to the service fails', () => {
      test('should return null', async () => {
        mockFetch.mockRejectedValue(new Error('ECONNREFUSED'))

        const result = await getBankDetails(sbi, mockStsClient)

        expect(result).toBeNull()
      })
    })
  })
})

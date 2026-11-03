// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { validateBusinessRegistrationNumberService } from '../../../../src/services/business/validate-business-registration-number-service.js'

// Test helpers
import { LEGAL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessRegistrationNumberChangeRoutes } from '../../../../src/routes/business/business-registration-number-change-routes.js'
const [getBusinessRegistrationNumberChange, postBusinessRegistrationNumberChange] = businessRegistrationNumberChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/validate-business-registration-number-service.js', () => ({
  validateBusinessRegistrationNumberService: vi.fn()
}))

describe('business registration number change', () => {
  let request
  let h

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
      auth: { credentials: { sbi: '800000001', crn: '9000000001', sessionId: 'test-session-id' } },
      yar: { set: vi.fn(), get: vi.fn().mockReturnValue({ sbi: '800000001' }) },
      payload: {}
    }

    const responseStub = {
      code: vi.fn().mockReturnThis(),
      takeover: vi.fn().mockReturnThis()
    }

    h = {
      redirect: vi.fn(),
      view: vi.fn(() => responseStub)
    }

    fetchBusinessChangeService.mockResolvedValue(getMockData())
  })

  describe('GET /business-registration-number-change', () => {
    test('should have the correct method, path and auth scope configured', () => {
      expect(getBusinessRegistrationNumberChange.method).toBe('GET')
      expect(getBusinessRegistrationNumberChange.path).toBe('/business-registration-number-change')
      expect(getBusinessRegistrationNumberChange.options.auth.scope).toBe(LEGAL_PERMISSIONS)
    })

    test('it calls fetchBusinessChangeService with credentials and the registration number session fields', async () => {
      await getBusinessRegistrationNumberChange.handler(request, h)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, [
        'changeBusinessCharityCommissionRegistrationNumber',
        'changeBusinessCompanyRegistrationNumber'
      ])
    })

    test('should render business-registration-number-change view with page data', async () => {
      await getBusinessRegistrationNumberChange.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-registration-number-change', expect.any(Object))
    })
  })

  describe('POST /business-registration-number-change', () => {
    test('should have the correct method, path and auth scope configured', () => {
      expect(postBusinessRegistrationNumberChange.method).toBe('POST')
      expect(postBusinessRegistrationNumberChange.path).toBe('/business-registration-number-change')
      expect(postBusinessRegistrationNumberChange.options.auth.scope).toBe(LEGAL_PERMISSIONS)
    })

    describe('and the number is valid', () => {
      test('it sets the registration number in session and redirects to check', async () => {
        request.payload = { charityCommissionRegistrationNumber: '1234567' }
        validateBusinessRegistrationNumberService.mockReturnValue({
          error: undefined,
          value: { charityCommissionRegistrationNumber: '1234567' },
          payloadField: 'charityCommissionRegistrationNumber',
          sessionField: 'changeBusinessCharityCommissionRegistrationNumber'
        })

        await postBusinessRegistrationNumberChange.handler(request, h)

        expect(validateBusinessRegistrationNumberService).toHaveBeenCalledWith('102111', request.payload)
        expect(setSessionData).toHaveBeenCalledWith(
          request.yar,
          'businessDetailsUpdate',
          'changeBusinessCharityCommissionRegistrationNumber',
          '1234567'
        )
        expect(h.redirect).toHaveBeenCalledWith('/business-registration-number-check')
      })
    })

    describe('and the number is invalid', () => {
      test('it renders the view with validation errors', async () => {
        request.payload = { charityCommissionRegistrationNumber: '' }
        validateBusinessRegistrationNumberService.mockReturnValue({
          error: {
            details: [
              {
                message: 'Enter the charity commission registration number',
                path: ['charityCommissionRegistrationNumber'],
                type: 'any.required'
              }
            ]
          },
          value: undefined,
          payloadField: 'charityCommissionRegistrationNumber',
          sessionField: 'changeBusinessCharityCommissionRegistrationNumber'
        })

        await postBusinessRegistrationNumberChange.handler(request, h)

        expect(setSessionData).not.toHaveBeenCalled()
        expect(h.view).toHaveBeenCalledWith('business/business-registration-number-change', expect.objectContaining({
          errors: expect.objectContaining({
            charityCommissionRegistrationNumber: expect.any(Object)
          })
        }))
      })
    })
  })
})

const getMockData = () => ({
  sbi: '800000001',
  businessName: 'Herberts Lawn Mowing',
  legalStatusCode: '102111',
  customer: { userName: 'Alex Smith' }
})

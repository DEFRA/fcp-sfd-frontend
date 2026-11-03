// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'
import { updateBusinessRegistrationNumberChangeService } from '../../../../src/services/business/update-business-registration-number-change-service.js'

// Test helpers
import { LEGAL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessRegistrationNumberCheckRoutes } from '../../../../src/routes/business/business-registration-number-check-routes.js'
const [getBusinessRegistrationNumberCheck, postBusinessRegistrationNumberCheck] = businessRegistrationNumberCheckRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-registration-number-change-service.js', () => ({
  updateBusinessRegistrationNumberChangeService: vi.fn()
}))

describe('business registration number check', () => {
  let request
  let h

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
      auth: { credentials: { sbi: '800000001', crn: '9000000001', sessionId: 'test-session-id' } },
      yar: { set: vi.fn(), get: vi.fn().mockReturnValue({ sbi: '800000001' }) },
      payload: {}
    }

    h = {
      redirect: vi.fn(),
      view: vi.fn()
    }

    fetchBusinessChangeService.mockResolvedValue(getMockData())
  })

  describe('GET /business-registration-number-check', () => {
    test('should have the correct method, path and auth scope configured', () => {
      expect(getBusinessRegistrationNumberCheck.method).toBe('GET')
      expect(getBusinessRegistrationNumberCheck.path).toBe('/business-registration-number-check')
      expect(getBusinessRegistrationNumberCheck.options.auth.scope).toBe(LEGAL_PERMISSIONS)
    })

    test('should have a pre-handler to guard against missing session data', () => {
      expect(getBusinessRegistrationNumberCheck.options.pre).toHaveLength(1)
    })

    test('it calls fetchBusinessChangeService with credentials and the registration number session fields', async () => {
      await getBusinessRegistrationNumberCheck.handler(request, h)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, [
        'changeBusinessCharityCommissionRegistrationNumber',
        'changeBusinessCompanyRegistrationNumber'
      ])
    })

    test('should render business-registration-number-check view with page data', async () => {
      await getBusinessRegistrationNumberCheck.handler(request, h)

      expect(h.view).toHaveBeenCalledWith('business/business-registration-number-check', expect.objectContaining({
        pageTitle: 'Check your company registration number is correct before submitting'
      }))
    })
  })

  describe('POST /business-registration-number-check', () => {
    test('should have the correct method, path and auth scope configured', () => {
      expect(postBusinessRegistrationNumberCheck.method).toBe('POST')
      expect(postBusinessRegistrationNumberCheck.path).toBe('/business-registration-number-check')
      expect(postBusinessRegistrationNumberCheck.options.auth.scope).toBe(LEGAL_PERMISSIONS)
    })

    test('should have a pre-handler to guard against missing session data', () => {
      expect(postBusinessRegistrationNumberCheck.options.pre).toHaveLength(1)
    })

    test('it calls updateBusinessRegistrationNumberChangeService and redirects to business details', async () => {
      await postBusinessRegistrationNumberCheck.handler(request, h)

      expect(updateBusinessRegistrationNumberChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      expect(h.redirect).toHaveBeenCalledWith('/business-details')
    })
  })
})

const getMockData = () => ({
  sbi: '800000001',
  businessName: 'Herberts Lawn Mowing',
  legalStatusCode: '102105',
  customer: { userName: 'Alex Smith' },
  changeBusinessCompanyRegistrationNumber: '12345678'
})

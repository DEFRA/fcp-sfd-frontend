import { describe, test, expect, vi, beforeEach } from 'vitest'
import { businessPhoneNumbersChangeRoutes } from
  '../../../../src/routes/business/business-phone-numbers-change-routes.js'
import { fetchBusinessPhoneNumbersChangeService } from
  '../../../../src/services/business/fetch-business-phone-numbers-change-service.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { businessPhoneNumbersChangePresenter } from
  '../../../../src/presenters/business/business-phone-numbers-change-presenter.js'

const [getBusinessPhoneNumbersChange, postBusinessPhoneNumbersChange] = businessPhoneNumbersChangeRoutes

const businessTelephone = '0123456789'
const businessMobile = '9876543210'

const createMockResponse = () => {
  const view = vi.fn().mockReturnThis()
  const code = vi.fn().mockReturnThis()
  const takeover = vi.fn().mockReturnThis()
  const stateMock = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnThis()

  return {
    h: { view, redirect, code, takeover },
    stateMock,
    view,
    redirect,
    code,
    takeover
  }
}

vi.mock('../../../../src/services/business/fetch-business-phone-numbers-change-service.js', () => ({
  fetchBusinessPhoneNumbersChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-phone-numbers-change-presenter.js', () => ({
  businessPhoneNumbersChangePresenter: vi.fn()
}))

describe('change business phone numbers', () => {
  let h
  let request
  let businessPhoneNumbersChange
  let pageData
  beforeEach(() => {
    vi.clearAllMocks()
    h = {
      view: vi.fn().mockReturnValue({})
    }

    businessPhoneNumbersChange = {}
    pageData = {}
    request = {
      payload: {
        businessTelephone,
        businessMobile
      },
      yar: {}
    }

    fetchBusinessPhoneNumbersChangeService.mockResolvedValue(businessPhoneNumbersChange)
    businessPhoneNumbersChangePresenter.mockReturnValue(pageData)
  })

  describe('GET /business-phone-numbers-change', () => {
    test('should have correct method and path', () => {
      expect(getBusinessPhoneNumbersChange.method).toBe('GET')
      expect(getBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
    })

    test('should render business-phonen-umbers-change.njk view with page data', async () => {
      await getBusinessPhoneNumbersChange.handler(request, h)
      expect(fetchBusinessPhoneNumbersChangeService).toHaveBeenCalled(request.yar)
      expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-change.njk', pageData)
    })
  })

  describe('POST /business-phone-numbers-change', () => {
    test('should have correct method and path', () => {
      expect(postBusinessPhoneNumbersChange.method).toBe('POST')
      expect(postBusinessPhoneNumbersChange.path).toBe('/business-phone-numbers-change')
    })

    describe('validation', () => {
      const schema = postBusinessPhoneNumbersChange.options.validate.payload

      test('should fail with empty fields', () => {
        const { error } = schema.validate({
          businessTelephone: '',
          businessMobile: ''
        })

        expect(error).toBeTruthy()
        expect(error.details.length).toBeGreaterThan(0)
      })

      test('should pass with valid phone numbers', () => {
        const { error } = schema.validate({
          businessTelephone,
          businessMobile
        })

        expect(error).toBeFalsy()
      })
    })

    test('should redirect to check page on successful submission', async () => {
      const { h } = createMockResponse()
      await postBusinessPhoneNumbersChange.options.handler(request, h)

      setSessionData(request.yar, 'businessDetails', 'changeBusinessPhones',
        { telephone: request.payload.businessTelephone, mobile: request.payload.businessMobile })

      expect(setSessionData).toHaveBeenCalledWith(request.yar, 'businessDetails', 'changeBusinessPhones',
        { telephone: request.payload.businessTelephone, mobile: request.payload.businessMobile })

      expect(h.redirect).toHaveBeenCalledWith('/business-phone-numbers-check')
    })

    test('should handle validation failures with error details', async () => {
      const request = {
        payload: {
          businessTelephone: '',
          businessMobile: ''
        }
      }

      const h = createMockResponse()

      const err = {
        details: [
          {
            path: ['businessTelephone'],
            message: 'Enter a business telephone number'
          },
          {
            path: ['businessMobile'],
            message: 'Enter a business mobile number'
          }
        ]
      }

      await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-change.njk', {
        errors: {
          businessTelephone: { text: 'Enter a business telephone number' },
          businessMobile: { text: 'Enter a business mobile number' }
        },
        ...pageData
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })

    test('should handle validation failure without error details', async () => {
      const request = {
        payload: {
          businessTelephone: '',
          businessMobile: ''
        }
      }

      const h = createMockResponse()
      const err = {}

      await postBusinessPhoneNumbersChange.options.validate.failAction(request, h, err)

      expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-change.njk', {
        errors: {},
        ...pageData
      })

      expect(h.code).toHaveBeenCalledWith(400)
      expect(h.takeover).toHaveBeenCalled()
    })
  })

  test('should export all routes', () => {
    expect(businessPhoneNumbersChangeRoutes).toEqual([
      getBusinessPhoneNumbersChange,
      postBusinessPhoneNumbersChange
    ])
  })
})

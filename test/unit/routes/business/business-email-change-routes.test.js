import { describe, test, expect, vi, beforeEach } from 'vitest'
import { businessEmailChangeRoutes } from '../../../../src/routes/business/business-email-change-routes.js'
import { fetchBusinessEmailChangeService } from '../../../../src/services/business/fetch-business-email-change-service.js'
import { setBusinessEmailChangeService } from '../../../../src/services/business/set-business-email-change-service.js'
import { businessEmailChangePresenter } from '../../../../src/presenters/business/business-email-change-presenter.js'

const [getBusinessEmailChange, postBusinessEmailChange] = businessEmailChangeRoutes

const businessEmail = 'name@example.com'

const createMockRequest = (overrides = {}) => ({
  payload: {
    businessEmail,
    ...overrides
  },
  state: {
    businessEmail,
    ...overrides
  }
})

const createMockResponse = () => {
  const stateMock = vi.fn().mockReturnThis()
  const view = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnThis()
  const code = vi.fn().mockReturnThis()
  const takeover = vi.fn().mockReturnThis()

  return {
    h: { view, redirect, code, takeover },
    stateMock,
    view,
    redirect,
    code,
    takeover
  }
}

vi.mock('../../../../src/services/business/fetch-business-email-change-service.js', () => ({
  fetchBusinessEmailChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/set-business-email-change-service.js', () => ({
  setBusinessEmailChangeService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-email-change-presenter.js', () => ({
  businessEmailChangePresenter: vi.fn()
}))

describe('change business email', () => {
  let h
  let request
  let businessEmailChange
  let pageData
  beforeEach(() => {
    vi.clearAllMocks()
    h = {
      view: vi.fn().mockReturnValue({})
    }

    businessEmailChange = {}
    pageData = {}
    request = {
      payload: {
        businessEmail
      },
      yar: {}
    }

    fetchBusinessEmailChangeService.mockResolvedValue(businessEmailChange)
    businessEmailChangePresenter.mockReturnValue(pageData)
  })

  describe('GET /business-email-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessEmailChange.method).toBe('GET')
      expect(getBusinessEmailChange.path).toBe('/business-email-change')
    })

    test('should render business-email-change.njk view with page data', async () => {
      await getBusinessEmailChange.handler(request, h)
      expect(fetchBusinessEmailChangeService).toHaveBeenCalled(request.yar)
      expect(h.view).toHaveBeenCalledWith('business/business-email-change.njk', pageData)
    })
  })

  describe('POST /business-email-change', () => {
    const schema = postBusinessEmailChange.options.validate.payload

    test('should have the correct method and path', () => {
      expect(postBusinessEmailChange.method).toBe('POST')
      expect(postBusinessEmailChange.path).toBe('/business-email-change')
    })

    describe('validation', () => {
      test('should fail on empty business email', () => {
        const result = schema.validate({ businessEmail: '' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter business email address')
      })

      test('should fail on invalid email', () => {
        const result = schema.validate({ businessEmail: 'not-an-email' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter an email address, like name@example.com')
      })

      test('should accept valid email', () => {
        const result = schema.validate({ businessEmail })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect to business-email-check on successful submission', async () => {
      const { h } = createMockResponse()
      await postBusinessEmailChange.options.handler(request, h)

      expect(setBusinessEmailChangeService).toHaveBeenCalledWith(businessEmail, {})
      expect(h.redirect).toHaveBeenCalledWith('/business-email-check')
    })

    describe('validation failAction', () => {
      test('should handle specific validation error', async () => {
        const request = createMockRequest({ businessEmail: '' })
        const { h } = createMockResponse()

        const err = {
          details: [{ path: ['businessEmail'], message: 'Enter business email address' }]
        }

        await postBusinessEmailChange.options.validate.failAction(request, h, err)

        expect(h.view).toHaveBeenCalledWith('business/business-email-change', {
          businessEmail: '',
          errors: {
            businessEmail: { text: 'Enter business email address' }
          }
        })

        expect(h.code).toHaveBeenCalledWith(400)
        expect(h.takeover).toHaveBeenCalled()
      })

      test('should handle error with undefined details', async () => {
        const request = createMockRequest({ businessEmail: '' })
        const { h } = createMockResponse()

        await postBusinessEmailChange.options.validate.failAction(request, h, {})

        expect(h.view).toHaveBeenCalledWith('business/business-email-change', {
          businessEmail: '',
          errors: {}
        })

        expect(h.code).toHaveBeenCalledWith(400)
        expect(h.takeover).toHaveBeenCalled()
      })
    })
  })

  test('should export all routes', () => {
    expect(businessEmailChangeRoutes).toEqual([
      getBusinessEmailChange,
      postBusinessEmailChange
    ])
  })
})

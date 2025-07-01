import { describe, beforeEach, test, expect, vi } from 'vitest'
import { businessNameChangeRoutes } from '../../../../src/routes/business/business-name-change-routes.js'
import { fetchBusinessNameChangeService } from '../../../../src/services/business/fetch-business-name-change-service.js'
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { businessNameChangePresenter } from '../../../../src/presenters/business/business-name-change-presenter.js'

const [getBusinessNameChange, postBusinessNameChange] = businessNameChangeRoutes

const businessName = 'Test Business'

const createMockRequest = (overrides = {}) => ({
  payload: {
    businessName,
    ...overrides
  },
  state: {
    businessName,
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

vi.mock('../../../../src/services/business/fetch-business-name-change-service.js', () => ({
  fetchBusinessNameChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-name-change-presenter.js', () => ({
  businessNameChangePresenter: vi.fn()
}))

describe('change business name', () => {
  let h
  let request
  let businessNameChange
  let pageData
  beforeEach(() => {
    vi.clearAllMocks()
    h = {
      view: vi.fn().mockReturnValue({})
    }

    businessNameChange = {}
    pageData = {}
    request = {
      payload: {
        businessName
      },
      yar: {}
    }

    fetchBusinessNameChangeService.mockResolvedValue(businessNameChange)
    businessNameChangePresenter.mockReturnValue(pageData)
  })

  describe('GET /business-name-change', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessNameChange.method).toBe('GET')
      expect(getBusinessNameChange.path).toBe('/business-name-change')
    })

    test('should render business-name-change.njk view with page data', async () => {
      await getBusinessNameChange.handler(request, h)
      expect(fetchBusinessNameChangeService).toHaveBeenCalled(request.yar)
      expect(h.view).toHaveBeenCalledWith('business/business-name-change.njk', pageData)
    })
  })

  describe('POST /business-name-change', () => {
    const schema = postBusinessNameChange.options.validate.payload

    test('should have the correct method and path', () => {
      expect(postBusinessNameChange.method).toBe('POST')
      expect(postBusinessNameChange.path).toBe('/business-name-change')
    })

    describe('validation', () => {
      test('should fail on empty business name', () => {
        const result = schema.validate({ businessName: '' })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Enter business name')
      })

      test('should fail on invalid business name', () => {
        const result = schema.validate({
          businessName:
            'This is a business name that is intentionally designed to exceed ' +
            'the maximum character limit defined in the schema validation rules, ' +
            'and therefore, when this string is submitted as part of the input, ' +
            'it should correctly trigger a validation error due to being too long ' +
            'for the specified constraint and field length.'
        })

        expect(result.error).toBeTruthy()
        expect(result.error.details[0].message).toBe('Business name must be 300 characters or less')
      })

      test('should accept valid business name', () => {
        const result = schema.validate({ businessName })

        expect(result.error).toBeFalsy()
      })
    })

    test('should redirect to business-name-check on successful submission', async () => {
      const { h } = createMockResponse()
      await postBusinessNameChange.options.handler(request, h)

      expect(setSessionData).toHaveBeenCalledWith(request.yar, 'businessDetails', 'changeBusinessName', request.payload.businessName)
      expect(h.redirect).toHaveBeenCalledWith('/business-name-check')
    })

    describe('validation failAction', () => {
      test('should handle specific validation error', async () => {
        const request = createMockRequest({ businessName: '' })
        const { h } = createMockResponse()

        const err = {
          details: [{ path: ['businessName'], message: 'Enter business name' }]
        }

        await postBusinessNameChange.options.validate.failAction(request, h, err)

        expect(h.view).toHaveBeenCalledWith('business/business-name-change.njk', {
          errors: {
            businessName: { text: 'Enter business name' }
          },
          ...pageData
        })

        expect(h.code).toHaveBeenCalledWith(400)
        expect(h.takeover).toHaveBeenCalled()
      })

      test('should handle error with undefined details', async () => {
        const request = createMockRequest({ businessName: '' })
        const { h } = createMockResponse()

        await postBusinessNameChange.options.validate.failAction(request, h, {})

        expect(h.view).toHaveBeenCalledWith('business/business-name-change.njk', {
          errors: {},
          ...pageData
        })

        expect(h.code).toHaveBeenCalledWith(400)
        expect(h.takeover).toHaveBeenCalled()
      })
    })
  })

  test('should export both routes', () => {
    expect(businessNameChangeRoutes).toEqual([
      getBusinessNameChange,
      postBusinessNameChange
    ])
  })
})

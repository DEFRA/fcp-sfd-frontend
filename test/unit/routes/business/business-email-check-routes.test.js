import { describe, test, expect, vi, beforeEach } from 'vitest'
import { businessEmailCheckRoutes } from '../../../../src/routes/business/business-email-check-routes.js'
import { fetchBusinessEmailChangeService } from '../../../../src/services/business/fetch-business-email-change-service.js'
import { updateBusinessEmailChangeService } from '../../../../src/services/business/update-business-email-change-service.js'
import { businessEmailChangePresenter } from '../../../../src/presenters/business/business-email-change-presenter.js'

const [getBusinessEmailCheck, postBusinessEmailCheck] = businessEmailCheckRoutes

const businessEmail = 'name@example.com'

const createMockResponse = () => {
  const stateMock = vi.fn().mockReturnThis()
  const unstateMock = vi.fn().mockReturnThis()
  const view = vi.fn().mockReturnThis()
  const redirect = vi.fn().mockReturnValue({ state: stateMock, unstate: unstateMock })

  return {
    h: { view, redirect },
    stateMock,
    unstateMock,
    view,
    redirect
  }
}

vi.mock('../../../../src/services/business/fetch-business-email-change-service.js', () => ({
  fetchBusinessEmailChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-email-change-service.js', () => ({
  updateBusinessEmailChangeService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-email-change-presenter.js', () => ({
  businessEmailChangePresenter: vi.fn()
}))

describe('check business email', () => {
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

  describe('GET /business-email-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessEmailCheck.method).toBe('GET')
      expect(getBusinessEmailCheck.path).toBe('/business-email-check')
    })

    test('should render business/business-email-check.njk view with page data', async () => {
      await getBusinessEmailCheck.handler(request, h)
      expect(fetchBusinessEmailChangeService).toHaveBeenCalled(request)
      expect(h.view).toHaveBeenCalledWith('business/business-email-check.njk', pageData)
    })
  })

  describe('POST /business-email-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessEmailCheck.method).toBe('POST')
      expect(postBusinessEmailCheck.path).toBe('/business-email-check')
    })

    test('should redirect to business-details on successful submission', async () => {
      const { h } = createMockResponse()
      await postBusinessEmailCheck.handler(request, h)

      expect(updateBusinessEmailChangeService).toHaveBeenCalledWith({})
      expect(h.redirect).toHaveBeenCalledWith('/business-details')
    })
  })

  test('should export both routes', () => {
    expect(businessEmailCheckRoutes).toEqual([
      getBusinessEmailCheck,
      postBusinessEmailCheck
    ])
  })
})

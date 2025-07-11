import { describe, beforeEach, test, expect, vi } from 'vitest'
import { businessNameCheckRoutes } from '../../../../src/routes/business/business-name-check-routes.js'
import { fetchBusinessNameChangeService } from '../../../../src/services/business/fetch-business-name-change-service.js'
import { updateBusinessNameChangeService } from '../../../../src/services/business/update-business-name-change-service.js'
import { businessNameCheckPresenter } from '../../../../src/presenters/business/business-name-check-presenter.js'

const [getBusinessNameCheck, postBusinessNameCheck] = businessNameCheckRoutes

const businessName = 'Test Business'

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

vi.mock('../../../../src/services/business/fetch-business-name-change-service.js', () => ({
  fetchBusinessNameChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-name-change-service.js', () => ({
  updateBusinessNameChangeService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-name-check-presenter.js', () => ({
  businessNameCheckPresenter: vi.fn()
}))

describe('check business name', () => {
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
    businessNameCheckPresenter.mockReturnValue(pageData)
  })

  describe('GET /business-name-check', () => {
    test('should have the correct method and path', () => {
      expect(getBusinessNameCheck.method).toBe('GET')
      expect(getBusinessNameCheck.path).toBe('/business-name-check')
    })

    test('should render business/business-name-check.njk view with page data', async () => {
      await getBusinessNameCheck.handler(request, h)
      expect(fetchBusinessNameChangeService).toHaveBeenCalled(request.yar)
      expect(h.view).toHaveBeenCalledWith('business/business-name-check.njk', pageData)
    })
  })

  describe('POST /business-name-check', () => {
    test('should have the correct method and path', () => {
      expect(postBusinessNameCheck.method).toBe('POST')
      expect(postBusinessNameCheck.path).toBe('/business-name-check')
    })

    test('should redirect to business-details on successful submission', async () => {
      const { h } = createMockResponse()
      await postBusinessNameCheck.handler(request, h)

      expect(updateBusinessNameChangeService).toHaveBeenCalledWith({})
      expect(h.redirect).toHaveBeenCalledWith('/business-details')
    })
  })

  test('should export both routes', () => {
    expect(businessNameCheckRoutes).toEqual([
      getBusinessNameCheck,
      postBusinessNameCheck
    ])
  })
})

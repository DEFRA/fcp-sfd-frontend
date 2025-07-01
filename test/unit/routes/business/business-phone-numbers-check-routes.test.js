import { describe, test, expect, vi, beforeEach } from 'vitest'
import { fetchBusinessPhoneNumbersChangeService } from
  '../../../../src/services/business/fetch-business-phone-numbers-change-service.js'
import { updateBusinessPhoneNumbersChangeService } from
  '../../../../src/services/business/update-business-phone-numbers-change-service.js'
import { businessPhoneNumbersCheckPresenter } from
  '../../../../src/presenters/business/business-phone-numbers-check-presenter.js'
import { businessPhoneNumbersCheckRoutes } from '../../../../src/routes/business/business-phone-numbers-check-routes.js'

const [getBusinessPhoneNumbersCheck, postBusinessPhoneNumbersCheck] = businessPhoneNumbersCheckRoutes

const businessTelephone = '0123456789'
const businessMobile = '9876543210'

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

vi.mock('../../../../src/services/business/fetch-business-phone-numbers-change-service.js', () => ({
  fetchBusinessPhoneNumbersChangeService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-phone-numbers-change-service.js', () => ({
  updateBusinessPhoneNumbersChangeService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-phone-numbers-check-presenter.js', () => ({
  businessPhoneNumbersCheckPresenter: vi.fn()
}))

describe('check business phone numbers', () => {
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
    businessPhoneNumbersCheckPresenter.mockReturnValue(pageData)
  })

  describe('GET /business-phone-numbers-check', () => {
    test('has correct method and path', () => {
      expect(getBusinessPhoneNumbersCheck.method).toBe('GET')
      expect(getBusinessPhoneNumbersCheck.path).toBe('/business-phone-numbers-check')
    })

    test('should renders business/business-phone-numbers-check.njk view with page data', async () => {
      await getBusinessPhoneNumbersCheck.handler(request, h)
      expect(fetchBusinessPhoneNumbersChangeService).toHaveBeenCalled(request.yar)
      expect(h.view).toHaveBeenCalledWith('business/business-phone-numbers-check.njk', pageData)
    })
  })

  describe('POST /business-phone-numbers-check', () => {
    test('has correct method and path', () => {
      expect(postBusinessPhoneNumbersCheck.method).toBe('POST')
      expect(postBusinessPhoneNumbersCheck.path).toBe('/business-phone-numbers-check')
    })

    test('should redirect to business-details on successful submission', async () => {
      const { h } = createMockResponse()
      await postBusinessPhoneNumbersCheck.handler(request, h)

      expect(updateBusinessPhoneNumbersChangeService).toHaveBeenCalledWith({})
      expect(h.redirect).toHaveBeenCalledWith('/business-details')
    })
  })

  test('exports all routes', () => {
    expect(businessPhoneNumbersCheckRoutes).toEqual([
      getBusinessPhoneNumbersCheck,
      postBusinessPhoneNumbersCheck
    ])
  })
})

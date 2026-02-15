// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setBusinessFixSessionDataService } from '../../../../src/services/business/set-business-fix-session-data-service.js'
import { validateFixDetailsService } from '../../../../src/services/validate-fix-details-service.js'
import { formatValidationErrors } from '../../../../src/utils/format-validation-errors.js'
import { fetchBusinessFixService } from '../../../../src/services/business/fetch-business-fix-service.js'
import { businessFixListPresenter } from '../../../../src/presenters/business/business-fix-list-presenter.js'

// Thing under test
import { businessFixListRoutes } from '../../../../src/routes/business/business-fix-list-routes.js'
const [getBusinessFixList, postBusinessFixList] = businessFixListRoutes

// Mocks
vi.mock('../../../../src/services/business/set-business-fix-session-data-service.js', () => ({
  setBusinessFixSessionDataService: vi.fn()
}))

vi.mock('../../../../src/services/validate-fix-details-service.js', () => ({
  validateFixDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/format-validation-errors.js', () => ({
  formatValidationErrors: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-fix-service.js', () => ({
  fetchBusinessFixService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-fix-list-presenter.js', () => ({
  businessFixListPresenter: vi.fn()
}))

describe('business fix list routes', () => {
  let request
  let h
  let sessionData

  const credentials = {
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    sessionData = {
      orderedSectionsToFix: ['name', 'email']
    }

    request = {
      yar: {
        get: vi.fn(() => sessionData)
      },
      auth: { credentials },
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
  })

  describe('GET /business-fix-list', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessFixService.mockResolvedValue({ some: 'data' })
        businessFixListPresenter.mockReturnValue({ page: 'data' })
      })

      test('should have the correct method and path configured', () => {
        expect(getBusinessFixList.method).toBe('GET')
        expect(getBusinessFixList.path).toBe('/business-fix-list')
      })

      test('it fetches business fix data', async () => {
        await getBusinessFixList.handler(request, h)

        expect(fetchBusinessFixService).toHaveBeenCalledWith(credentials, sessionData)
      })

      test('should render business-fix-list view with page data', async () => {
        await getBusinessFixList.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-fix-list.njk', { page: 'data' })
      })
    })
  })

  describe('POST /business-fix-list', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = {
          businessName: 'New Business Name',
          businessEmail: 'john@example.com'
        }

        validateFixDetailsService.mockReturnValue({})
      })

      test('should have the correct method and path configured', () => {
        expect(postBusinessFixList.method).toBe('POST')
        expect(postBusinessFixList.path).toBe('/business-fix-list')
      })

      describe('when validation passes', () => {
        test('it stores the session data and redirects', async () => {
          await postBusinessFixList.handler(request, h)

          expect(setBusinessFixSessionDataService).toHaveBeenCalledWith(request.yar, sessionData, request.payload)
          expect(h.redirect).toHaveBeenCalledWith('/business-fix-check')
        })
      })

      describe('and the validation fails', () => {
        let validationError
        let errors

        beforeEach(() => {
          validationError = {
            details: [
              {
                message: 'Enter your business name',
                path: ['businessName']
              }
            ]
          }

          errors = [
            { field: 'businessName', message: 'Enter your business name' }
          ]

          validateFixDetailsService.mockReturnValue({ error: validationError })
          formatValidationErrors.mockReturnValue(errors)
          fetchBusinessFixService.mockResolvedValue({ some: 'data' })
          businessFixListPresenter.mockReturnValue({ page: 'data', errors })
        })

        test('it formats validation errors', async () => {
          await postBusinessFixList.handler(request, h)

          expect(formatValidationErrors).toHaveBeenCalledWith(validationError.details)
        })

        test('it fetches business fix data', async () => {
          await postBusinessFixList.handler(request, h)

          expect(fetchBusinessFixService).toHaveBeenCalledWith(credentials, sessionData)
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessFixList.handler(request, h)

          expect(h.view).toHaveBeenCalledWith('business/business-fix-list.njk', { page: 'data', errors })
        })
      })
    })
  })
})

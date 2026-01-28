// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setPersonalFixSessionDataService } from '../../../../src/services/personal/set-personal-fix-session-data-service.js'
import { validatePersonalFixService } from '../../../../src/services/personal/validate-personal-fix-service.js'
import { formatValidationErrors } from '../../../../src/utils/format-validation-errors.js'
import { fetchPersonalFixService } from '../../../../src/services/personal/fetch-personal-fix-service.js'
import { personalFixListPresenter } from '../../../../src/presenters/personal/personal-fix-list-presenter.js'

// Thing under test
import { personalFixListRoutes } from '../../../../src/routes/personal/personal-fix-list-routes.js'
const [getPersonalFixList, postPersonalFixList] = personalFixListRoutes

// Mocks
vi.mock('../../../../src/services/personal/set-personal-fix-session-data-service.js', () => ({
  setPersonalFixSessionDataService: vi.fn()
}))

vi.mock('../../../../src/services/personal/validate-personal-fix-service.js', () => ({
  validatePersonalFixService: vi.fn()
}))

vi.mock('../../../../src/utils/format-validation-errors.js', () => ({
  formatValidationErrors: vi.fn()
}))

vi.mock('../../../../src/services/personal/fetch-personal-fix-service.js', () => ({
  fetchPersonalFixService: vi.fn()
}))

vi.mock('../../../../src/presenters/personal/personal-fix-list-presenter.js', () => ({
  personalFixListPresenter: vi.fn()
}))

describe('personal fix list routes', () => {
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

  describe('GET /personal-fix-list', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchPersonalFixService.mockResolvedValue({ some: 'data' })
        personalFixListPresenter.mockReturnValue({ page: 'data' })
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalFixList.method).toBe('GET')
        expect(getPersonalFixList.path).toBe('/personal-fix-list')
      })

      test('it fetches personal fix data', async () => {
        await getPersonalFixList.handler(request, h)

        expect(fetchPersonalFixService).toHaveBeenCalledWith(credentials, sessionData)
      })

      test('should render personal-fix-list view with page data', async () => {
        await getPersonalFixList.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-fix-list.njk', { page: 'data' })
      })
    })
  })

  describe('POST /personal-fix-list', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = {
          first: 'John',
          personalEmail: 'john@example.com'
        }

        validatePersonalFixService.mockReturnValue({})
      })

      test('should have the correct method and path configured', () => {
        expect(postPersonalFixList.method).toBe('POST')
        expect(postPersonalFixList.path).toBe('/personal-fix-list')
      })

      describe('when validation passes', () => {
        test('it stores the session data and redirects', async () => {
          await postPersonalFixList.handler(request, h)

          expect(setPersonalFixSessionDataService).toHaveBeenCalledWith(request.yar, sessionData, request.payload)
          expect(h.redirect).toHaveBeenCalledWith('/personal-fix-check')
        })
      })

      describe('and the validation fails', () => {
        let validationError
        let errors

        beforeEach(() => {
          validationError = {
            details: [
              {
                message: 'Enter your first name',
                path: ['first']
              }
            ]
          }

          errors = [
            { field: 'first', message: 'Enter your first name' }
          ]

          validatePersonalFixService.mockReturnValue({ error: validationError })
          formatValidationErrors.mockReturnValue(errors)
          fetchPersonalFixService.mockResolvedValue({ some: 'data' })
          personalFixListPresenter.mockReturnValue({ page: 'data', errors })
        })

        test('it formats validation errors', async () => {
          await postPersonalFixList.handler(request, h)

          expect(formatValidationErrors).toHaveBeenCalledWith(validationError.details)
        })

        test('it fetches personal fix data', async () => {
          await postPersonalFixList.handler(request, h)

          expect(fetchPersonalFixService).toHaveBeenCalledWith(credentials, sessionData)
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postPersonalFixList.handler(request, h)

          expect(h.view).toHaveBeenCalledWith('personal/personal-fix-list.njk', { page: 'data', errors })
        })
      })
    })
  })
})

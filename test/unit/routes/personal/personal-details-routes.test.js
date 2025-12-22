// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Mocks
import { fetchPersonalDetailsService } from '../../../../src/services/personal/fetch-personal-details-service.js'
import { personalDetailsPresenter } from '../../../../src/presenters/personal/personal-details-presenter.js'
import { validatePersonalDetailsService } from '../../../../src/services/personal/validate-personal-details-service.js'

// Thing under test
import { personalDetailsRoutes } from '../../../../src/routes/personal/personal-details-routes.js'
const [getPersonalDetails] = personalDetailsRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-details-service.js', () => ({
  fetchPersonalDetailsService: vi.fn()
}))

vi.mock('../../../../src/services/personal/validate-personal-details-service.js', () => ({
  validatePersonalDetailsService: vi.fn()
}))

vi.mock('../../../../src/presenters/personal/personal-details-presenter.js', () => ({
  personalDetailsPresenter: vi.fn()
}))

describe('personal details', () => {
  let h
  let request
  let pageData
  let mockPersonalDetails

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /personal-details', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        request = {
          yar: { clear: vi.fn() },
          auth: {
            credentials: {
              sessionId: 'test-session-id',
              sbi: '123456789',
              crn: '987654321',
              email: 'test@example.com'
            }
          }
        }

        mockPersonalDetails = getMockData()
        pageData = getPageData()
        fetchPersonalDetailsService.mockResolvedValue(getMockData())
        validatePersonalDetailsService.mockReturnValue(true)
        personalDetailsPresenter.mockReturnValue(pageData)
      })

      test('it has the correct path configured', () => {
        expect(getPersonalDetails.path).toBe('/personal-details')
      })

      test('clears personal details data from the session', async () => {
        await getPersonalDetails.handler(request, h)

        expect(request.yar.clear).toHaveBeenCalledWith('personalDetails')
        expect(request.yar.clear).toHaveBeenCalledWith(request.auth.credentials.sessionId)
      })

      test('it calls the fetch personal details service and renders view', async () => {
        await getPersonalDetails.handler(request, h)

        expect(fetchPersonalDetailsService).toHaveBeenCalledWith(request.auth.credentials)
        expect(validatePersonalDetailsService).toHaveBeenCalledWith(
          mockPersonalDetails,
          request.yar,
          request.auth.credentials.sessionId
        )
        expect(personalDetailsPresenter).toHaveBeenCalledWith(getMockData(), request.yar, true)
        expect(h.view).toHaveBeenCalledWith('personal/personal-details.njk', pageData)
      })
    })
  })
})

const getMockData = () => ({
  fullName: 'Alfred Waldron',
  crn: '123456789',
  address: {
    buildingNumberRange: '76',
    street: 'Robinswood Road',
    city: 'Maidstone',
    county: 'Kent',
    postcode: 'ME16 0XH',
    country: 'United Kingdom'
  },
  dateOfBirth: '1980-01-01',
  contact: {
    landline: '01234567890',
    mobile: null,
    email: 'test@email.com'
  }
})

const getPageData = () => ({
  pageTitle: 'View and update your personal details',
  metaDescription: 'View and update your personal details.',
  userName: 'Alfred Waldron',
  address: [
    '76 Robinswood Road',
    'Maidstone',
    'Kent',
    'ME16 0XH',
    'United Kingdom'
  ],
  crn: '123456789',
  fullName: 'Alfred Waldron',
  dateOfBirth: '1980-01-01',
  personalTelephone: '01234567890',
  personalMobile: 'Not added',
  personalEmail: 'test@email.com'
})

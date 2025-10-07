// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Mocks
import { fetchPersonalDetailsService } from '../../../../src/services/personal/fetch-personal-details-service.js'
import { personalDetailsPresenter } from '../../../../src/presenters/personal/personal-details-presenter.js'

// Thing under test
import { personalDetailsRoutes } from '../../../../src/routes/personal/personal-details-routes.js'
const [getPersonalDetails] = personalDetailsRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-details-service.js', () => ({
  fetchPersonalDetailsService: vi.fn()
}))

vi.mock('../../../../src/presenters/personal/personal-details-presenter.js', () => ({
  personalDetailsPresenter: vi.fn()
}))

describe('personal details', () => {
  let h
  let request
  let pageData

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
              sbi: '123456789',
              crn: '987654321',
              email: 'test@example.com'
            }
          }
        }

        pageData = getPageData()
        fetchPersonalDetailsService.mockResolvedValue(getMockData())
        personalDetailsPresenter.mockReturnValue(pageData)
      })

      test('it clears the personalDetails key from session', async () => {
        await getPersonalDetails.handler(request, h)

        expect(request.yar.clear).toHaveBeenCalledWith('personalDetails')
      })

      test('it calls the fetch personal details service and renders view', async () => {
        await getPersonalDetails.handler(request, h)

        expect(fetchPersonalDetailsService).toHaveBeenCalledWith(request.auth.credentials)
        expect(personalDetailsPresenter).toHaveBeenCalledWith(getMockData(), request.yar)
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
  address: [
    '76 Robinswood Road',
    'Maidstone',
    'Kent',
    'ME16 0XH',
    'United Kingdom'
  ],
  crn: '123456789',
  userName: 'Alfred Waldron',
  dateOfBirth: '1980-01-01',
  personalTelephone: '01234567890',
  personalMobile: 'Not added',
  personalEmail: 'test@email.com'
})

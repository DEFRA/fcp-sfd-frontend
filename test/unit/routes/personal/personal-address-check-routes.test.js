// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'
import { updatePersonalAddressChangeService } from '../../../../src/services/personal/update-personal-address-change-service.js'

// Thing under test
import { personalAddressCheckRoutes } from '../../../../src/routes/personal/personal-address-check-routes.js'
const [getPersonalAddressCheck, postPersonalAddressCheck] = personalAddressCheckRoutes

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service.js', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/services/personal/update-personal-address-change-service.js', () => ({
  updatePersonalAddressChangeService: vi.fn()
}))

describe('personal address check', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        crn: '987654321',
        email: 'test@example.com'
      }
    }
  }

  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /account-address-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchPersonalChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method and path configured', () => {
        expect(getPersonalAddressCheck.method).toBe('GET')
        expect(getPersonalAddressCheck.path).toBe('/account-address-check')
      })

      test('it fetches the data from the session', async () => {
        await getPersonalAddressCheck.handler(request, h)

        expect(fetchPersonalChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changePersonalAddress')
      })

      test('should render personal-address-check view with page data', async () => {
        await getPersonalAddressCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('personal/personal-address-check', getPageData())
      })
    })
  })

  describe('POST /account-address-check', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      test('should have the correct method and path configured', () => {
        expect(postPersonalAddressCheck.method).toBe('POST')
        expect(postPersonalAddressCheck.path).toBe('/account-address-check')
      })

      test('it redirects to the /personal-details page', async () => {
        await postPersonalAddressCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/personal-details')
      })

      test('calls updatePersonalAddressChangeService with yar and credentials', async () => {
        await postPersonalAddressCheck.handler(request, h)

        expect(updatePersonalAddressChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      userName: 'Alfred Waldron',
      fullName: {
        first: 'Alfred',
        last: 'Waldron'
      }
    },
    address: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/account-address-enter' },
    changeLink: '/account-address-enter',
    pageTitle: 'Check your personal address is correct before submitting',
    metaDescription: 'Check the address for your personal account is correct.',
    address: [
      '10 Skirbeck Way',
      'Maidstone',
      'SK22 1DL',
      'United Kingdom'
    ],
    userName: 'Alfred Waldron'
  }
}

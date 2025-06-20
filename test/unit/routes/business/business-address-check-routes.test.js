// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Thing we need to mock
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Thing under test
import { businessAddressCheckRoutes } from '../../../../src/routes/business/business-address-check-routes.js'
const [getBusinessAddressCheck, postBusinessAddressCheck] = businessAddressCheckRoutes

// Mocks
vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('business address check', () => {
  const request = {}
  let h

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-address-check', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        // Mock the yar object with a set method
        request.yar = {
          get: vi.fn().mockReturnValue(getMockData())
        }
      })

      test('it returns the page successfully', async () => {
        await getBusinessAddressCheck.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-address-check', getPageData())
      })
    })
  })

  describe('POST /business-address-check', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        h = {
          redirect: vi.fn(() => h)
        }
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessAddressCheck.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('it sets the notification message title to "Success", and the text to "You have updated your business address"', async () => {
        await postBusinessAddressCheck.handler(request, h)

        expect(flashNotification).toHaveBeenCalledWith(request.yar, 'Success', 'You have updated your business address')
      })
    })
  })
})
const getMockData = () => {
  return {
    businessName: 'Agile Farm Ltd',
    businessAddress: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}
const getPageData = () => {
  return {
    backLink: { href: '/business-address-enter' },
    cancelLink: '/business-details',
    changeLink: '/business-address-enter',
    pageTitle: 'Check your business address is correct before submitting',
    metaDescription: 'Check the address for your business is correct.',
    address: [
      '10 Skirbeck Way',
      'Maidstone',
      'SK22 1DL',
      'United Kingdom'
    ],
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

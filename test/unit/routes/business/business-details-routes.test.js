// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details-presenter.js'

// Thing under test
import { businessDetailsRoutes } from '../../../../src/routes/business/business-details-routes.js'
const [getBusinessDetails] = businessDetailsRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-details-presenter.js', () => ({
  businessDetailsPresenter: vi.fn()
}))

describe('business details', () => {
  const request = {}
  let h
  let mockData
  let pageData

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /business-details', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        request.yar = {
          set: vi.fn()
        }

        mockData = getMockData()
        pageData = getPageData()

        fetchBusinessDetailsService.mockResolvedValue(mockData)
        businessDetailsPresenter.mockReturnValue(pageData)
      })

      test('it calls the fetch business details service', async () => {
        await getBusinessDetails.handler(request, h)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(request)
        expect(h.view).toHaveBeenCalledWith('business/business-details.njk', pageData)
      })

      test('it sets the fetched data on the yar state', async () => {
        await getBusinessDetails.handler(request, h)

        expect(request.yar.set).toHaveBeenCalledWith('businessDetailsData', mockData)
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
    businessTelephone: '01234567890',
    businessMobile: '01234567890',
    businessEmail: 'a.farmer@farms.com',
    sbi: '123456789',
    vatNumber: '',
    tradeNumber: '987654',
    vendorRegistrationNumber: '699368',
    countyParishHoldingNumber: '12/563/0998',
    businessLegalStatus: 'Sole proprietorship',
    businessType: 'Central or local government',
    userName: 'Alfred Waldron'
  }
}

const getPageData = () => {
  return {
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    notification: null,
    businessName: 'Agile Farm Ltd',
    businessAddress: {
      address1: '10 Skirbeck Way',
      address2: '',
      city: 'Maidstone',
      county: '',
      postcode: 'SK22 1DL',
      country: 'United Kingdom'
    },
    businessTelephone: '01234567890',
    businessMobile: '01234567890',
    businessEmail: 'a.farmer@farms.com',
    sbi: '123456789',
    vatNumber: null,
    tradeNumber: '987654',
    vendorRegistrationNumber: '699368',
    countyParishHoldingNumber: '12/563/0998',
    businessLegalStatus: 'Sole proprietorship',
    businessType: 'Central or local government',
    userName: 'Alfred Waldron'
  }
}

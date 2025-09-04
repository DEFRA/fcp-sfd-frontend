// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { updateBusinessVatRemoveService } from '../../../../src/services/business/update-business-vat-remove-service.js'
import { businessVatRemovePresenter } from '../../../../src/presenters/business/business-vat-remove-presenter.js'

// Thing under test
import { businessVatRemoveRoutes } from '../../../../src/routes/business/business-vat-remove-routes.js'
const [getBusinessVatRemove, postBusinessVatRemove] = businessVatRemoveRoutes

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service.js', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/services/business/update-business-vat-remove-service.js', () => ({
  updateBusinessVatRemoveService: vi.fn()
}))

vi.mock('../../../../src/presenters/business/business-vat-remove-presenter.js', () => ({
  businessVatRemovePresenter: vi.fn()
}))

describe('business VAT remove', () => {
  const request = {
    yar: {},
    auth: {
      credentials: {
        sbi: '123456789',
        crn: '987654321',
        email: 'test@example.com'
      }
    }
  }
  let h

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock yar.set for session
    request.yar = {
      set: vi.fn(),
      get: vi.fn().mockReturnValue(getMockData())
    }
  })

  describe('GET /business-VAT-registration-remove"', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({})
        }

        fetchBusinessDetailsService.mockReturnValue(getMockData())
        businessVatRemovePresenter.mockReturnValue(getPageData())
      })

      test('should have the correct method and path', () => {
        expect(getBusinessVatRemove.method).toBe('GET')
        expect(getBusinessVatRemove.path).toBe('/business-VAT-registration-remove')
      })

      test('it fetches the data from the session', async () => {
        await getBusinessVatRemove.handler(request, h)

        expect(fetchBusinessDetailsService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })

      test('should render business-VAT-registration-remove view with page data', async () => {
        await getBusinessVatRemove.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-VAT-registration-remove', getPageData())
      })
    })
  })

  describe('POST /business-VAT-registration-remove', () => {
    beforeEach(() => {
      h = {
        redirect: vi.fn(() => h)
      }
    })

    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { confirmRemove: 'yes' }
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessVatRemove.options.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('calls the update service with confirmRemove parameter', async () => {
        await postBusinessVatRemove.options.handler(request, h)

        expect(updateBusinessVatRemoveService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
      })
    })

    describe('when user selects "no"', () => {
      beforeEach(() => {
        request.payload = { confirmRemove: 'no' }
      })

      test('it redirects to the /business-details page', async () => {
        await postBusinessVatRemove.options.handler(request, h)

        expect(h.redirect).toHaveBeenCalledWith('/business-details')
      })

      test('does not call the update service', async () => {
        await postBusinessVatRemove.options.handler(request, h)

        expect(updateBusinessVatRemoveService).not.toHaveBeenCalled()
      })
    })

    describe('when validation fails', () => {
      let err

      beforeEach(() => {
        h = {
          view: vi.fn().mockReturnValue({
            code: vi.fn().mockReturnThis(),
            takeover: vi.fn().mockReturnThis()
          })
        }

        err = {
          details: [
            {
              message: 'Select yes if you want to remove your VAT registration number',
              path: ['confirmRemove'],
              type: 'any.required'
            }
          ]
        }
      })

      test('should have validation options', () => {
        expect(postBusinessVatRemove.options).toBeDefined()
        expect(postBusinessVatRemove.options.validate).toBeDefined()
        expect(postBusinessVatRemove.options.validate.payload).toBeDefined()
      })

      test('it returns the page successfully with the error summary banner', async () => {
        await postBusinessVatRemove.options.validate.failAction(request, h, err)

        const pageData = getPageDataError()
        pageData.errors = { confirmRemove: { text: 'Select yes if you want to remove your VAT registration number' } }

        expect(h.view).toHaveBeenCalledWith('business/business-vat-remove', pageData)
      })

      test('it should handle undefined errors', async () => {
        await postBusinessVatRemove.options.validate.failAction(request, h, [])

        const pageData = getPageDataError()
        pageData.errors = {}

        expect(h.view).toHaveBeenCalledWith('business/business-vat-remove', pageData)
      })
    })
  })
})

const getMockData = () => {
  return {
    info: {
      businessName: 'Agile Farm Ltd',
      sbi: '123456789',
      vat: 'GB123456789'
    },
    customer: {
      fullName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Are you sure you want to remove your VAT registration number?',
    metaDescription: 'Are you sure you want to remove your VAT registration number?',
    vatNumber: 'GB123456789',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Are you sure you want to remove your VAT registration number?',
    metaDescription: 'Are you sure you want to remove your VAT registration number?',
    vatNumber: 'GB123456789',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron'
  }
}

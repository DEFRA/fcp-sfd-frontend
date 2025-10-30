// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { updateBusinessVatRemoveService } from '../../../../src/services/business/update-business-vat-remove-service.js'

// Test helpers
import { FULL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

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

describe('business VAT remove', () => {
  let request
  let h

  const credentials = {
    sbi: '123456789',
    crn: '987654321',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    request = {
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

  describe('GET /business-vat-registration-remove', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessVatRemove.method).toBe('GET')
        expect(getBusinessVatRemove.path).toBe('/business-vat-registration-remove')
        expect(getBusinessVatRemove.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('it calls fetchBusinessDetailService', async () => {
        await getBusinessVatRemove.handler(request, h)

        expect(fetchBusinessDetailsService).toHaveBeenCalledWith(request.auth.credentials)
      })

      test('should render business-vat-registration-remove view with page data', async () => {
        await getBusinessVatRemove.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-vat-registration-remove', getPageData())
      })
    })
  })

  describe('POST /business-vat-registration-remove', () => {
    describe('when a request succeeds', () => {
      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessVatRemove.method).toBe('POST')
        expect(postBusinessVatRemove.path).toBe('/business-vat-registration-remove')
        expect(postBusinessVatRemove.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      describe('and the payload confirmRemove property is "yes"', () => {
        beforeEach(() => {
          request.payload = { confirmRemove: 'yes' }
        })

        test('calls updateBusinessVatRemoveService with yar and credentials', async () => {
          await postBusinessVatRemove.options.handler(request, h)

          expect(updateBusinessVatRemoveService).toHaveBeenCalledWith(request.yar, request.auth.credentials)
        })

        test('it redirects to the /business-details page', async () => {
          await postBusinessVatRemove.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
        })
      })

      describe('and the payload confirmRemove property is "no"', () => {
        beforeEach(() => {
          request.payload = { confirmRemove: 'no' }
        })

        test('does not call the updateBusinessVatRemoveService', async () => {
          await postBusinessVatRemove.options.handler(request, h)

          expect(updateBusinessVatRemoveService).not.toHaveBeenCalled()
        })

        test('it redirects to the /business-details page', async () => {
          await postBusinessVatRemove.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-details')
        })
      })

      describe('when validation fails', () => {
        let err

        beforeEach(() => {
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

        test('it fetches the business details', async () => {
          await postBusinessVatRemove.options.validate.failAction(request, h, err)

          expect(fetchBusinessDetailsService).toHaveBeenCalledWith(request.auth.credentials)
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessVatRemove.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-vat-registration-remove', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessVatRemove.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-vat-registration-remove', pageData)
        })
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
    userName: 'Alfred Waldron',
    errors: {
      confirmRemove: {
        text: 'Select yes if you want to remove your VAT registration number'
      }
    }
  }
}

// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Things we need to mock
import { setSessionData } from '../../../../src/utils/session/set-session-data.js'
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Test helpers
import { FULL_PERMISSIONS } from '../../../../src/constants/scope/business-details.js'

// Thing under test
import { businessVatChangeRoutes } from '../../../../src/routes/business/business-vat-change-routes.js'
const [getBusinessVatChange, postBusinessVatChange] = businessVatChangeRoutes

// Mocks
vi.mock('../../../../src/utils/session/set-session-data.js', () => ({
  setSessionData: vi.fn()
}))

vi.mock('../../../../src/services/business/fetch-business-change-service.js', () => ({
  fetchBusinessChangeService: vi.fn()
}))

describe('business VAT change', () => {
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

  describe('GET /business-VAT-registration-number-change', () => {
    describe('when a request is valid', () => {
      beforeEach(() => {
        fetchBusinessChangeService.mockReturnValue(getMockData())
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(getBusinessVatChange.method).toBe('GET')
        expect(getBusinessVatChange.path).toBe('/business-vat-registration-number-change')
        expect(getBusinessVatChange.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      test('it calls fetchBusinessChangeService', async () => {
        await getBusinessVatChange.handler(request, h)

        expect(fetchBusinessChangeService).toHaveBeenCalledWith(request.yar, request.auth.credentials, 'changeBusinessVat')
      })

      test('should render business-vat-registration-number-change view with page data', async () => {
        await getBusinessVatChange.handler(request, h)

        expect(h.view).toHaveBeenCalledWith('business/business-vat-registration-number-change', getPageData())
      })
    })
  })

  describe('POST /business-vat-registration-number-change', () => {
    describe('when a request succeeds', () => {
      beforeEach(() => {
        request.payload = { vatNumber: 'GB123456789' }

        fetchBusinessChangeService.mockResolvedValue({ ...getMockData(), changeBusinessVat: request.payload })
      })

      test('should have the correct method, path and auth scope configured', () => {
        expect(postBusinessVatChange.method).toBe('POST')
        expect(postBusinessVatChange.path).toBe('/business-vat-registration-number-change')
        expect(postBusinessVatChange.options.auth.scope).toBe(FULL_PERMISSIONS)
      })

      describe('and the validation passes', () => {
        test('it redirects to the /business-vat-registration-number-check page', async () => {
          await postBusinessVatChange.options.handler(request, h)

          expect(h.redirect).toHaveBeenCalledWith('/business-vat-registration-number-check')
        })

        test('sets the payload on the yar state', async () => {
          await postBusinessVatChange.options.handler(request, h)

          expect(setSessionData).toHaveBeenCalledWith(
            request.yar,
            'businessDetailsUpdate',
            'changeBusinessVat',
            request.payload.vatNumber
          )
        })
      })

      describe('and the validation fails', () => {
        let err

        beforeEach(() => {
          err = {
            details: [
              {
                message: 'Enter a VAT registration number',
                path: ['vatNumber'],
                type: 'any.required'
              }
            ]
          }
        })

        test('it fetches the business details', async () => {
          await postBusinessVatChange.options.validate.failAction(request, h, err)

          expect(fetchBusinessChangeService).toHaveBeenCalledWith(
            request.yar,
            request.auth.credentials,
            'changeBusinessVat'
          )
        })

        test('it returns the page successfully with the error summary banner', async () => {
          await postBusinessVatChange.options.validate.failAction(request, h, err)

          expect(h.view).toHaveBeenCalledWith('business/business-vat-registration-number-change', getPageDataError())
        })

        test('it should handle undefined errors', async () => {
          await postBusinessVatChange.options.validate.failAction(request, h, [])

          const pageData = getPageDataError()
          pageData.errors = {}

          expect(h.view).toHaveBeenCalledWith('business/business-vat-registration-number-change', pageData)
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
      userName: 'Alfred Waldron'
    }
  }
}

const getPageData = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your VAT registration number?',
    metaDescription: 'Update the VAT registration number for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    vatNumber: 'GB123456789'
  }
}

const getPageDataError = () => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your VAT registration number?',
    metaDescription: 'Update the VAT registration number for your business.',
    businessName: 'Agile Farm Ltd',
    sbi: '123456789',
    userName: 'Alfred Waldron',
    vatNumber: 'GB123456789',
    errors: {
      vatNumber: {
        text: 'Enter a VAT registration number'
      }
    }
  }
}

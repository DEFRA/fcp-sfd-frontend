import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import {
  BUSINESS_NAME_MAX,
  ADDRESS_LINE_MAX,
  TOWN_CITY_MAX,
  COUNTY_MAX,
  POSTCODE_MAX,
  COUNTRY_MAX,
  PHONE_NUMBER_MIN,
  PHONE_NUMBER_MAX,
  EMAIL_MAX
} from '../../../../src/constants/validation-fields.js'

describe('business details', () => {
  const originalEnv = process.env.ALLOW_ERROR_VIEWS

  const SERVER_MODULE_PATH = '../../../../src/server.js'

  const resetAndCreateServer = async () => {
    vi.resetModules()

    const { createServer } = await import(SERVER_MODULE_PATH)

    const server = await createServer()
    await server.initialize()
    return server
  }

  const hookTimeout = 50000

  let server

  beforeEach(async () => {
    vi.clearAllMocks()
    server = await resetAndCreateServer()

    // Mock yar session manager
    server.ext('onPreHandler', (request, h) => {
      request.yar = {
        flash: vi.fn().mockReturnValue([])
      }
      return h.continue
    })
  }, hookTimeout)

  afterEach(async () => {
    await server.stop()
  }, hookTimeout)

  describe('with error views enabled', () => {
    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'true'
    })

    describe('GET routes', () => {
      test('health route responds correctly', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/health'
        })

        expect(response.statusCode).toBe(200)
      })

      test.each([
        ['home', '/'],
        ['cookies', '/cookies'],
        ['service unavailable', '/service-unavailable'],
        ['page not found', '/page-not-found'],
        ['service problem', '/service-problem'],
        ['business details', '/business-details'],
        ['change business name', '/business-name-change'],
        ['check business name', '/business-name-check'],
        ['enter business address', '/business-address-enter'],
        ['check business address', '/business-address-check'],
        ['change business phone numbers', '/business-phone-numbers-change'],
        ['check business phone numbers', '/business-phone-numbers-check'],
        ['change business email address', '/business-email-change'],
        ['check business email address', '/business-email-check'],
        ['change business legal status', '/business-legal-status-change'],
        ['change business type', '/business-type-change']
      ])('%s GET route responds correctly', async (_, url) => {
        const response = await server.inject({ method: 'GET', url })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
      })
    })

    describe('POST routes', () => {
      test.each([
        [
          'change business name',
          '/business-name-change',
          {
            businessName: 'Test Farms Ltd'
          }
        ],
        [
          'enter business address',
          '/business-address-enter',
          {
            address1: '10 Skirbeck Way',
            address2: '',
            addressCity: 'Maidstone',
            addressCounty: '',
            addressPostcode: 'SK22 1DL',
            addressCountry: 'United Kingdom'
          }
        ],
        [
          'change business phone numbers',
          '/business-phone-numbers-change',
          {
            businessTelephone: '01234567890',
            businessMobile: '09876543210'
          }
        ],
        [
          'change business email address',
          '/business-email-change',
          {
            businessEmail: 'name@example.com'
          }
        ]
      ])('%s POST route is registered', async (_, url, payload) => {
        const response = await server.inject({
          method: 'POST',
          url,
          payload
        })

        expect(response.statusCode).toBe(302)
      })
    })

    describe('schema validation: business name', () => {
      test.each([
        [
          'no business name provided',
          {
            businessName: ''
          },
          'Enter business name'
        ],
        [
          'business name is too long',
          {
            businessName: 'a'.repeat(BUSINESS_NAME_MAX + 1)
          },
          `Business name must be ${BUSINESS_NAME_MAX} characters or less`
        ]
      ])('%s returns 400 and expected error message', async (_, payload, errorMessage) => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(errorMessage)
      })
    })

    describe('schema validation: business address', () => {
      const businessAddress = {
        address1: '10 Skirbeck Way',
        address2: '',
        addressCity: 'Maidstone',
        addressCounty: '',
        addressPostcode: 'SK22 1DL',
        addressCountry: 'United Kingdom'
      }

      test.each([
        [
          'missing address line 1',
          {
            ...businessAddress,
            address1: ''
          },
          'Enter address line 1, typically the building and street'
        ],
        [
          'address line is too long',
          {
            ...businessAddress,
            address2: 'a'.repeat(ADDRESS_LINE_MAX + 1)
          },
          `Address line 2 must be ${ADDRESS_LINE_MAX} characters or less`
        ],
        [
          'missing town/city',
          {
            ...businessAddress,
            addressCity: ''
          },
          'Enter town or city'
        ],
        [
          'town/city is too long',
          {
            ...businessAddress,
            addressCity: 'a'.repeat(TOWN_CITY_MAX + 1)
          },
          `Town or city must be ${TOWN_CITY_MAX} characters or less`
        ],
        [
          'county is too long',
          {
            ...businessAddress,
            addressCounty: 'a'.repeat(COUNTY_MAX + 1)
          },
          `County must be ${COUNTY_MAX} characters or less`
        ],
        [
          'postcode is too long',
          {
            ...businessAddress,
            addressPostcode: 'a'.repeat(POSTCODE_MAX + 1)
          },
          `Postal code or zip code must be ${POSTCODE_MAX} characters or less`
        ],
        [
          'missing country',
          {
            ...businessAddress,
            addressCountry: ''
          },
          'Enter a country'
        ],
        [
          'country is too long',
          {
            ...businessAddress,
            addressCountry: 'a'.repeat(COUNTRY_MAX + 1)
          },
          `Country must be ${COUNTRY_MAX} characters or less`
        ]
      ])('%s returns 400 and expected error message', async (_, payload, errorMessage) => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-address-enter',
          payload
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(errorMessage)
      })
    })

    describe('schema validation: business phone numbers', () => {
      test.each([
        [
          'no business phone numbers are provided',
          {
            businessTelephone: '',
            businessMobile: ''
          },
          'Enter at least one phone number'
        ],
        [
          'business telephone number is too short',
          {
            businessTelephone: '123',
            businessMobile: ''
          },
          `Business telephone number must be ${PHONE_NUMBER_MIN} characters or more`
        ],
        [
          'business mobile number is too long',
          {
            businessTelephone: '',
            businessMobile: '1'.repeat(PHONE_NUMBER_MAX + 1)
          },
          `Business mobile phone number must be ${PHONE_NUMBER_MAX} characters or less`
        ]
      ])('%s returns 400 and expected error message', async (_, payload, errorMessage) => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-phone-numbers-change',
          payload
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(errorMessage)
      })
    })

    describe('schema validation: business email address', () => {
      test.each([
        [
          'no business email address provided',
          {
            businessEmail: ''
          },
          'Enter business email address'
        ],
        [
          'business email address is too long',
          {
            businessEmail: 'a'.repeat(EMAIL_MAX + 1)
          },
          `Business email address must be ${EMAIL_MAX} characters or less`
        ],
        [
          'business email address format is invalid',
          {
            businessEmail: 'not-an-email'
          },
          'Enter an email address, like name@example.com'
        ]
      ])('%s returns 400 and expected error message', async (_, payload, errorMessage) => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-email-change',
          payload
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(errorMessage)
      })
    })
  })

  describe('with error views disabled', () => {
    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'false'
    })

    afterAll(() => {
      if (originalEnv === undefined) {
        delete process.env.ALLOW_ERROR_VIEWS
      } else {
        process.env.ALLOW_ERROR_VIEWS = originalEnv
      }
    })

    test.each([
      ['home', '/'],
      ['service problem', '/contact-help']
    ])('%s route responds correctly', async (_, url) => {
      const response = await server.inject({ method: 'GET', url })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('text/html')
    })

    test.each([
      ['page not found', '/page-not-found'],
      ['service unavailable', '/service-unavailable'],
      ['service problem', '/service-problem']
    ])('%s route returns 404 when disabled', async (_, url) => {
      const response = await server.inject({ method: 'GET', url })

      expect(response.statusCode).toBe(404)
    })
  })
})

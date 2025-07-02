import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { BUSINESS_NAME_MAX } from '../../../../src/constants/validation-fields.js'

describe('business name change routes', () => {
  const originalEnv = process.env.ALLOW_ERROR_VIEWS

  const SERVER_MODULE_PATH = '../../../../src/server.js'

  const resetAndCreateServer = async () => {
    vi.resetModules()

    const { createServer } = await import(SERVER_MODULE_PATH)

    const server = await createServer()
    await server.initialize()
    return server
  }

  let server

  beforeEach(async () => {
    vi.clearAllMocks()
    server = await resetAndCreateServer()
  })

  afterEach(async () => {
    await server.stop()
  })

  describe('with error views enabled', () => {
    beforeAll(() => {
      process.env.ALLOW_ERROR_VIEWS = 'true'
    })

    describe('GET routes', () => {
      test('business name change route responds correctly', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/business-name-change'
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')
      })
    })

    describe('POST routes', () => {
      test('business name change POST route is registered', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: 'Test Farms Ltd'
          }
        })

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-name-check')
      })
    })

    describe('schema validation: business name', () => {
      test('no business name provided returns 400 and expected error message', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: ''
          }
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain('Enter business name')
      })

      test('business name is too long returns 400 and expected error message', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: 'This is a business name that is intentionally designed to exceed ' +
                'the maximum character limit defined in the schema validation rules, ' +
                'and therefore, when this string is submitted as part of the input, ' +
                'it should correctly trigger a validation error due to being too long ' +
                'for the specified constraint and field length.'
          }
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(`Business name must be ${BUSINESS_NAME_MAX} characters or less`)
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

    test('should still allow business name change functionality', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('What is your business name?')
    })
  })
})

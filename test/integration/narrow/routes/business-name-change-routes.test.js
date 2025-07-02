import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { dalData } from '../../../mockObjects/mock-business-details.js'
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

    describe('GET /business-name-change', () => {
      test('should fetch business details and display the change form with current data', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/business-name-change'
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toContain('text/html')

        // Verify the page contains the expected business data
        expect(response.payload).toContain('What is your business name?')
        expect(response.payload).toContain(dalData.businessName) // 'Agile Farm Ltd'
        expect(response.payload).toContain(dalData.sbi) // '123456789'
        expect(response.payload).toContain(dalData.userName) // 'Alfred Waldron'

        // Verify form structure
        expect(response.payload).toContain('name="businessName"')
        expect(response.payload).toContain('type="submit"')
        expect(response.payload).toContain('/business-details') // back link
      })
    })

    describe('POST /business-name-change', () => {
      test('should validate and store business name change, then redirect to check page', async () => {
        const newBusinessName = 'Updated Farm Name Ltd'

        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: newBusinessName
          }
        })

        // Verify redirect to check page
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/business-name-check')
      })

      test('should handle empty business name with validation error', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: ''
          }
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain('Enter business name')
        expect(response.payload).toContain('What is your business name?')

        // Verify the form still shows the original data
        expect(response.payload).toContain(dalData.businessName)
      })

      test('should handle business name that is too long', async () => {
        const longName = 'a'.repeat(BUSINESS_NAME_MAX + 1) // 301 characters

        const response = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: longName
          }
        })

        expect(response.statusCode).toBe(400)
        expect(response.payload).toContain(`Business name must be ${BUSINESS_NAME_MAX} characters or less`)
        expect(response.payload).toContain('What is your business name?')
      })
    })

    describe('Business name check page', () => {
      test('should show original business name when no changes made', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/business-name-check'
        })

        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain(dalData.businessName)
        expect(response.payload).toContain('Check your business name is correct before submitting')
      })
    })

    describe('Complete workflow test with session state', () => {
      test('should handle the complete change workflow: POST change -> redirect -> check page shows new name', async () => {
        const newName = 'Complete Workflow Test Farm'

        // Step 1: Submit the change and capture the session cookie
        const postResponse = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: newName
          }
        })

        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('/business-name-check')

        // Extract the session cookie from the response
        const sessionCookie = postResponse.headers['set-cookie']?.find(cookie =>
          cookie.startsWith('session=')
        )

        expect(sessionCookie).toBeDefined()

        // Step 2: Verify the check page shows the change using the same session
        const checkResponse = await server.inject({
          method: 'GET',
          url: '/business-name-check',
          headers: {
            cookie: sessionCookie
          }
        })

        expect(checkResponse.statusCode).toBe(200)
        expect(checkResponse.payload).toContain('Check your business name is correct before submitting')

        // This is the key assertion - the check page should show the new name
        expect(checkResponse.payload).toContain(newName)
      })

      test('should maintain session state for the complete user journey', async () => {
        const newName = 'Session State Test Farm'

        // Step 1: Submit the change
        const postResponse = await server.inject({
          method: 'POST',
          url: '/business-name-change',
          payload: {
            businessName: newName
          }
        })

        expect(postResponse.statusCode).toBe(302)
        const sessionCookie = postResponse.headers['set-cookie']?.find(cookie =>
          cookie.startsWith('session=')
        )

        // Step 2: Check the check page shows the new name
        const checkResponse = await server.inject({
          method: 'GET',
          url: '/business-name-check',
          headers: {
            cookie: sessionCookie
          }
        })

        expect(checkResponse.statusCode).toBe(200)
        expect(checkResponse.payload).toContain(newName)

        // Step 3: Simulate clicking the "Change" link from the check page
        // This is how a real user would navigate back to edit their business name
        const changeResponse = await server.inject({
          method: 'GET',
          url: '/business-name-change',
          headers: {
            cookie: sessionCookie
          }
        })

        expect(changeResponse.statusCode).toBe(200)
        // The form should show the changed name, ready for further editing
        expect(changeResponse.payload).toContain(newName)
        expect(changeResponse.payload).toContain(`value="${newName}"`)
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
      // The business name change route should still work even with error views disabled
      const response = await server.inject({
        method: 'GET',
        url: '/business-name-change'
      })

      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('What is your business name?')
    })
  })
})

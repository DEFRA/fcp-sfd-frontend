import { constants } from '@defra/fcp-sfd-frontend-engine'
import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import '../../../mocks/setup-server-mocks.js'

const { createServer } = await import('../../../../src/server.js')

const getPage = (url, scope) => server.inject({
  url,
  auth: {
    strategy: 'session',
    credentials: { sessionId: 'session-id', sbi: '876543210', crn: '9876543210', scope }
  }
})

let server

describe('business fix routes', () => {
  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  describe('when the user has view permission', () => {
    describe('and they request the business fix page', () => {
      test('it returns forbidden', async () => {
        const response = await getPage('/business-fix', ['BUSINESS_DETAILS:VIEW'])

        expect(response.statusCode).toBe(constants.statusCodes.FORBIDDEN)
      })
    })

    describe('and they request the business fix list page', () => {
      test('it returns forbidden', async () => {
        const response = await getPage('/business-fix-list', ['BUSINESS_DETAILS:VIEW'])

        expect(response.statusCode).toBe(constants.statusCodes.FORBIDDEN)
      })
    })

    describe('and they request the business fix check page', () => {
      test('it returns forbidden', async () => {
        const response = await getPage('/business-fix-check', ['BUSINESS_DETAILS:VIEW'])

        expect(response.statusCode).toBe(constants.statusCodes.FORBIDDEN)
      })
    })
  })

  describe('when the user has amend permission and no fix journey has started', () => {
    describe('and they request the business fix page', () => {
      test('it redirects to the business details page', async () => {
        const response = await getPage('/business-fix', ['BUSINESS_DETAILS:AMEND'])

        expect(response.statusCode).toBe(constants.statusCodes.FOUND)
        expect(response.headers.location).toBe('/business-details')
      })
    })

    describe('and they request the business fix list page', () => {
      test('it redirects to the business details page', async () => {
        const response = await getPage('/business-fix-list', ['BUSINESS_DETAILS:AMEND'])

        expect(response.statusCode).toBe(constants.statusCodes.FOUND)
        expect(response.headers.location).toBe('/business-details')
      })
    })

    describe('and they request the business fix check page', () => {
      test('it redirects to the business details page', async () => {
        const response = await getPage('/business-fix-check', ['BUSINESS_DETAILS:AMEND'])

        expect(response.statusCode).toBe(constants.statusCodes.FOUND)
        expect(response.headers.location).toBe('/business-details')
      })
    })
  })
})

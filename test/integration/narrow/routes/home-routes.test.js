import { constants } from '@defra/fcp-sfd-frontend-engine'
import { vi, beforeAll, afterAll, describe, test, expect } from 'vitest'
import * as cheerio from 'cheerio'
import '../../../mocks/setup-server-mocks.js'

const { createServer } = await import('../../../../src/server.js')

let server

describe('index route', () => {
  beforeAll(async () => {
    vi.clearAllMocks()

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  test('GET / returns index view', async () => {
    const response = await server.inject({
      url: '/'
    })
    expect(response.statusCode).toBe(constants.statusCodes.OK)
    expect(response.request.response.source.template).toBe('start')
  })

  test('GET / renders the full GOV.UK page title', async () => {
    const response = await server.inject({
      url: '/'
    })
    const $ = cheerio.load(response.result)

    expect($('title').text().trim()).toBe('Start using the Farm and Land Service - Farm and Land Service - GOV.UK')
  })
})

describe('home route', () => {
  beforeAll(async () => {
    vi.clearAllMocks()

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop()
    }
  })

  test('GET /home redirects to /auth/sign-in if not authenticated', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/home'
    })
    expect(response.statusCode).toBe(constants.statusCodes.FOUND)
    expect(response.headers.location).toBe('/auth/sign-in?redirect=/home')
  })
})

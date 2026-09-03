import { constants } from '@defra/fcp-sfd-frontend-engine'
import { vi, beforeAll, afterAll, describe, test, expect } from 'vitest'
import '../../../mocks/setup-server-mocks.js'

process.env.GOOGLE_TAG_MANAGER_KEY = 'GTM-TEST123'

const { createServer } = await import('../../../../src/server.js')

const cookieName = 'fcp_sfd_cookie_policy'
const policyCookie = (analytics) => `${cookieName}=${Buffer.from(JSON.stringify({ confirmed: true, essential: true, analytics })).toString('base64')}`
const gtmSnippet = 'googletagmanager.com/gtm.js'

let server

describe('google tag manager', () => {
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

  test('renders the GTM snippet when analytics consent has been given', async () => {
    const response = await server.inject({
      url: '/cookies',
      headers: { cookie: policyCookie(true) }
    })

    expect(response.statusCode).toBe(constants.statusCodes.OK)
    expect(response.result).toContain(gtmSnippet)
    expect(response.result).toContain('GTM-TEST123')
  })

  test('does not render the GTM snippet when analytics consent has been refused', async () => {
    const response = await server.inject({
      url: '/cookies',
      headers: { cookie: policyCookie(false) }
    })

    expect(response.statusCode).toBe(constants.statusCodes.OK)
    expect(response.result).not.toContain(gtmSnippet)
  })

  test('allows googletagmanager.com in the script-src content security policy directive', async () => {
    const response = await server.inject({ url: '/cookies' })

    const scriptSrc = response.headers['content-security-policy']
      .split(';')
      .find((directive) => directive.startsWith('script-src'))

    expect(scriptSrc).toContain('https://*.googletagmanager.com')
  })

  test('nonces the inline GTM script with a value the policy allows', async () => {
    const response = await server.inject({
      url: '/cookies',
      headers: { cookie: policyCookie(true) }
    })

    const nonce = response.result.match(/<script nonce="([^"]+)"/)[1]

    expect(response.headers['content-security-policy']).toContain(`'nonce-${nonce}'`)
  })

  describe('when a user changes their consent', () => {
    const submitConsent = async (analytics, currentPolicy) => {
      const seed = await server.inject({ url: '/cookies', headers: { cookie: policyCookie(currentPolicy) } })
      const crumb = seed.headers['set-cookie'].join(';').match(/crumb=([^;]+)/)[1]

      return server.inject({
        method: 'POST',
        url: '/cookies',
        headers: {
          cookie: `${policyCookie(currentPolicy)}; crumb=${crumb}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        payload: `analytics=${analytics}&referer=/&crumb=${crumb}`
      })
    }

    test('does not render GTM on the response that records a withdrawal', async () => {
      const response = await submitConsent(false, true)

      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect(response.result).not.toContain(gtmSnippet)
    })

    test('renders GTM on the response that records an acceptance', async () => {
      const response = await submitConsent(true, false)

      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect(response.result).toContain(gtmSnippet)
    })

    test('preselects the newly chosen radio option', async () => {
      const response = await submitConsent(false, true)

      const noOption = response.result.match(/<input[^>]*id="analytics-2"[^>]*>/)[0]

      expect(noOption).toContain('checked')
    })
  })
})

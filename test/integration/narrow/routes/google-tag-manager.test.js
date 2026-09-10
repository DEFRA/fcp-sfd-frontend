import { constants } from '@defra/fcp-sfd-frontend-engine'
import { vi, beforeAll, afterAll, describe, test, expect } from 'vitest'
import '../../../mocks/setup-server-mocks.js'

process.env.GOOGLE_TAG_MANAGER_KEY = 'GTM-TEST123'

const { createServer } = await import('../../../../src/server.js')

const cookieName = 'cookie_policy'
const policyCookie = (analytics) => `${cookieName}=${JSON.stringify({ confirmed: true, essential: true, analytics })}`
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

  test('does not render the GTM snippet before a choice has been made', async () => {
    const response = await server.inject({ url: '/cookies' })

    expect(response.statusCode).toBe(constants.statusCodes.OK)
    expect(response.result).not.toContain('googletagmanager')
  })

  test('denies every consent signal before granting analytics storage and starting the container', async () => {
    const response = await server.inject({
      url: '/cookies',
      headers: { cookie: policyCookie(true) }
    })

    const consentDefault = response.result.indexOf("gtag('consent','default'")
    const consentUpdate = response.result.indexOf("gtag('consent','update',{'analytics_storage':'granted'})")

    expect(response.result).toContain("'ad_storage':'denied'")
    expect(consentDefault).toBeGreaterThan(-1)
    expect(consentUpdate).toBeGreaterThan(consentDefault)
    expect(response.result.indexOf(gtmSnippet)).toBeGreaterThan(consentUpdate)
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

  describe('the consent cookie', () => {
    const policyHeader = (setCookie) => setCookie.find((header) => header.startsWith(`${cookieName}=`))

    test('is not written before a choice has been made', async () => {
      const response = await server.inject({ url: '/cookies' })

      expect(policyHeader(response.headers['set-cookie'] ?? [])).toBeUndefined()
    })

    test('is written as readable JSON that client side scripts can access', async () => {
      const seed = await server.inject({ url: '/cookies' })
      const crumb = seed.headers['set-cookie'].join(';').match(/crumb=([^;]+)/)[1]

      const response = await server.inject({
        method: 'POST',
        url: '/cookies',
        headers: {
          cookie: `crumb=${crumb}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        payload: `analytics=true&referer=/&crumb=${crumb}`
      })

      const header = policyHeader(response.headers['set-cookie'])

      expect(header).toContain(`${cookieName}={"confirmed":true,"essential":true,"analytics":true}`)
      expect(header).not.toContain('HttpOnly')
    })
  })
})

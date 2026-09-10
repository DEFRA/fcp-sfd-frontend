// @vitest-environment jsdom
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'

let loadGoogleTagManager

describe('google tag manager client script', () => {
  beforeEach(async () => {
    vi.resetModules()
    document.head.innerHTML = ''
    delete window.dataLayer

    loadGoogleTagManager = (await import('../../../../src/client/javascripts/google-tag-manager.js')).loadGoogleTagManager
  })

  afterEach(() => {
    delete window.dataLayer
  })

  const injectedScripts = () => [...document.head.querySelectorAll('script')]

  test('it injects the container script', () => {
    loadGoogleTagManager('GTM-TEST123')

    expect(injectedScripts()).toHaveLength(1)
    expect(injectedScripts()[0].src).toBe('https://www.googletagmanager.com/gtm.js?id=GTM-TEST123')
    expect(injectedScripts()[0].async).toBe(true)
  })

  test('it denies every consent signal by default before granting analytics storage', () => {
    loadGoogleTagManager('GTM-TEST123')

    expect([...window.dataLayer[0]]).toStrictEqual(['consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    }])
    expect([...window.dataLayer[1]]).toStrictEqual(['consent', 'update', {
      analytics_storage: 'granted'
    }])
  })

  test('it starts the container after the consent signals', () => {
    loadGoogleTagManager('GTM-TEST123')

    expect(window.dataLayer[2]).toStrictEqual({ 'gtm.start': expect.any(Number), event: 'gtm.js' })
  })

  test('it does nothing without a container id', () => {
    loadGoogleTagManager('')

    expect(injectedScripts()).toHaveLength(0)
    expect(window.dataLayer).toBeUndefined()
  })

  test('it only loads the container once', () => {
    loadGoogleTagManager('GTM-TEST123')
    loadGoogleTagManager('GTM-TEST123')

    expect(injectedScripts()).toHaveLength(1)
  })
})

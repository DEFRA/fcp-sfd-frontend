// @vitest-environment jsdom
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'
import cookies from '../../../../src/client/javascripts/cookies.js'

let xhrInstances

class MockXHR {
  constructor () {
    this.open = vi.fn()
    this.setRequestHeader = vi.fn()
    this.send = vi.fn()
    xhrInstances.push(this)
  }
}

const cookieBannerFixture = `
  <div class="js-cookies-container js-cookies-banner" data-crumb="mock-crumb">
    <div class="js-question-banner">
      <button class="js-cookies-button-accept">Accept analytics cookies</button>
      <button class="js-cookies-button-reject">Reject analytics cookies</button>
    </div>
    <div class="js-cookies-accepted" hidden>
      <button class="js-hide">Hide this message</button>
    </div>
    <div class="js-cookies-rejected" hidden>
      <button class="js-hide">Hide this message</button>
    </div>
  </div>
`

describe('cookies client script', () => {
  beforeEach(() => {
    xhrInstances = []
    vi.stubGlobal('XMLHttpRequest', MockXHR)
    document.body.innerHTML = cookieBannerFixture
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('init', () => {
    test('should call setupCookieComponentListeners', () => {
      const spy = vi.spyOn(cookies, 'setupCookieComponentListeners')

      cookies.init()

      expect(spy).toHaveBeenCalled()

      spy.mockRestore()
    })
  })

  describe('setupCookieComponentListeners', () => {
    describe('when the cookie banner is not present on the page', () => {
      test('it should not throw', () => {
        document.body.innerHTML = ''

        expect(() => cookies.init()).not.toThrow()
      })
    })

    describe('when the accept button is clicked', () => {
      test('it prevents the default action and submits the preference asynchronously', () => {
        cookies.init()

        const acceptButton = document.querySelector('.js-cookies-button-accept')
        const event = new window.MouseEvent('click', { bubbles: true, cancelable: true })

        acceptButton.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
        expect(xhrInstances).toHaveLength(1)
        expect(xhrInstances[0].open).toHaveBeenCalledWith('POST', '/cookies', true)
        expect(xhrInstances[0].setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
        expect(xhrInstances[0].send).toHaveBeenCalledWith(JSON.stringify({
          analytics: true,
          async: true,
          crumb: 'mock-crumb'
        }))
      })

      test('it hides the question banner and shows the accepted banner', () => {
        cookies.init()

        document.querySelector('.js-cookies-button-accept').click()

        expect(document.querySelector('.js-question-banner').hasAttribute('hidden')).toBe(true)
        expect(document.querySelector('.js-cookies-accepted').hasAttribute('hidden')).toBe(false)
        expect(document.querySelector('.js-cookies-accepted').getAttribute('tabindex')).toBe('-1')
        expect(document.activeElement).toBe(document.querySelector('.js-cookies-accepted'))
      })
    })

    describe('when the reject button is clicked', () => {
      test('it prevents the default action and submits the preference asynchronously', () => {
        cookies.init()

        const rejectButton = document.querySelector('.js-cookies-button-reject')
        const event = new window.MouseEvent('click', { bubbles: true, cancelable: true })

        rejectButton.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
        expect(xhrInstances[0].send).toHaveBeenCalledWith(JSON.stringify({
          analytics: false,
          async: true,
          crumb: 'mock-crumb'
        }))
      })

      test('it hides the question banner and shows the rejected banner', () => {
        cookies.init()

        document.querySelector('.js-cookies-button-reject').click()

        expect(document.querySelector('.js-question-banner').hasAttribute('hidden')).toBe(true)
        expect(document.querySelector('.js-cookies-rejected').hasAttribute('hidden')).toBe(false)
        expect(document.querySelector('.js-cookies-rejected').getAttribute('tabindex')).toBe('-1')
      })
    })

    describe('when a shown banner loses focus', () => {
      test('it removes the tabindex attribute', () => {
        cookies.init()

        const acceptedBanner = document.querySelector('.js-cookies-accepted')

        document.querySelector('.js-cookies-button-accept').click()
        acceptedBanner.dispatchEvent(new window.FocusEvent('blur'))

        expect(acceptedBanner.hasAttribute('tabindex')).toBe(false)
      })
    })

    describe('when the hide button on the accepted banner is clicked', () => {
      test('it hides the cookie banner', () => {
        cookies.init()

        document.querySelector('.js-cookies-button-accept').click()
        document.querySelector('.js-cookies-accepted .js-hide').click()

        expect(document.querySelector('.js-cookies-banner').hasAttribute('hidden')).toBe(true)
      })
    })

    describe('when the hide button on the rejected banner is clicked', () => {
      test('it hides the cookie banner', () => {
        cookies.init()

        document.querySelector('.js-cookies-button-reject').click()
        document.querySelector('.js-cookies-rejected .js-hide').click()

        expect(document.querySelector('.js-cookies-banner').hasAttribute('hidden')).toBe(true)
      })
    })
  })
})

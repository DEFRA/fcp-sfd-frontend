import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('check business email address', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-email-check.njk', {
      businessEmail: 'testbusiness@email.com',
      error: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render a summary list row with the correct business email address', () => {
    const key = document.querySelector('.govuk-summary-list__key')
    const value = document.querySelector('.govuk-summary-list__value')

    expect(key).not.toBeNull()
    expect(key.textContent.trim()).toBe('Business email address')

    expect(value).not.toBeNull()
    expect(value.textContent.trim()).toBe('testbusiness@email.com')
  })

  test('should render a “Change” action link with correct href and hidden text', () => {
    const actionLink = document.querySelector(
      '.govuk-summary-list__actions a.govuk-link'
    )

    const visuallyHidden = actionLink.querySelector(
      '.govuk-visually-hidden'
    )

    expect(actionLink).not.toBeNull()
    expect(actionLink.getAttribute('href')).toBe('/business-email-change')

    expect(visuallyHidden).not.toBeNull()
    expect(visuallyHidden.textContent.trim()).toBe('business email')
  })

  test.each([
    ['correct heading', 'h1', 'Check your business email address is correct before submitting'],
    ['submit button', 'button.govuk-button', 'Submit'],
    ['cancel link', 'a[href="/business-details"]', 'Cancel']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toContain(textContent)
  })
})

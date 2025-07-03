import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('check business email address', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business/business-email-check.njk', {
      businessEmail: 'testbusiness@email.com',
      error: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render a summary list row with correct business email address', () => {
    const key = document.querySelector('.govuk-summary-list__key')
    const value = document.querySelector('.govuk-summary-list__value')

    expect(key).not.toBeNull()
    expect(key.textContent.trim()).toBe('Business email address')

    expect(value).not.toBeNull()
    expect(value.textContent.trim()).toBe('testbusiness@email.com')
  })

  test.each([
    [
      '"Change" link which navigates to /business-email-change',
      '.govuk-summary-list__actions a.govuk-link',
      '/business-email-change',
      'Change'
    ],
    [
      '"Cancel" link which navigates to /business-details',
      'a.govuk-link.govuk-link--no-visited-state',
      '/business-details',
      'Cancel'
    ]
  ])('should render %s', (_, selector, route, textContent) => {
    const link = document.querySelector(selector)

    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe(route)
    expect(link.textContent.trim()).toContain(textContent)
  })
})

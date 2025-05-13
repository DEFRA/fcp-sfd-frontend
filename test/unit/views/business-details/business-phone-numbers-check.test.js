import { describe, test, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'
import { normaliseText } from '../../../helpers/normalise-text.js'

describe('check business phone numbers', () => {
  let document

  beforeEach(() => {
    const html = renderTemplate('business-details/business-phone-numbers-check.njk', {
      businessTelephone: '01234567890',
      businessMobile: ''
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('displays both telephone and mobile numbers', () => {
    const value = document.querySelector('.govuk-summary-list__value')
    const content = normaliseText(value.textContent)

    expect(value).not.toBeNull()
    expect(content).toContain('Telephone: 01234567890')
    expect(content).toContain('Mobile: Not added')
  })

  test.each([
    ['pageheading', 'h1', 'Check your business phone numbers are correct before submitting'],
    ['"Submit" button', 'button', 'Submit']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toContain(textContent)
  })

  test.each([
    [
      '"Change" link which navigates to /business-phone-numbers-change',
      '.govuk-summary-list__actions a.govuk-link',
      '/business-phone-numbers-change',
      'Change'
    ],
    [
      '"Cancel" link which navigates to /business-details',
      'a.govuk-link--no-visited-state',
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

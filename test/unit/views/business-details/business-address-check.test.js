import { describe, test, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'
import { normaliseText } from '../../../helpers/normalise-text.js'

describe('check business address', () => {
  let document

  beforeEach(() => {
    const html = renderTemplate('business/business-address-check.njk', {
      address1: '123 Farm Lane',
      address2: '',
      city: 'York',
      county: 'North Yorkshire',
      postcode: 'Y01 7HG',
      country: 'United Kingdom'
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('displays the full business address', () => {
    const value = document.querySelector('.govuk-summary-list__value')
    const content = normaliseText(value.textContent)

    expect(value).not.toBeNull()
    expect(content).toContain('123 Farm Lane')
    expect(content).toContain('York')
    expect(content).toContain('North Yorkshire')
    expect(content).toContain('Y01 7HG')
    expect(content).toContain('United Kingdom')
  })

  test.each([
    ['page heading', 'h1', 'Check your business address is correct before submitting'],
    ['"Submit" button', 'button', 'Submit']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(normaliseText(element.textContent)).toContain(textContent)
  })

  test.each([
    [
      '"Change" link which navigates to /business-address-enter',
      '.govuk-summary-list__actions a.govuk-link',
      '/business-address-enter',
      'Change'
    ]
  ])('should render %s', (_, selector, route, textContent) => {
    const link = document.querySelector(selector)

    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe(route)
    expect(normaliseText(link.textContent)).toContain(textContent)
  })
})

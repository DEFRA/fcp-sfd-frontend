import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('check business name', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-name-check.njk', {
      businessName: 'Test business name',
      error: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render a summary list row with correct business name', () => {
    const key = document.querySelector('.govuk-summary-list__key')
    const value = document.querySelector('.govuk-summary-list__value')

    expect(key).not.toBeNull()
    expect(key.textContent.trim()).toBe('Business name')

    expect(value).not.toBeNull()
    expect(value.textContent.trim()).toBe('Test business name')
  })

  test.each([
    [
      '"Change" link which navigates to /business-name-change',
      '.govuk-summary-list__actions a.govuk-link',
      '/business-name-change',
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

  test.each([
    ['correct heading', 'h1', 'Check your business name is correct before submitting'],
    ['submit button', 'button', 'Submit']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toContain(textContent)
  })
})

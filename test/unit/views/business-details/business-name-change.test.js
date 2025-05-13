import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('change business name', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-name-change.njk', {
      businessName: 'Test business name',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render business name input field with correct value', () => {
    const input = document.querySelector('#business-name')

    expect(input).not.toBeNull()
    expect(input.name).toBe('businessName')
    expect(input.value).toBe('Test business name')
  })

  test('should render cancel link which navigates to business details', () => {
    const link = document.querySelector(
      'a.govuk-link.govuk-link--no-visited-state'
    )

    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/business-details')
    expect(link.textContent.trim()).toBe('Cancel')
  })

  test.each([
    ['page heading', 'h1', 'What is your business name?'],
    ['"Continue" button', 'button', 'Continue']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toBe(textContent)
  })
})

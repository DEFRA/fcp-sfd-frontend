import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('change business email address', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business/business-email-change.njk', {
      businessEmail: 'testbusiness@email.com',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render the business email input field with the correct value', () => {
    const input = document.querySelector('#business-email')

    expect(input).not.toBeNull()
    expect(input.name).toBe('businessEmail')
    expect(input.value).toBe('testbusiness@email.com')
  })

  test('should render a cancel link which navigates to business details', () => {
    const link = document.querySelector(
      'a.govuk-link.govuk-link--no-visited-state'
    )

    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/business-details')
    expect(link.textContent.trim()).toBe('Cancel')
  })

  test.each([
    ['page heading', 'h1', 'What is your business email address?'],
    ['"Continue" button', 'button', 'Continue']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toBe(textContent)
  })
})

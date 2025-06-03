import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('change business phone numbers', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business/business-phone-numbers-change.njk', {
      businessTelephone: '01234567890',
      businessMobile: '07123456789',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test.each([
    [
      'business telephone number input field with correct value',
      '#businessTelephone',
      'businessTelephone',
      '01234567890'
    ],
    [
      'business mobile number input field with correct value',
      '#businessMobile',
      'businessMobile',
      '07123456789'
    ]
  ])('should render %s', (_, selector, name, value) => {
    const input = document.querySelector(selector)

    expect(input).not.toBeNull()
    expect(input.name).toBe(name)
    expect(input.value).toBe(value)
  })

  test.each([
    ['page heading', 'h1', 'What are your business phone numbers?'],
    ['hint text', '.govuk-hint', 'Enter at least one phone number'],
    ['"Continue" button', 'button', 'Continue']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toContain(textContent)
  })

  test('should render cancel link which navigates to business details', () => {
    const link = document.querySelector('a.govuk-link--no-visited-state')

    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/business-details')
    expect(link.textContent.trim()).toBe('Cancel')
  })
})

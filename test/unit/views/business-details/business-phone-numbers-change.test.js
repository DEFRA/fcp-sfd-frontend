import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('Business phone numbers page', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-phone-numbers-change.njk', {
      businessTelephone: '01234567890',
      businessMobile: '07123456789',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render the correct heading', () => {
    const heading = document.querySelector('h1')

    expect(heading).not.toBeNull()
    expect(heading.textContent.trim()).toBe('What are your business phone numbers?')
  })

  test('should show the hint text', () => {
    const hint = document.querySelector('.govuk-hint')

    expect(hint).not.toBeNull()
    expect(hint.textContent.trim()).toBe('Enter at least one phone number')
  })

  test('should render the business telephone number input', () => {
    const input = document.querySelector('#businessTelephone')

    expect(input).not.toBeNull()
    expect(input.getAttribute('name')).toBe('businessTelephone')
    expect(input.getAttribute('type')).toBe('tel')
    expect(input.value).toBe('01234567890')
    expect(input.classList.contains('govuk-input--width-20')).toBe(true)
  })

  test('should render the business mobile number input', () => {
    const input = document.querySelector('#businessMobile')

    expect(input).not.toBeNull()
    expect(input.getAttribute('name')).toBe('businessMobile')
    expect(input.getAttribute('type')).toBe('tel')
    expect(input.value).toBe('07123456789')
    expect(input.classList.contains('govuk-input--width-20')).toBe(true)
  })

  test('should render the continue button', () => {
    const button = document.querySelector('button.govuk-button')

    expect(button).not.toBeNull()
    expect(button.textContent.trim()).toBe('Continue')
  })

  test('should render the cancel link with correct href', () => {
    const cancelLink = document.querySelector('a.govuk-link--no-visited-state')

    expect(cancelLink).not.toBeNull()
    expect(cancelLink.getAttribute('href')).toBe('/business-details')
    expect(cancelLink.textContent.trim()).toBe('Cancel')
  })
})

import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('enter business address', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business/business-address-enter.njk', {
      address1: '123 Farm Lane',
      address2: '',
      addressCity: 'York',
      addressCounty: 'North Yorkshire',
      postcode: 'Y01 7HG',
      addressCountry: 'United Kingdom',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test.each([
    ['address line 1', '#address1', 'address1', '123 Farm Lane'],
    ['address line 2', '#address2', 'address2', ''],
    ['town/city', '#addressCity', 'addressCity', 'York'],
    ['addressCounty', '#addressCounty', 'addressCounty', 'North Yorkshire'],
    ['postcode', '#postcode', 'postcode', 'Y01 7HG'],
    ['country', '#addressCountry', 'addressCountry', 'United Kingdom']
  ])('should render the correct value in the input field for %s', (_, selector, name, value) => {
    const input = document.querySelector(selector)

    expect(input).not.toBeNull()
    expect(input.name).toBe(name)
    expect(input.value).toBe(value)
  })

  test.each([
    ['page heading', 'h1', 'Enter your business address'],
    ['"Continue" button', 'button', 'Continue']
  ])('should render %s', (_, selector, textContent) => {
    const element = document.querySelector(selector)

    expect(element).not.toBeNull()
    expect(element.textContent.trim()).toBe(textContent)
  })

  test('should render a cancel link which navigates to business details', () => {
    const link = document.querySelector(
      'a.govuk-link.govuk-link--no-visited-state'
    )

    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/business-details')
    expect(link.textContent.trim()).toBe('Cancel')
  })
})

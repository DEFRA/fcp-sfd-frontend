import { describe, test, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('Business Address Form (Static Content)', () => {
  let document

  const render = (context = {}) => {
    const html = renderTemplate('business-details/business-address-form.njk', context)
    const dom = new JSDOM(html)
    document = dom.window.document
  }

  beforeEach(() => {
    render({})
  })

  test('renders the correct heading', () => {
    const heading = document.querySelector('h1')
    expect(heading).not.toBeNull()
    expect(heading.textContent.trim()).toBe('Enter your business address')
  })

  test('renders the address input fields', () => {
    const address1Field = document.querySelector('#address1')
    expect(address1Field).not.toBeNull()

    const address2Field = document.querySelector('#address2')
    expect(address2Field).not.toBeNull()

    const addressCityField = document.querySelector('#addressCity')
    expect(addressCityField).not.toBeNull()

    const addressCountyField = document.querySelector('#addressCounty')
    expect(addressCountyField).not.toBeNull()

    const addressPostcodeField = document.querySelector('#addressPostcode')
    expect(addressPostcodeField).not.toBeNull()

    const addressCountryField = document.querySelector('#addressCountry')
    expect(addressCountryField).not.toBeNull()
  })

  test('renders the continue button', () => {
    const continueButton = document.querySelector('button.govuk-button')
    expect(continueButton).not.toBeNull()
    expect(continueButton.textContent.trim()).toBe('Continue')
  })

  test('should include a cancel link which navigates to business details', () => {
    const cancelLink = document.querySelector(
      'a.govuk-link.govuk-link--no-visited-state'
    )

    expect(cancelLink).not.toBeNull()
    expect(cancelLink.getAttribute('href')).toBe('/business-details')
    expect(cancelLink.textContent.trim()).toBe('Cancel')
  })
})

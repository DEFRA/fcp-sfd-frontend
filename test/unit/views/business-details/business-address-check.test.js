import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('Business Address Check Page (Static Content)', () => {
  let document

  beforeAll(async () => {
    const html = await renderTemplate('business-details/business-address-check.njk', {
      address1: '',
      address2: '',
      addressCity: '',
      addressCounty: '',
      addressPostcode: '',
      addressCountry: ''
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('renders the correct heading', () => {
    const heading = document.querySelector('h1.govuk-heading-l')
    expect(heading).not.toBeNull()
    expect(heading.textContent.trim()).toBe('Check your business address is correct before submitting')
  })

  test('renders the "Change" link with correct href', () => {
    const changeLink = document.querySelector('a[href="/business-address-enter"]')
    expect(changeLink).not.toBeNull()
    expect(changeLink.textContent.trim()).toBe('Change business address')
  })

  test('renders the "Cancel" link with correct href', () => {
    const cancelLink = document.querySelector('a[href="/business-details"]')
    expect(cancelLink).not.toBeNull()
    expect(cancelLink.textContent.trim()).toBe('Cancel')
  })

  test('renders the "Submit" button', () => {
    const submitButton = document.querySelector('button[type="submit"]')
    expect(submitButton).not.toBeNull()
    expect(submitButton.textContent.trim()).toBe('Submit')
  })

  test('renders the address fields', () => {
    const addressRow = document.querySelector('dl.govuk-summary-list')
    expect(addressRow).not.toBeNull()

    const addressDetails = addressRow.querySelector('dd.govuk-summary-list__value')
    expect(addressDetails.textContent.trim()).toBe('')
  })
})

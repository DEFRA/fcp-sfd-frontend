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

  test('should render the correct heading', () => {
    const heading = document.querySelector('h1')

    expect(heading).not.toBeNull()
    expect(heading.textContent).toContain('Check your business name is correct before submitting')
  })

  test('should render a summary list row with the correct business name', () => {
    const key = document.querySelector('.govuk-summary-list__key')
    const value = document.querySelector('.govuk-summary-list__value')

    expect(key).not.toBeNull()
    expect(key.textContent.trim()).toBe('Business name')

    expect(value).not.toBeNull()
    expect(value.textContent.trim()).toBe('Test business name')
  })

  test('should render a “Change” action link with correct href and hidden text', () => {
    const actionLink = document.querySelector(
      '.govuk-summary-list__actions a.govuk-link'
    )
    expect(actionLink).not.toBeNull()
    expect(actionLink.getAttribute('href')).toBe('/business-name-change')
    const visuallyHidden = actionLink.querySelector(
      '.govuk-visually-hidden'
    )
    expect(visuallyHidden).not.toBeNull()
    expect(visuallyHidden.textContent.trim()).toBe('business name')
  })

  test('should render a submit button', () => {
    const submitBtn = document.querySelector('button.govuk-button')
    expect(submitBtn).not.toBeNull()
    expect(submitBtn.textContent.trim()).toBe('Submit')
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
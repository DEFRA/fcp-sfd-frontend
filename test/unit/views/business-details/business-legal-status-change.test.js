import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('change business legal status', () => {
  let document

  const html = renderTemplate('business-details/business-legal-status-change.njk')
  const dom = new JSDOM(html)
  document = dom.window.document

  test('should render the correct heading', () => {
    const heading = document.querySelector('h1')

    expect(heading).not.toBeNull()
    expect(heading.textContent).toContain('Change your legal status')
  })

  test('should include the contact guidance text', () => {
    const bodyText = document.body.textContent
    expect(bodyText).toContain('If your legal status is incorrect, contact the Rural Payments Agency to update it.')
  })

  test('should render the contact section heading', () => {
    const contactHeading = document.querySelector('h2')
    expect(contactHeading).not.toBeNull()
    expect(contactHeading.textContent.trim()).toBe('Contact the Rural Payments Agency')
  })

  test('should render a return button that navigates to business details', () => {
    const button = document.querySelector('a.govuk-button[href="/business-details"]')

    expect(button).not.toBeNull()
    expect(button.textContent.trim()).toBe('Return to business details')
  })
})
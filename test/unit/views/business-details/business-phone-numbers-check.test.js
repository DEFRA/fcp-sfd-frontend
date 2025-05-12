import { describe, test, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'
import { normaliseText } from '../../../helpers/normalise-text.js'

describe('Check business phone numbers page', () => {
  let document

  const render = (context = {}) => {
    const html = renderTemplate('business-details/business-phone-numbers-check.njk', {
      businessTelephone: context.businessTelephone,
      businessMobile: context.businessMobile
    })
    const dom = new JSDOM(html)
    document = dom.window.document
  }

  describe('when phone numbers are provided', () => {
    beforeEach(() => {
      render({
        businessTelephone: '01234567890',
        businessMobile: '07123456789'
      })
    })

    test('renders the correct heading', () => {
      const heading = document.querySelector('h1')
      expect(heading).not.toBeNull()
      expect(heading.textContent.trim()).toBe(
        'Check your business phone numbers are correct before submitting'
      )
    })

    test('displays both telephone and mobile numbers', () => {
      const value = document.querySelector('.govuk-summary-list__value')
      expect(value).not.toBeNull()
      const content = normaliseText(value.textContent)
      expect(content).toContain('Telephone: 01234567890')
      expect(content).toContain('Mobile: 07123456789')
    })

    test('renders a change link with visually hidden text', () => {
      const changeLink = document.querySelector('.govuk-summary-list__actions a')
      expect(changeLink).not.toBeNull()
      expect(changeLink.getAttribute('href')).toBe('/business-phone-numbers-change')

      const visuallyHidden = changeLink.querySelector('.govuk-visually-hidden')
      expect(visuallyHidden).not.toBeNull()
      expect(visuallyHidden.textContent.trim()).toBe('business phone numbers')
    })

    test('renders the submit button', () => {
      const submit = document.querySelector('button.govuk-button')
      expect(submit).not.toBeNull()
      expect(submit.textContent.trim()).toBe('Submit')
    })

    test('renders the cancel link with correct href', () => {
      const cancel = document.querySelector('a.govuk-link--no-visited-state')
      expect(cancel).not.toBeNull()
      expect(cancel.getAttribute('href')).toBe('/business-details')
      expect(cancel.textContent.trim()).toBe('Cancel')
    })
  })

  describe('when no phone numbers are provided', () => {
    beforeEach(() => {
      render({})
    })

    test('shows "Not added" hint for both phone numbers', () => {
      const value = document.querySelector('.govuk-summary-list__value')
      expect(value).not.toBeNull()
      const content = normaliseText(value.textContent)
      expect(content).toContain('Telephone: Not added')
      expect(content).toContain('Mobile: Not added')
    })
  })
})

import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('view and update business details', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-details.njk', {
      businessName: 'Agile Farm Ltd',
      businessAddress: '123 Main Street, Cityville, 12345',
      businessTelephone: '0123456789',
      businessMobile: '',
      businessEmail: 'info@agilefarm.com',
      showSuccessBanner: true,
      successMessage: 'Business details updated successfully',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render business name with a change link', () => {
    const businessNameRow = document.querySelectorAll('.govuk-summary-list__row')[0]
    const businessName = businessNameRow.querySelector('.govuk-summary-list__value').textContent.trim()
    const changeLink = businessNameRow.querySelector('a').getAttribute('href')

    expect(businessName).toBe('Agile Farm Ltd')
    expect(changeLink).toBe('/business-name-change')
  })

  test('should render business address with a change link', () => {
    const addressRow = document.querySelectorAll('.govuk-summary-list__row')[1]
    const address = addressRow.querySelector('.govuk-summary-list__value').textContent.trim()
    const changeLink = addressRow.querySelector('a').getAttribute('href')

    expect(address).toBe('123 Main Street, Cityville, 12345')
    expect(changeLink).toBe('/business-address-enter')
  })

  test('should render business telephone number or "Not added" if empty', () => {
    const phoneRow = document.querySelectorAll('.govuk-summary-list__row')[2]
    const telephoneValue = phoneRow.querySelector('.govuk-summary-list__value span')?.textContent.trim()

    expect(telephoneValue).toBe('0123456789')
  })

  test('should render "Not added" for mobile number if empty', () => {
    const phoneRow = document.querySelectorAll('.govuk-summary-list__row')[2]
    const mobileValue = phoneRow.querySelectorAll('.govuk-summary-list__value span')[1]?.textContent.trim()

    expect(mobileValue).toBe('Not added')
  })

  test('should render business email address correctly', () => {
    const emailRow = document.querySelectorAll('.govuk-summary-list__row')[3]
    const emailValue = emailRow.querySelector('.govuk-summary-list__value')?.textContent.trim()

    expect(emailValue).toBe('info@agilefarm.com')
  })

  test('should render success notification banner', () => {
    const successBanner = document.querySelector('.govuk-notification-banner')
    expect(successBanner).not.toBeNull()

    const bannerText = successBanner.textContent
    expect(bannerText).toContain('Business details updated successfully')
  })
})

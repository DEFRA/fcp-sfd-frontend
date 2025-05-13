import { describe, test, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'
import { normaliseText } from '../../../helpers/normalise-text.js'

describe('view and update business details', () => {
  let document

  const context = {
    businessName: 'Agile Farm Ltd',
    formattedAddress: '123 Farm Lane<br>York<br>Y01 7HG<br>United Kingdom',
    businessTelephone: '',
    businessMobile: '07123456789',
    businessEmail: 'agile@example.com',
    showSuccessBanner: false,
    successMessage: ''
  }

  beforeEach(() => {
    const html = renderTemplate('business-details/business-details.njk', context)

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('renders change links for all editable fields', () => {
    const changeLinks = [
      '/business-name-change',
      '/business-address-enter',
      '/business-phone-numbers-change',
      '/business-email-change',
      '/business-legal-status-change',
      '/business-type-change'
    ]

    changeLinks.forEach(link => {
      const element = document.querySelector(`a[href="${link}"]`)

      expect(element).not.toBeNull()
    })
  })

  describe('business contact details', () => {
    test('renders the business contact details heading', () => {
      const heading = document.querySelector('h2')

      expect(heading).not.toBeNull()
      expect(heading.textContent.trim()).toContain('Business contact details')
    })

    test.each([
      ['business name', 'Business name', 'businessName'],
      ['business address', 'Business address', 'formattedAddress'],
      ['business email', 'Business email', 'businessEmail']
    ])('should display the correct %s', (_, label, contextParam) => {
      const element = [...document.querySelectorAll('dt')].find(dt => dt.textContent.includes(label))
      const dd = element ? element.nextElementSibling : null

      expect(dd).not.toBeNull()
      expect(dd.innerHTML.trim()).toBe(context[contextParam])
    })

    test('should display the correct business phone numbers', () => {
      const phoneEl = [...document.querySelectorAll('dt')].find(dt => dt.textContent.includes('Business phone numbers'))
      const dd = phoneEl ? phoneEl.nextElementSibling : null

      expect(dd).not.toBeNull()

      const telText = dd.textContent
      expect(telText).toContain('Telephone:')
      expect(telText).toContain('Not added')
      expect(telText).toContain('Mobile:')
      expect(telText).toContain(context.businessMobile)
    })
  })

  describe('reference numbers', () => {
    test('displays the reference numbers section', () => {
      const html = document.body.innerHTML

      expect(html).toContain('Single business identifier (SBI)')
      expect(html).toContain('123456789')
      expect(html).toContain('VAT registration number')
      expect(html).toContain('No number added')
    })
  })

  describe('additional details', () => {
    test('displays the additional details section', () => {
      const html = document.body.innerHTML

      expect(html).toContain('Business legal status')
      expect(html).toContain('Sole proprietorship')
      expect(html).toContain('Business type')
      expect(html).toContain('Central or local government')
    })
  })
})

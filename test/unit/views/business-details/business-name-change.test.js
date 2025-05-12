import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('change business name', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-name-change.njk', {
      businessName: 'Test business name',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render the correct heading', () => {
    const heading = document.querySelector('h1')

    expect(heading).not.toBeNull()
    expect(heading.textContent).toContain('What is your business name?')
  })

  test('should include the business name input field with the correct value', () => {
    const input = document.querySelector('input#business-name')
    
    expect(input).not.toBeNull()
    expect(input.name).toBe('businessName')
    expect(input.value).toBe('Test business name')
  })

  test('should render a continue button', () => {
    const button = document.querySelector('button')

    expect(button).not.toBeNull()
    expect(button.textContent.trim()).toBe('Continue')
  })

  test('should include a cancel link which navigates to business details', () => {
    const cancelLink = document.querySelector('a[href="/business-details"]')
    
    expect(cancelLink).not.toBeNull()
    expect(cancelLink.textContent.trim()).toBe('Cancel')
  })
})

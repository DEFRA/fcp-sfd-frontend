import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('change business email address', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business/business-email-change.njk', {
      businessEmail: 'testbusiness@email.com',
      errors: {}
    })

    const dom = new JSDOM(html)
    document = dom.window.document
  })

  test('should render the business email input field with the correct value', () => {
    const input = document.querySelector('#business-email')

    expect(input).not.toBeNull()
    expect(input.name).toBe('businessEmail')
    expect(input.value).toBe('testbusiness@email.com')
  })
})

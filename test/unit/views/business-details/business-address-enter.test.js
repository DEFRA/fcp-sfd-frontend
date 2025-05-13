import { describe, test, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { renderTemplate } from '../../../helpers/render-template.js'

describe('enter business address', () => {
  let document

  beforeAll(() => {
    const html = renderTemplate('business-details/business-address-enter.njk', {
      address1: '123 Farm Lane',
      address2: '',
      addressCity: 'York',
      addressCounty: 'North Yorkshire',
      addressPostcode: 'YO1 7HG',
      addressCountry: 'United Kingdom',
      errors: {}
    })

    const dom = new JSCOM(html)
    document = dom.window.document
  })
})
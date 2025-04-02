import { contactUs } from '../../../src/routes/footer/contact-us.js'
import { jest, beforeEach, describe, test, expect } from '@jest/globals'

const mockView = jest.fn()

const mockH = {
  view: jest.fn().mockReturnValue(mockView)
}

describe('Contact-us endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(contactUs.method).toBe('GET')
    expect(contactUs.path).toBe('/contact-us')
  })

  test('should render the contact-us view with correct data', () => {
    const result = contactUs.handler(null, mockH)

    expect(mockH.view).toHaveBeenCalledWith('footer/contact-us', {
      pageTitle: 'Contact us for help',
      heading: 'How to contact this service if you need help.'
    })

    expect(result).toBe(mockView)
  })
})

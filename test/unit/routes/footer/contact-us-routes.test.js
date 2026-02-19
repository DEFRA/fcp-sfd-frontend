import { vi, beforeEach, describe, test, expect } from 'vitest'
import { contactUs } from '../../../../src/routes/footer/contact-us-routes.js'

describe('Contact us endpoint', () => {
  let viewMock

  beforeEach(() => {
    viewMock = vi.fn().mockReturnValue('mock view return')
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(contactUs.method).toBe('GET')
    expect(contactUs.path).toBe('/contact-help')
  })

  test('should render the contact-us view with correct data', () => {
    const mockRequest = {
      headers: {
        referer: '/some-previous-page'
      }
    }

    const h = { view: viewMock }
    const result = contactUs.handler(mockRequest, h)

    expect(viewMock).toHaveBeenCalledWith('footer/contact-help', {
      pageTitle: 'Contact us for help',
      heading: 'How to contact this service if you need help.',
      backLink: '/some-previous-page'
    })

    expect(result).toBe('mock view return')
  })
})

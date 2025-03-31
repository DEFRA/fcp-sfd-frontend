import { cookies } from '../../../src/routes/cookies.js'
import { jest, beforeEach, describe, test, expect } from '@jest/globals'

const mockView = jest.fn()

const mockH = {
  view: jest.fn().mockReturnValue(mockView)
}

describe('Cookies endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(cookies.method).toBe('GET')
    expect(cookies.path).toBe('/cookies')
  })

  test('should render the cookies view with correct data', () => {
    const result = cookies.handler(null, mockH)

    expect(mockH.view).toHaveBeenCalledWith('cookies', {
      pageTitle: 'Cookies',
      heading: 'Cookies'
    })

    expect(result).toBe(mockView)
  })
})

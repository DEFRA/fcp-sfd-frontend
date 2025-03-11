import { home } from '../../../src/routes/home'
import { jest, beforeEach, describe, test, expect } from '@jest/globals'

const mockView = jest.fn()

const mockH = {
  view: jest.fn().mockReturnValue(mockView)
}

describe('Home endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(home.method).toBe('GET')
    expect(home.path).toBe('/')
  })

  test('should render the home view with correct data', () => {
    const result = home.handler(null, mockH)

    expect(mockH.view).toHaveBeenCalledWith('home', {
      pageTitle: 'Home',
      heading: 'Home'
    })

    expect(result).toBe(mockView)
  })
})

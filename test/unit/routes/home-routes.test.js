import { vi, beforeEach, describe, test, expect } from 'vitest'
import { home } from '../../../src/routes/home-routes.js'

const mockView = vi.fn()

const mockH = {
  view: vi.fn().mockReturnValue(mockView)
}

describe('Home endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(home.method).toBe('GET')
    expect(home.path).toBe('/home')
  })

  test('should render the home view with correct data', () => {
    const result = home.handler(null, mockH)

    expect(mockH.view).toHaveBeenCalledWith('home')
    expect(result).toBe(mockView)
  })
})

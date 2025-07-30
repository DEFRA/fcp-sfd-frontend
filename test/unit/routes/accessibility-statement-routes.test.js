import { vi, beforeEach, describe, test, expect } from 'vitest'
import { accessibilityStatement } from '../../../src/routes/footer/accessibility-statement-routes'

const mockView = vi.fn()

const mockH = {
  view: vi.fn().mockReturnValue(mockView)
}

describe('Accessibility statement endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(accessibilityStatement.method).toBe('GET')
    expect(accessibilityStatement.path).toBe('/accessibility-statement')
  })

  test('should render the accessibility-statment view with correct data', () => {
    const result = accessibilityStatement.handler(null, mockH)

    expect(mockH.view).toHaveBeenCalledWith('footer/accessibility-statement', {
      pageTitle: 'Accessibility statement',
      heading: 'Accessibility statement'
    })

    expect(result).toBe(mockView)
  })
})

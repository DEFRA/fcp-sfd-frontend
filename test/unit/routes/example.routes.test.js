import { vi, beforeEach, describe, test, expect } from 'vitest'
import { exampleDalConnectionRoute } from '../../../src/routes/example.routes.js'

describe('Example endpoint for DAL integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(exampleDalConnectionRoute.method).toBe('GET')
    expect(exampleDalConnectionRoute.path).toBe('/example')
  })
})

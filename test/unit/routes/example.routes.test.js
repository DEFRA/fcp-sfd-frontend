import { vi, beforeEach, describe, test, expect } from 'vitest'
import { constants as httpConstants } from 'http2'
import { exampleDalConnectionRoute } from '../../../src/routes/example.routes.js'

const mockResponse = {
  code: vi.fn().mockReturnThis()
}

const mockH = {
  response: vi.fn().mockReturnValue(mockResponse)
}

describe('Example endpoint for DAL integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should have the correct method and path', () => {
    expect(exampleDalConnectionRoute.method).toBe('GET')
    expect(exampleDalConnectionRoute.path).toBe('/example')
  })
})


// Test framework dependencies
import { vi, beforeEach, describe, test, expect } from 'vitest'

// Mocks
const mockGetTraceId = vi.fn()

vi.mock('@defra/hapi-tracing', () => ({
  getTraceId: mockGetTraceId
}))

// Things under test
const { loggerOptions } = await import('../../../src/config/logger-options.js')

describe('logger-options', () => {
  beforeEach(() => {
    mockGetTraceId.mockReset()
  })

  test('mixin function adds trace ID when available', () => {
    mockGetTraceId.mockReturnValue('test-trace-id')

    const result = loggerOptions.mixin()

    expect(result).toEqual({
      trace: { id: 'test-trace-id' }
    })
  })

  test('mixin function returns empty object when no trace ID', () => {
    mockGetTraceId.mockReturnValue(null)

    const result = loggerOptions.mixin()

    expect(result).toEqual({})
  })
})

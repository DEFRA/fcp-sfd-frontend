import { jest, beforeAll, beforeEach, describe, test, expect } from '@jest/globals'

jest.unstable_mockModule('@defra/hapi-tracing', () => ({
  getTraceId: jest.fn()
}))

const mockGetTraceId = jest.fn()

let loggerOptions

beforeAll(async () => {
  jest.unstable_mockModule('@defra/hapi-tracing', () => ({
    getTraceId: mockGetTraceId
  }))

  const loggerOptionsModule = await import('../../../src/config/logger-options.js')
  loggerOptions = loggerOptionsModule.loggerOptions
})

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

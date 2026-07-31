import { vi, beforeAll, beforeEach, describe, test, expect } from 'vitest'

const mockGetTraceId = vi.fn()

vi.mock('@defra/hapi-tracing', () => ({
  getTraceId: mockGetTraceId
}))

let loggerOptions

beforeAll(async () => {
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

  describe('getChildBindings', () => {
    test('Should include sbi, masked crn and session_id for an authenticated request', () => {
      const mockRequest = {
        auth: {
          credentials: {
            sbi: 123456789,
            crn: 1234567890,
            sessionId: 'abc-session-123'
          }
        }
      }

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toMatchObject({
        sbi: 123456789,
        crn: '******7890',
        session_id: 'abc-session-123'
      })
    })

    test('Should return only req binding for an unauthenticated request', () => {
      const mockRequest = { auth: {} }

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toEqual({ req: mockRequest })
      expect(result).not.toHaveProperty('sbi')
      expect(result).not.toHaveProperty('crn')
      expect(result).not.toHaveProperty('session_id')
    })

    test('Should return only req binding when auth is absent', () => {
      const mockRequest = {}

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toEqual({ req: mockRequest })
    })
  })
})

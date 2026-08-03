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
    test('Should map credentials to tenant.message for an authenticated request', () => {
      const mockRequest = {
        auth: {
          credentials: {
            profile: {
              sbi: 123456789,
              crn: 1234567890
            },
            sessionId: 'abc-session-123'
          }
        }
      }

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toMatchObject({
        tenant: {
          message: 'crn=******7890 sbi=123456789 session_id=abc-session-123'
        }
      })
      expect(result).not.toHaveProperty('event')
    })

    test('Should return only req binding for an unauthenticated request', () => {
      const mockRequest = { auth: {} }

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toEqual({ req: mockRequest })
      expect(result).not.toHaveProperty('tenant')
    })

    test('Should return only req binding when auth is absent', () => {
      const mockRequest = {}

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toEqual({ req: mockRequest })
    })

    test('Should return only req binding when profile is absent', () => {
      const mockRequest = {
        auth: {
          credentials: {
            sessionId: 'abc-session-123'
          }
        }
      }

      const result = loggerOptions.getChildBindings(mockRequest)

      expect(result).toEqual({ req: mockRequest })
    })
  })
})

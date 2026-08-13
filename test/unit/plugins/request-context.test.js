import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('../../../src/utils/mask-crn.js', () => ({
  maskCrn: vi.fn((crn) => `******${String(crn).slice(-4)}`)
}))

const { requestContext } = await import('../../../src/plugins/request-context.js')

describe('request-context', () => {
  let mockServer
  let capturedHandler
  let mockChildLogger
  let mockLogger

  beforeEach(() => {
    vi.clearAllMocks()
    mockChildLogger = { info: vi.fn() }
    mockLogger = { child: vi.fn().mockReturnValue(mockChildLogger) }
    mockServer = {
      ext: vi.fn((event, handler) => {
        capturedHandler = handler
      })
    }
    requestContext.plugin.register(mockServer)
  })

  test('registers onPreResponse extension', () => {
    expect(mockServer.ext).toHaveBeenCalledWith('onPreResponse', expect.any(Function))
  })

  test('creates child logger with event fields for authenticated request', () => {
    const mockRequest = {
      auth: {
        credentials: {
          crn: 1234567890,
          sbi: 123456789,
          sessionId: 'abc-session-123'
        }
      },
      logger: mockLogger
    }
    const mockH = { continue: Symbol('continue') }

    capturedHandler(mockRequest, mockH)

    expect(mockLogger.child).toHaveBeenCalledWith({
      event: {
        reference: 'crn-******7890',
        category: 'sbi-123456789',
        type: 'session_id-abc-session-123'
      }
    })
    expect(mockRequest.logger).toBe(mockChildLogger)
  })

  test('creates child logger with empty event fields for unauthenticated request', () => {
    const mockRequest = {
      auth: {},
      logger: mockLogger
    }
    const mockH = { continue: Symbol('continue') }

    capturedHandler(mockRequest, mockH)

    expect(mockLogger.child).toHaveBeenCalledWith({
      event: {
        reference: '',
        category: '',
        type: ''
      }
    })
  })

  test('continues without creating a child logger when logging is ignored', () => {
    const noOpLogger = { info: vi.fn(), error: vi.fn() }
    const mockRequest = { auth: {}, logger: noOpLogger }
    const mockH = { continue: Symbol('continue') }

    const result = capturedHandler(mockRequest, mockH)

    expect(result).toBe(mockH.continue)
    expect(mockRequest.logger).toBe(noOpLogger)
  })

  test('returns h.continue', () => {
    const mockRequest = { auth: {}, logger: mockLogger }
    const mockH = { continue: Symbol('continue') }

    const result = capturedHandler(mockRequest, mockH)

    expect(result).toBe(mockH.continue)
  })
})

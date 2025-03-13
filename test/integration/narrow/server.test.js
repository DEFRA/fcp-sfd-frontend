import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals'

describe('Application startup', () => {
  let originalEnv
  let mockServer
  let mockCreateServer
  let mockLogger
  let mockExit

  beforeEach(async () => {
    originalEnv = { ...process.env }

    mockServer = {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      info: { uri: 'http://localhost:3000' }
    }

    mockCreateServer = jest.fn().mockResolvedValue(mockServer)

    await jest.unstable_mockModule('../../../src/server.js', () => ({
      createServer: mockCreateServer
    }))

    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    }

    await jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
      createLogger: jest.fn().mockReturnValue(mockLogger)
    }))

    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

    jest.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv

    jest.clearAllMocks()
    mockExit.mockRestore()
  })

  test('server starts successfully', async () => {
    process.env.PORT = '3000'

    await import('../../../src/index.js')
    expect(mockCreateServer).toHaveBeenCalled()
    expect(mockServer.start).toHaveBeenCalled()
  })

  test('handles server startup errors', async () => {
    mockCreateServer.mockRejectedValueOnce(new Error('Server creation error'))

    try {
      await import('../../../src/index.js')
    } catch (error) {
      // In case index.js doesn't handle the error
    }
    expect(
      mockExit.mock.calls.some(call => call[0] === 1) ||
      mockLogger.error.mock.calls.length > 0
    ).toBe(true)
  })
})

// test/integration/narrow/routes/errors/service-unavailable.test.js
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals'

describe('Application startup', () => {
  let originalEnv
  let mockServer
  let mockCreateServer
  let mockLogger
  let mockExit

  beforeEach(async () => {
    // Save original environment variables
    originalEnv = { ...process.env }

    // Set up mocks before importing the modules
    mockServer = {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      info: { uri: 'http://localhost:3000' }
    }

    mockCreateServer = jest.fn().mockResolvedValue(mockServer)

    // Mock the server module
    await jest.unstable_mockModule('../../../src/server.js', () => ({
      createServer: mockCreateServer
    }))

    // Mock the logger module
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    }

    await jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
      createLogger: jest.fn().mockReturnValue(mockLogger)
    }))

    // Mock process.exit
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

    // Clear any cached modules
    jest.resetModules()
  })

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv

    // Clear all mocks
    jest.clearAllMocks()
    mockExit.mockRestore()
  })

  test('server starts successfully', async () => {
    // Set necessary environment variables
    process.env.PORT = '3000'

    // This will trigger the application startup with our mocks in place
    await import('../../../src/index.js')

    // Verify that createServer was called
    expect(mockCreateServer).toHaveBeenCalled()

    // Verify server.start() was called
    expect(mockServer.start).toHaveBeenCalled()
  })

  test('handles server startup errors', async () => {
    // Set up the createServer mock to reject
    mockCreateServer.mockRejectedValueOnce(new Error('Server creation error'))

    try {
      // Import index.js (this will execute it with our error-throwing mock)
      await import('../../../src/index.js')
    } catch (error) {
      // In case index.js doesn't handle the error
    }

    // Check that either process.exit(1) was called OR
    // an error was logged
    expect(
      mockExit.mock.calls.some(call => call[0] === 1) ||
      mockLogger.error.mock.calls.length > 0
    ).toBe(true)
  })
})

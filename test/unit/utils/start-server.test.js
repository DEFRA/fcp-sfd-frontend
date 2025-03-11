import { jest, describe, test, expect, beforeAll, beforeEach, afterAll, afterEach } from '@jest/globals'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()
const mockHapiLoggerInfo = jest.fn()
const mockHapiLoggerError = jest.fn()

const mockServer = {
  start: jest.fn().mockResolvedValue(),
  stop: jest.fn().mockResolvedValue(),
  logger: {
    info: mockHapiLoggerInfo,
    error: mockHapiLoggerError
  },
  events: {
    on: jest.fn(),
    once: jest.fn(),
    removeAllListeners: jest.fn()
  },
  listeners: jest.fn().mockReturnValue([]),
  removeAllListeners: jest.fn()
}

jest.unstable_mockModule('hapi-pino', () => ({
  register: (server) => {
    server.decorate('server', 'logger', {
      info: mockHapiLoggerInfo,
      error: mockHapiLoggerError
    })
  },
  name: 'mock-hapi-pino'
}))

jest.unstable_mockModule('@hapi/hapi', () => ({
  server: jest.fn().mockReturnValue(mockServer),
  default: {
    server: jest.fn().mockReturnValue(mockServer)
  }
}))

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

jest.unstable_mockModule('../../../src/server.js', () => ({
  createServer: jest.fn().mockResolvedValue(mockServer)
}))

const startServerModule = await import('../../../src/utils/start-server.js')
const serverModule = await import('../../../src/server.js')
const { config } = await import('../../../src/config/config.js')

describe('#startServer', () => {
  const PROCESS_ENV = process.env
  let server;

  beforeAll(() => {
    process.env = { ...PROCESS_ENV }
    process.env.PORT = '3097'
    config.set('port', '3097')
  })

  afterAll(() => {
    process.env = PROCESS_ENV
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
    process.removeAllListeners('SIGINT')
    process.removeAllListeners('SIGTERM')
    process.removeAllListeners('uncaughtException')
    process.removeAllListeners('unhandledRejection')
    
    jest.useRealTimers()
  })

  describe('When server starts', () => {
    test('Should start up server as expected', async () => {
      server = await startServerModule.startServer()

      expect(serverModule.createServer).toHaveBeenCalled()
      expect(mockServer.start).toHaveBeenCalled()
      expect(mockHapiLoggerInfo).toHaveBeenCalledWith('Server started successfully')
      expect(mockHapiLoggerInfo).toHaveBeenCalledWith('Access your frontend on http://localhost:3097')
    })
  })

  describe('When server start fails', () => {
    beforeEach(() => {
      serverModule.createServer.mockRejectedValueOnce(new Error('Server failed to start'))
    })

    test('Should log failed startup message', async () => {
      try {
        server = await startServerModule.startServer()
      } catch (error) {
      }

      expect(mockLoggerInfo).toHaveBeenCalledWith('Server failed to start :(')
      expect(mockLoggerError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Server failed to start' })
      )
    })
  })
})
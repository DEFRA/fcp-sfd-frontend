// Test framework dependencies
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'
import Hapi from '@hapi/hapi'

// Things we need to mock
const mockSts = { destroy: vi.fn() }

vi.mock('@aws-sdk/client-sts', () => ({
  STSClient: vi.fn(function () { return mockSts })
}))

// Thing under test
const { awsClients } = await import('../../../src/plugins/aws-clients.js')

describe('awsClients plugin', () => {
  let server
  const mockLogger = { info: vi.fn() }

  beforeEach(async () => {
    vi.clearAllMocks()

    server = Hapi.server()
    server.decorate('server', 'logger', mockLogger)
    await server.register(awsClients)
  })

  afterEach(async () => {
    await server.stop()
  })

  test('should name the plugin', () => {
    expect(awsClients.plugin.name).toBe('aws-clients')
  })

  test('should decorate the server with the STS client', () => {
    expect(server.sts).toBe(mockSts)
  })

  test('should decorate the request with the same STS client', async () => {
    server.route({
      method: 'GET',
      path: '/test',
      handler: (request, h) => h.response({ isSameClient: request.sts === mockSts })
    })

    const response = await server.inject({ method: 'GET', url: '/test' })

    expect(response.result).toEqual({ isSameClient: true })
  })

  test('should destroy the STS client when the server stops', async () => {
    await server.initialize()
    await server.stop()

    expect(mockSts.destroy).toHaveBeenCalledTimes(1)
    expect(mockLogger.info).toHaveBeenCalledWith('Closing AWS SDK clients')
  })
})

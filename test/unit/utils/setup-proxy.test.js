import { vi, describe, test, expect, beforeEach } from 'vitest'
import { config } from '../../../src/config/index.js'

const mockSetGlobalDispatcher = vi.fn()
const mockBootstrap = vi.fn()
const mockLoggerInfo = vi.fn()

vi.mock('undici', () => ({
  ProxyAgent: vi.fn(),
  setGlobalDispatcher: (...args) => mockSetGlobalDispatcher(...args)
}))

vi.mock('global-agent', () => ({
  bootstrap: () => mockBootstrap()
}))

vi.mock('../../../src/utils/logger.js', () => ({
  createLogger: () => ({
    info: mockLoggerInfo
  })
}))

describe('setupProxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    config.set('server.httpProxy', null)
    globalThis.GLOBAL_AGENT = {}
  })

  test('should not setup proxy when httpProxy is not set', async () => {
    const { setupProxy } = await import('../../../src/utils/setup-proxy.js')
    setupProxy()

    expect(mockLoggerInfo).not.toHaveBeenCalled()
    expect(mockSetGlobalDispatcher).not.toHaveBeenCalled()
    expect(mockBootstrap).not.toHaveBeenCalled()
  })

  test('should setup proxy when httpProxy is set', async () => {
    const proxyUrl = 'http://proxy.example.com'
    config.set('server.httpProxy', proxyUrl)

    const { setupProxy } = await import('../../../src/utils/setup-proxy.js')
    setupProxy()

    expect(mockLoggerInfo).toHaveBeenCalledWith('setting up global proxies')
    expect(mockSetGlobalDispatcher).toHaveBeenCalled()
    expect(mockBootstrap).toHaveBeenCalled()
    expect(globalThis.GLOBAL_AGENT.HTTP_PROXY).toBe(proxyUrl)
  })
})

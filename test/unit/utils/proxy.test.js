import { jest, describe, test, expect, beforeEach } from '@jest/globals'

const mockLogger = {
  debug: jest.fn()
}

class MockProxyAgent {
  constructor(options) {
    this.options = options
  }
}

const mockHttpsProxyAgent = jest.fn().mockImplementation((url) => {
  return { url }
})

// Setup mocks BEFORE imports
jest.mock('../../../src/utils/logger.js', () => {
  return {
    createLogger: () => mockLogger
  }
})

jest.mock('undici', () => {
  return {
    ProxyAgent: MockProxyAgent
  }
})

jest.mock('https-proxy-agent', () => {
  return {
    HttpsProxyAgent: mockHttpsProxyAgent
  }
})

global.fetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })))

import { config } from '../../../src/config/config.js'
import { provideProxy, proxyFetch } from '../../../src/utils/proxy.js'

const httpProxyUrl = 'http://proxy.example.com'
const httpsProxyUrl = 'https://proxy.example.com'
const httpPort = 80
const httpsPort = 443
const testUrl = 'https://example.com/api'
const testOptions = { method: 'GET', headers: { 'Content-Type': 'application/json' } }

describe('#proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    config.set('httpProxy', null)
    config.set('httpsProxy', null)
  })

  describe('#provideProxy', () => {
    describe('When a Proxy URL has not been set', () => {
      test('Should return null', () => {
        expect(provideProxy()).toBeNull()
      })

      test('Should not log anything', () => {
        provideProxy()
        expect(mockLogger.debug).not.toHaveBeenCalled()
      })
    })

    describe('When a HTTP Proxy URL has been set', () => {
      let result

      beforeEach(() => {
        config.set('httpProxy', httpProxyUrl)
        result = provideProxy()
      })

      test('Should set the correct port for HTTP', () => {
        expect(result).toHaveProperty('port', httpPort)
      })

      test('Should create the correct URL object', () => {
        expect(result.url.origin).toBe(httpProxyUrl)
      })
    })

    describe('When a HTTPS Proxy URL has been set', () => {
      let result

      beforeEach(() => {
        config.set('httpsProxy', httpsProxyUrl)
        result = provideProxy()
      })

      test('Should set the correct port for HTTPS', () => {
        expect(result).toHaveProperty('port', httpsPort)
      })
    })
  })

  describe('#proxyFetch', () => {
    describe('When no proxy is configured', () => {
      test('Should call fetch without a dispatcher', async () => {
        await proxyFetch(testUrl, testOptions)
        expect(global.fetch).toHaveBeenCalledWith(testUrl, testOptions)
      })
    })

    describe('When a proxy is configured', () => {
      beforeEach(() => {
        config.set('httpProxy', httpProxyUrl)
      })

      test('Should call fetch with the right URL and include a dispatcher', async () => {
        await proxyFetch(testUrl, testOptions)
        
        expect(global.fetch).toHaveBeenCalled()
        
        const fetchCall = global.fetch.mock.calls[0]
        const actualUrl = fetchCall[0]
        const actualOptions = fetchCall[1]
        
        expect(actualUrl).toBe(testUrl)
        
        expect(actualOptions.method).toBe(testOptions.method)
        expect(actualOptions.headers).toEqual(testOptions.headers)
        
        expect(actualOptions).toHaveProperty('dispatcher')
        
        expect(actualOptions.dispatcher).toBeTruthy()
      })
    })
  })
})
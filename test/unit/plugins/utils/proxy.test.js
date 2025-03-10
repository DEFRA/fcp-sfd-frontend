import fetchMock from 'jest-fetch-mock'
import { ProxyAgent } from 'undici'
import { jest } from '@jest/globals'
import { config } from '../../../../src/config/config.js'
import { provideProxy, proxyFetch } from '../../../../src/utils/proxy.js'

// Improved logger mock
const mockLogger = {
  debug: jest.fn()
}

jest.mock('../../../../src/utils/logger.js', () => ({
  createLogger: () => mockLogger
}))

const fetchSpy = jest.spyOn(global, 'fetch')
const httpProxyUrl = 'http://proxy.example.com'
const httpsProxyUrl = 'https://proxy.example.com'
const httpPort = 80
const httpsPort = 443

describe('#proxy', () => {
  beforeEach(() => {
    fetchMock.enableMocks()
    // Clear mock calls before each test
    mockLogger.debug.mockClear()
  })

  afterEach(() => {
    fetchMock.disableMocks()
    config.set('httpProxy', null)
    config.set('httpsProxy', null)
  })

  describe('#provideProxy', () => {
    describe('When a Proxy URL has not been set', () => {
      test('Should return null', () => {
        expect(provideProxy()).toBeNull()
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

      test('Should return expected HTTP Proxy object', () => {
        expect(result).toHaveProperty('url')
        expect(result).toHaveProperty('proxyAgent')
        expect(result).toHaveProperty('httpAndHttpsProxyAgent')
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

      test('Should return expected HTTPS Proxy object', () => {
        expect(result).toHaveProperty('url')
        expect(result).toHaveProperty('proxyAgent')
        expect(result).toHaveProperty('httpAndHttpsProxyAgent')
      })
    })
  })
})
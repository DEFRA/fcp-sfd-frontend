import { constants } from 'http2'

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { errors } from '../../../src/plugins/errors.js'
const { HTTP_STATUS_FORBIDDEN, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants

describe('errors', () => {
  test('should return an object', () => {
    expect(errors).toBeInstanceOf(Object)
  })

  test('should name the plugin', () => {
    expect(errors.plugin.name).toBe('errors')
  })

  test('should have a register function', () => {
    expect(errors.plugin.register).toBeInstanceOf(Function)
  })

  describe('errors plugin extension handler', () => {
    let mockViewResponse
    let mockH
    let mockRequest
    let mockServer
    let errorHandler

    beforeEach(() => {
      vi.clearAllMocks()

      mockViewResponse = {
        code: vi.fn().mockReturnThis(),
        header: vi.fn().mockReturnThis()
      }

      mockH = {
        view: vi.fn().mockReturnValue(mockViewResponse),
        continue: Symbol('continue')
      }

      mockRequest = {
        log: vi.fn(),
        response: {
          isBoom: true,
          output: { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR },
          headers: {
            'x-test': 'value',
            'content-type': 'application/json'
          },
          message: 'Test error'
        },
        headers: {
          referer: 'test/referer'
        }
      }

      mockServer = {
        ext: vi.fn().mockImplementation((event, handler) => {
          if (event === 'onPreResponse') {
            errorHandler = handler
          }
        })
      }

      errors.plugin.register(mockServer, {})
    })

    test('should register onPreResponse handler', () => {
      expect(mockServer.ext).toHaveBeenCalledWith('onPreResponse', expect.any(Function))
      expect(errorHandler).toBeDefined()
    })

    test('should preserve non-content headers if error code is HTTP_STATUS_INTERNAL_SERVER_ERROR', () => {
      const result = errorHandler(mockRequest, mockH)

      expect(mockViewResponse.header).toHaveBeenCalledWith('x-test', 'value')
      expect(mockViewResponse.header).not.toHaveBeenCalledWith('content-type', 'application/json')
      expect(result).toBe(mockViewResponse)
    })

    test('should preserve non-content headers if error code is HTTP_STATUS_FORBIDDEN', () => {
      mockRequest.response.output.statusCode = HTTP_STATUS_FORBIDDEN

      const result = errorHandler(mockRequest, mockH)

      expect(mockViewResponse.header).toHaveBeenCalledWith('x-test', 'value')
      expect(mockViewResponse.header).not.toHaveBeenCalledWith('content-type', 'application/json')
      expect(result).toBe(mockViewResponse)
    })

    test('should preserve non-content headers if error code is HTTP_STATUS_NOT_FOUND', () => {
      mockRequest.response.output.statusCode = HTTP_STATUS_NOT_FOUND

      const result = errorHandler(mockRequest, mockH)

      expect(mockViewResponse.header).toHaveBeenCalledWith('x-test', 'value')
      expect(mockViewResponse.header).not.toHaveBeenCalledWith('content-type', 'application/json')
      expect(result).toBe(mockViewResponse)
    })
  })
})

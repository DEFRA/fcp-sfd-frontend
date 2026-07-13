import { constants } from '@defra/fcp-sfd-frontend-engine'

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { errors } from '../../../src/plugins/errors.js'

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
          output: { statusCode: constants.statusCodes.INTERNAL_SERVER_ERROR },
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

    test('should preserve non-content headers if error code is INTERNAL_SERVER_ERROR', () => {
      const result = errorHandler(mockRequest, mockH)

      expect(mockViewResponse.header).toHaveBeenCalledWith('x-test', 'value')
      expect(mockViewResponse.header).not.toHaveBeenCalledWith('content-type', 'application/json')
      expect(result).toBe(mockViewResponse)
    })

    test('should preserve non-content headers if error code is FORBIDDEN', () => {
      mockRequest.response.output.statusCode = constants.statusCodes.FORBIDDEN

      const result = errorHandler(mockRequest, mockH)

      expect(mockViewResponse.header).toHaveBeenCalledWith('x-test', 'value')
      expect(mockViewResponse.header).not.toHaveBeenCalledWith('content-type', 'application/json')
      expect(result).toBe(mockViewResponse)
    })

    test('should preserve non-content headers if error code is NOT_FOUND', () => {
      mockRequest.response.output.statusCode = constants.statusCodes.NOT_FOUND

      const result = errorHandler(mockRequest, mockH)

      expect(mockViewResponse.header).toHaveBeenCalledWith('x-test', 'value')
      expect(mockViewResponse.header).not.toHaveBeenCalledWith('content-type', 'application/json')
      expect(result).toBe(mockViewResponse)
    })
  })
})

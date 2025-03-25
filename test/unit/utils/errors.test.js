import { StatusCodes } from 'http-status-codes'
import { catchAll } from '../../../src/utils/errors.js'
import { jest, describe, test, expect } from '@jest/globals'
// import { createServer } from '../../../src/server.js'

describe('#catchAll', () => {
  const mockErrorLogger = jest.fn()
  const mockStack = 'Mock error stack'
  const mockRequest = (statusCode) => ({
    response: {
      isBoom: true,
      stack: mockStack,
      output: {
        statusCode
      }
    },
    logger: { error: mockErrorLogger }
  })
  const mockToolkitView = jest.fn()
  const mockToolkitCode = jest.fn()
  const mockToolkit = {
    view: mockToolkitView.mockReturnThis(),
    code: mockToolkitCode.mockReturnThis()
  }

  test('Should provide expected "Service-unavailable" page', () => {
    catchAll(mockRequest(StatusCodes.SERVICE_UNAVAILABLE), mockToolkit)

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/service-unavailable', {})
    expect(mockToolkitCode).toHaveBeenCalledWith(
      StatusCodes.SERVICE_UNAVAILABLE
    )
  })
  test('Should NOT render service-unavailable page for INTERNAL_SERVER_ERROR', () => {
    catchAll(mockRequest(StatusCodes.INTERNAL_SERVER_ERROR), mockToolkit)
    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).not.toHaveBeenCalledWith('errors/service-unavailable', expect.anything())
    expect(mockToolkitCode).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  })

  test('Should provide expected service problem page and log error for internalServerError', () => {
    catchAll(
      mockRequest(StatusCodes.INTERNAL_SERVER_ERROR),
      mockToolkit
    )
    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/service-problem')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  })

  test('Should provide service problem page for other status codes (fallback)', () => {
    catchAll(mockRequest(StatusCodes.BAD_REQUEST), mockToolkit)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/service-problem')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST
    )
  })
})

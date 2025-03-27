import { StatusCodes } from 'http-status-codes'
import { catchAll } from '../../../src/utils/errors.js'
import { jest, beforeAll, describe, test, expect, afterAll } from '@jest/globals'

describe('#errors', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected Not Found page', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/non-existent-path'
    })

    expect(result).toEqual(
      expect.stringContaining('Page not found')
    )
    expect(statusCode).toBe(StatusCodes.NOT_FOUND)
  })
})

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

  test('Should provide expected "Not Found" page', () => {
    catchAll(mockRequest(StatusCodes.NOT_FOUND), mockToolkit)

    expect(mockErrorLogger).not.toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/page-not-found', {})
    expect(mockToolkitCode).toHaveBeenCalledWith(
      StatusCodes.NOT_FOUND
    )
  })
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

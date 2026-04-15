import { catchAll } from '../../../src/utils/errors.js'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  SERVICE_UNAVAILABLE
} from '../../../src/constants/status-codes.js'

describe('#catchAll', () => {
  const mockErrorLogger = vi.fn()
  const mockStack = 'Mock error stack'
  let mockToolkitView
  let mockToolkitCode
  let mockToolkit

  beforeEach(() => {
    vi.clearAllMocks()

    mockToolkitView = vi.fn().mockReturnThis()
    mockToolkitCode = vi.fn().mockReturnThis()

    mockToolkit = {
      view: mockToolkitView,
      code: mockToolkitCode,
      continue: Symbol('continue')
    }
  })

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

  test('Should provide expected "Service-unavailable" page', () => {
    catchAll(mockRequest(SERVICE_UNAVAILABLE), mockToolkit)

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/service-unavailable')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      SERVICE_UNAVAILABLE
    )
  })

  test('Should NOT render service-unavailable page for INTERNAL_SERVER_ERROR', () => {
    catchAll(mockRequest(INTERNAL_SERVER_ERROR), mockToolkit)

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).not.toHaveBeenCalledWith('errors/service-unavailable')
    expect(mockToolkitView).toHaveBeenCalledWith('errors/service-problem')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      INTERNAL_SERVER_ERROR
    )
  })

  test('Should provide expected service problem page and log error for internalServerError', () => {
    catchAll(
      mockRequest(INTERNAL_SERVER_ERROR),
      mockToolkit
    )

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/service-problem')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      INTERNAL_SERVER_ERROR
    )
  })

  test('Should provide expected page-not-found page and log error for NOT_FOUND', () => {
    catchAll(
      mockRequest(NOT_FOUND),
      mockToolkit
    )

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/page-not-found')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      NOT_FOUND
    )
  })

  test('Should provide page-not-found page for other status codes (fallback)', () => {
    catchAll(mockRequest(BAD_REQUEST), mockToolkit)

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith('errors/page-not-found')
    expect(mockToolkitCode).toHaveBeenCalledWith(
      BAD_REQUEST
    )
  })

  test('Should return h.continue when response is not a Boom error', () => {
    const result = catchAll({ response: {} }, mockToolkit)

    expect(result).toBe(mockToolkit.continue)
    expect(mockToolkitView).not.toHaveBeenCalled()
    expect(mockToolkitCode).not.toHaveBeenCalled()
  })

  test('Should return h.continue when there is no response', () => {
    const result = catchAll({}, mockToolkit)

    expect(result).toBe(mockToolkit.continue)
    expect(mockToolkitView).not.toHaveBeenCalled()
    expect(mockToolkitCode).not.toHaveBeenCalled()
  })
})

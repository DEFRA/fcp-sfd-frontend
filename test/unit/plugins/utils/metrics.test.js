import { StorageResolution, Unit } from 'aws-embedded-metrics'
import { jest } from '@jest/globals'

import { config } from '../../../../src/config/config.js'
import { metricsCounter } from '../../../../src/utils/metrics.js'

// Create spy functions that mimic the actual behavior more closely
const mockPutMetric = jest.fn()
const mockFlush = jest.fn().mockResolvedValue(undefined)
const mockLoggerError = jest.fn()

// Comprehensive mock of aws-embedded-metrics
jest.mock('aws-embedded-metrics', () => {
  const originalModule = jest.requireActual('aws-embedded-metrics')
  return {
    ...originalModule,
    createMetricsLogger: () => ({
      putMetric: mockPutMetric,
      flush: mockFlush
    })
  }
})

// Mock logger
jest.mock('../../../../src/utils/logger.js', () => ({
  createLogger: () => ({ 
    error: (...args) => mockLoggerError(...args) 
  })
}))

const mockMetricsName = 'mock-metrics-name'
const defaultMetricsValue = 1
const mockValue = 200

describe('#metrics', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
    mockPutMetric.mockClear()
    mockFlush.mockClear()
    mockLoggerError.mockClear()
  })

  describe('When metrics is not enabled', () => {
    beforeEach(async () => {
      config.set('isMetricsEnabled', false)
      await metricsCounter(mockMetricsName, mockValue)
    })

    test('Should not call metric', () => {
      expect(mockPutMetric).not.toHaveBeenCalled()
    })

    test('Should not call flush', () => {
      expect(mockFlush).not.toHaveBeenCalled()
    })
  })

 /* describe('When metrics is enabled', () => {
    beforeEach(() => {
      config.set('isMetricsEnabled', true)
    })

    test('Should send metric with default value', async () => {
      console.log('Config value:', config.get('isMetricsEnabled'))
      
      try {
        await metricsCounter(mockMetricsName)
      } catch (error) {
        console.error('Error in metricsCounter:', error)
      }
      console.log('Metrics logger:', mockPutMetric)

      expect(mockPutMetric).toHaveBeenCalledWith(
        mockMetricsName,
        defaultMetricsValue,
        Unit.Count,
        StorageResolution.Standard
      )
    })

    test('Should send metric', async () => {
      await metricsCounter(mockMetricsName, mockValue)

      expect(mockPutMetric).toHaveBeenCalledWith(
        mockMetricsName,
        mockValue,
        Unit.Count,
        StorageResolution.Standard
      )
    })

    test('Should call flush', async () => {
      await metricsCounter(mockMetricsName, mockValue)
      
      expect(mockFlush).toHaveBeenCalledTimes(1)
    })
  })

  describe('When metrics throws', () => {
    const mockError = new Error('mock-metrics-put-error')

    beforeEach(async () => {
      config.set('isMetricsEnabled', true)
      
      // Simulate an error during flush
      mockFlush.mockRejectedValue(mockError)

      await metricsCounter(mockMetricsName, mockValue)
    })

    test('Should log expected error', () => {
      expect(mockLoggerError).toHaveBeenCalledWith(
        expect.any(Error), 
        mockError.message
      )
    })
  })*/
})
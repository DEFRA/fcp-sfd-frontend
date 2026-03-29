// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'

// Things we need to mock
const mockDalConnector = vi.fn()

vi.mock('../../../../src/dal/connector.js', () => ({
  getDalConnector: vi.fn(() => mockDalConnector)
}))

describe('updateDalService', () => {
  const mutation = 'updateBusinessName'
  const variables = { input: { name: 'Amazing Business Ltd', sbi: '123456789' } }
  const sessionId = 'test-session-123'
  let responseData

  beforeEach(() => {
    vi.clearAllMocks()
    responseData = {
      data: {
        updateBusinessName: {
          sbi: '123456789',
          name: 'Amazing Business Ltd'
        }
      }
    }
  })

  describe('when dalConnector resolves successfully', () => {
    beforeEach(() => {
      mockDalConnector.mockResolvedValue(responseData)
    })

    test('it calls dalConnector with the correct arguments', async () => {
      await updateDalService(mutation, variables, sessionId)

      expect(mockDalConnector).toHaveBeenCalledTimes(1)
      expect(mockDalConnector).toHaveBeenCalledWith(mutation, variables, sessionId)
    })

    test('it calls dalConnector with undefined sessionId when sessionId is not provided', async () => {
      await updateDalService(mutation, variables)

      expect(mockDalConnector).toHaveBeenCalledTimes(1)
      expect(mockDalConnector).toHaveBeenCalledWith(mutation, variables, undefined)
    })

    test('it returns the DAL response', async () => {
      const result = await updateDalService(mutation, variables, sessionId)

      expect(result).toEqual(responseData)
    })
  })

  describe('when dalConnector returns an error', () => {
    beforeEach(() => {
      mockDalConnector.mockResolvedValue({ errors: ['Some DAL error'] })
    })

    test('it throws an error', async () => {
      await expect(updateDalService(mutation, variables, sessionId)).rejects.toThrow('DAL error from mutation')
    })
  })
})

// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalDetailsService } from '../../../../src/services/personal/fetch-personal-details-service.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-personal-details.js'

// Thing under test
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service.js'

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-details-service.js', () => ({
  fetchPersonalDetailsService: vi.fn()
}))

describe('fetchPersonalChangeService', () => {
  const data = { ...mappedData } // clone to avoid mutation
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      get: vi.fn()
    }

    credentials = {
      crn: '987654321',
      email: 'test@example.com'
    }
  })

  describe('when called for a field with no temporary change', () => {
    beforeEach(() => {
      fetchPersonalDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({})
    })

    test('it returns the original data', async () => {
      const result = await fetchPersonalChangeService(yar, credentials, 'changePersonalName')

      expect(fetchPersonalDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual(data)
    })
  })

  describe('when called for a field with a temporary change in session', () => {
    beforeEach(() => {
      fetchPersonalDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({ changePersonalName: 'New personal name' })
    })

    test('it returns the data with the session change merged in', async () => {
      const result = await fetchPersonalChangeService(yar, credentials, 'changePersonalName')

      expect(fetchPersonalDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({ ...data, changePersonalName: 'New personal name' })
    })
  })

  describe('when called for a different field (e.g., changePersonalEmail)', () => {
    beforeEach(() => {
      fetchPersonalDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({ changePersonalEmail: 'new@email.com' })
    })

    test('it merges the correct field from session', async () => {
      const result = await fetchPersonalChangeService(yar, credentials, 'changePersonalEmail')

      expect(fetchPersonalDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({ ...data, changePersonalEmail: 'new@email.com' })
    })
  })
})

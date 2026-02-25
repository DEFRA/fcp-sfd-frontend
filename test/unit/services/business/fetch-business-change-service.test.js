// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { getMappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessChangeService', () => {
  const data = getMappedData()
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      get: vi.fn()
    }

    credentials = {
      sbi: '123456789',
      crn: '987654321',
      email: 'test@example.com'
    }
  })

  describe('when called for a field with no temporary change', () => {
    beforeEach(() => {
      fetchBusinessDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({})
    })

    test('it returns the original data', async () => {
      const result = await fetchBusinessChangeService(yar, credentials, 'changeBusinessName')

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual(data)
    })
  })

  describe('when called for a field with a temporary change in session', () => {
    beforeEach(() => {
      fetchBusinessDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({ changeBusinessName: 'New business name ltd' })
    })

    test('it returns the data with the session change merged in', async () => {
      const result = await fetchBusinessChangeService(yar, credentials, 'changeBusinessName')

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({ ...data, changeBusinessName: 'New business name ltd' })
    })
  })

  describe('when called for a different field (e.g., changeBusinessEmail)', () => {
    beforeEach(() => {
      fetchBusinessDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({ changeBusinessEmail: 'new@email.com' })
    })

    test('it merges the correct field from session', async () => {
      const result = await fetchBusinessChangeService(yar, credentials, 'changeBusinessEmail')

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({ ...data, changeBusinessEmail: 'new@email.com' })
    })
  })

  describe('when called with multiple fields', () => {
    beforeEach(() => {
      fetchBusinessDetailsService.mockResolvedValue(data)
      yar.get.mockReturnValue({
        changeBusinessName: 'Updated Ltd',
        changeBusinessEmail: 'updated@email.com'
      })
    })

    test('it merges all matching session fields into the data', async () => {
      const result = await fetchBusinessChangeService(
        yar,
        credentials,
        ['changeBusinessName', 'changeBusinessEmail']
      )

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({
        ...data,
        changeBusinessName: 'Updated Ltd',
        changeBusinessEmail: 'updated@email.com'
      })
    })

    test('it only merges the fields specified in the array', async () => {
      const result = await fetchBusinessChangeService(
        yar,
        credentials,
        ['changeBusinessName']
      )

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({
        ...data,
        changeBusinessName: 'Updated Ltd'
      })
    })
  })
})

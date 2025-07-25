// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details'

// Thing under test
import { fetchBusinessAddressChangeService } from '../../../../src/services/business/fetch-business-address-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessAddressChangeService', () => {
  const data = mappedData
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      set: vi.fn()
    }
  })

  describe('when called', () => {
    describe('and there is no changed address', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue(data)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessAddressChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({
          ...data,
          changeBusinessAddress: {
            address1: '76 Robinswood Road',
            address2: 'UPPER CHUTE',
            city: null,
            country: 'United Kingdom',
            county: null,
            postcode: 'CO9 3LS'
          }
        })
      })
    })

    describe('and there is a changed address', () => {
      beforeEach(() => {
        const newAddress = {
          address1: 'A different address',
          address2: '',
          city: 'Maidstone',
          county: 'A new county',
          postcode: 'BA123 ABC',
          country: 'United Kingdom'
        }

        mappedData.changeBusinessAddress = newAddress
        data.changeBusinessAddress = newAddress

        fetchBusinessDetailsService.mockResolvedValue(mappedData)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessAddressChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual(data)
      })
    })
  })
})

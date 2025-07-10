import { describe, test, expect, beforeEach, vi } from 'vitest'
import { fetchBusinessAddressChangeService } from '../../../../src/services/business/fetch-business-address-change-service.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'
import { mappedData } from '../../../mocks/mock-business-details'

vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessAddressChangeService', () => {
  const data = mappedData
  let yar

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when called', () => {
    describe('and there is no changed address', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          address1: '76 Robinswood Road',
          address2: 'UPPER CHUTE',
          city: null,
          country: 'United Kingdom',
          county: null,
          postcode: 'CO9 3LS'
        }

        yar = {
          get: vi.fn().mockReturnValue(mappedData)
        }
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessAddressChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.get).toHaveBeenCalledWith('businessDetails')
        expect(result).toEqual(data)
      })
    })

    describe('and there is is a changed address', () => {
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

        yar = {
          get: vi.fn().mockReturnValue(mappedData)
        }
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessAddressChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.get).toHaveBeenCalledWith('businessDetails')
        expect(result).toEqual(data)
      })
    })
  })
})

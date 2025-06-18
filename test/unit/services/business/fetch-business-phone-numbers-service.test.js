// Test framework dependencies
import { describe, test, expect, vi } from 'vitest'

// Thing under test
import { fetchBusinessPhoneNumbersService } from '../../../../src/services/business/fetch-business-phone-numbers-service.js'

const mockYar = { get: vi.fn() }

describe('fetchBusinessPhoneNumbersService', () => {
  describe('when called', () => {
    test('it returns business numbers when there is no change business numbers', async () => {
      mockYar.get.mockReturnValue({
        businessTelephone: 'mock-business-telephone',
        businessMobile: 'mock-business-mobile'
      })

      const result = await fetchBusinessPhoneNumbersService(mockYar)

      expect(result).toEqual({
        businessTelephone: 'mock-business-telephone',
        businessMobile: 'mock-business-mobile'
      })
    })

    test('it returns change business numbers when there is a change business number', async () => {
      mockYar.get.mockReturnValue({
        businessTelephone: 'mock-business-telephone',
        businessMobile: 'mock-business-mobile',
        changeBusinessTelephone: 'mock-change-business-telephone',
        changeBusinessMobile: 'mock-change-business-mobile'
      })
      const result = await fetchBusinessPhoneNumbersService(mockYar)

      expect(result).toEqual({
        businessTelephone: 'mock-change-business-telephone',
        businessMobile: 'mock-change-business-mobile'
      })
    })

    test('it returns change business numbers when there is only one change business number', async () => {
      mockYar.get.mockReturnValue({
        businessTelephone: 'mock-business-telephone',
        businessMobile: 'mock-business-mobile',
        changeBusinessMobile: 'mock-change-business-mobile'
      })
      const result = await fetchBusinessPhoneNumbersService(mockYar)

      expect(result).toEqual({
        businessTelephone: undefined,
        businessMobile: 'mock-change-business-mobile'
      })
    })
  })
})

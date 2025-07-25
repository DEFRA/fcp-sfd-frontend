// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details'

// Thing under test
import { fetchBusinessPhoneNumbersChangeService } from '../../../../src/services/business/fetch-business-phone-numbers-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

describe('fetchBusinessPhoneNumbersChangeService', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      set: vi.fn()
    }

    data = mappedData
  })

  describe('when called', () => {
    describe('and there is no changed phone numbers', () => {
      beforeEach(() => {
        fetchBusinessDetailsService.mockResolvedValue(data)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessPhoneNumbersChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({ ...data, changeBusinessMobile: null, changeBusinessTelephone: '01234031859' })
      })
    })

    describe('and there is a changed mobile', () => {
      beforeEach(() => {
        const newMobile = '01111 111111'

        mappedData.changeBusinessMobile = newMobile
        data.changeBusinessMobile = newMobile

        fetchBusinessDetailsService.mockResolvedValue(mappedData)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessPhoneNumbersChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({ ...data, changeBusinessTelephone: '01234031859' })
      })
    })

    describe('and there is a changed telephone', () => {
      beforeEach(() => {
        const newTelephone = '02222 222222'

        mappedData.changeBusinessTelephone = newTelephone
        data.changeBusinessTelephone = newTelephone

        fetchBusinessDetailsService.mockResolvedValue(mappedData)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessPhoneNumbersChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({ ...data, changeBusinessMobile: '01111 111111' })
      })
    })

    describe('and the changed mobile is null', () => {
      beforeEach(() => {
        const newMobile = null

        mappedData.changeBusinessMobile = newMobile
        data.changeBusinessMobile = newMobile

        fetchBusinessDetailsService.mockResolvedValue(mappedData)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessPhoneNumbersChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({ ...data, changeBusinessTelephone: '02222 222222' })
      })
    })

    describe('and the changed telephone is null', () => {
      beforeEach(() => {
        const newTelephone = null

        mappedData.changeBusinessTelephone = newTelephone
        data.changeBusinessTelephone = newTelephone

        fetchBusinessDetailsService.mockResolvedValue(mappedData)
      })

      test('it returns the correct data', async () => {
        const result = await fetchBusinessPhoneNumbersChangeService(yar)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(yar)
        expect(yar.set).toHaveBeenCalled(data)
        expect(result).toEqual({ ...data, changeBusinessMobile: null })
      })
    })
  })
})

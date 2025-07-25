// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessPhoneNumbersChangeService } from '../../../../src/services/business/update-business-phone-numbers-change-service'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

describe('updateBusinessPhoneNumbersChangeService', () => {
  let yar
  let request

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      set: vi.fn().mockReturnValue()
    }
    request = { yar }
  })

  describe('when called', () => {
    describe('and the changeBusinessNumbers are null', async () => {
      beforeEach(() => {
        mappedData.changeBusinessMobile = null
        mappedData.changeBusinessTelephone = null

        fetchBusinessDetailsService.mockReturnValue(mappedData)
      })

      test('it correctly saves the data to the session', async () => {
        await updateBusinessPhoneNumbersChangeService(request)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(request)
        expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
      })

      test('adds a flash notification confirming the change in data', async () => {
        await updateBusinessPhoneNumbersChangeService(request)

        expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business phone numbers')
      })
    })

    describe('and the changeBusinessNumbers are not null', async () => {
      beforeEach(() => {
        mappedData.changeBusinessMobile = '01111 111111'
        mappedData.changeBusinessTelephone = '02222 222222'

        fetchBusinessDetailsService.mockReturnValue(mappedData)
      })

      test('it correctly saves the data to the session', async () => {
        await updateBusinessPhoneNumbersChangeService(request)

        expect(fetchBusinessDetailsService).toHaveBeenCalled(request)
        expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
      })

      test('adds a flash notification confirming the change in data', async () => {
        await updateBusinessPhoneNumbersChangeService(request)

        expect(flashNotification).toHaveBeenCalledWith(yar, 'Success', 'You have updated your business phone numbers')
      })
    })
  })
})

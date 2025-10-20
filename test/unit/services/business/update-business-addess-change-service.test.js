// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchBusinessChangeService } from '../../../../src/services/business/fetch-business-change-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updateBusinessAddressMutation } from '../../../../src/dal/mutations/business/update-business-address.js'
import { getUserSessionToken } from '../../../../src/utils/get-user-session-token.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessAddressChangeService } from '../../../../src/services/business/update-business-address-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-change-service', () => ({
  fetchBusinessChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updateBusinessAddressChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changeBusinessAddress = {
      address1: 'A different address',
      city: 'Maidstone',
      postcode: 'BA123 ABC',
      country: 'United Kingdom'
    }

    fetchBusinessChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { sbi: '123456789', crn: '987654321' }
  })

  describe('when called with a manually entered address', () => {
    test('it fetches business details from the service', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(fetchBusinessChangeService).toHaveBeenCalledWith(yar, credentials, getUserSessionToken, 'changeBusinessAddress')
    })

    test('it calls the updateDalService with correct mutation and variables', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessAddressMutation, {
        input: {
          sbi: '107183280',
          address: {
            withoutUprn: {
              buildingNumberRange: null,
              buildingName: null,
              flatName: null,
              street: null,
              city: 'Maidstone',
              county: null,
              postalCode: 'BA123 ABC',
              country: 'United Kingdom',
              line1: 'A different address',
              line2: null,
              line3: null,
              line4: 'Maidstone',
              line5: null,
              uprn: null
            }
          }
        }
      }, getUserSessionToken)
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(
        yar,
        'Success',
        'You have updated your business address'
      )
    })

    test('it clears businessDetails from session', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('businessDetails')
    })
  })

  describe('when called with a lookup (UPRN) address', () => {
    beforeEach(() => {
      mappedData.changeBusinessAddress = {
        uprn: '1234567890',
        buildingName: 'Test House',
        city: 'London',
        postcode: 'W1A 1AA',
        country: 'United Kingdom'
      }
    })

    test('it calls the updateDalService with correct lookup variables', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updateBusinessAddressMutation, {
        input: {
          sbi: '107183280',
          address: {
            withUprn: {
              buildingNumberRange: null,
              buildingName: 'Test House',
              flatName: null,
              street: null,
              city: 'London',
              county: null,
              postalCode: 'W1A 1AA',
              country: 'United Kingdom',
              dependentLocality: null,
              doubleDependentLocality: null,
              line1: null,
              line2: null,
              line3: null,
              line4: null,
              line5: null,
              uprn: '1234567890'
            }
          }
        }
      }, getUserSessionToken)
    })
  })
})

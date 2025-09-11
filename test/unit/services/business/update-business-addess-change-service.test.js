// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { dalConnector } from '../../../../src/dal/connector.js'
import { updateBusinessAddressMutation } from '../../../../src/dal/mutations/update-business-address.js'
import { fetchBusinessDetailsService } from '../../../../src/services/business/fetch-business-details-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-business-details.js'

// Thing under test
import { updateBusinessAddressChangeService } from '../../../../src/services/business/update-business-address-change-service.js'

// Mocks
vi.mock('../../../../src/services/business/fetch-business-details-service', () => ({
  fetchBusinessDetailsService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/dal/connector.js', () => ({
  dalConnector: vi.fn().mockResolvedValue({
    data: {
      updateBusinessAddress: {
        business: {
          info: {
            address: {}
          }
        }
      }
    }
  })
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

    fetchBusinessDetailsService.mockReturnValue(mappedData)

    yar = {
      set: vi.fn().mockReturnValue()
    }
    credentials = { sbi: '123456789', crn: '987654321' }
  })

  describe('when called with a manually entered address', () => {
    test('it correctly saves the data to the session', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(fetchBusinessDetailsService).toHaveBeenCalledWith(yar, credentials)
      expect(yar.set).toHaveBeenCalledWith('businessDetails', mappedData)
    })

    test('it calls the dalConnector with correct mutation and variables', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(dalConnector).toHaveBeenCalledWith(updateBusinessAddressMutation, {
        input: {
          sbi: '107183280',
          address: {
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
      })
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(
        yar,
        'Success',
        'You have updated your business address'
      )
    })

    test('it removes changeBusinessAddress after mapping', async () => {
      const details = fetchBusinessDetailsService()

      await updateBusinessAddressChangeService(yar, credentials)

      expect(details.changeBusinessAddress).toBeUndefined()
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

    test('it calls the dalConnector with correct lookup variables', async () => {
      await updateBusinessAddressChangeService(yar, credentials)

      expect(dalConnector).toHaveBeenCalledWith(updateBusinessAddressMutation, {
        input: {
          sbi: '107183280',
          address: {
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
      })
    })
  })

  describe('when an update fails', () => {
    beforeEach(() => {
      dalConnector.mockResolvedValue({
        errors: [{
          message: 'Failed to update'
        }]
      })
    })

    test('rejects with "DAL error from mutation"', async () => {
      await expect(updateBusinessAddressChangeService(yar, credentials))
        .rejects.toThrow('DAL error from mutation')
    })
  })
})

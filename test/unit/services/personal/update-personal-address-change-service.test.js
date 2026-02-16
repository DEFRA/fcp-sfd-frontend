// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Things we need to mock
import { fetchPersonalChangeService } from '../../../../src/services/personal/fetch-personal-change-service'
import { flashNotification } from '../../../../src/utils/notifications/flash-notification.js'
import { updateDalService } from '../../../../src/services/DAL/update-dal-service.js'
import { updatePersonalAddressMutation } from '../../../../src/dal/mutations/personal/update-personal-address.js'

// Test helpers
import { mappedData } from '../../../mocks/mock-personal-details.js'

// Thing under test
import { updatePersonalAddressChangeService } from '../../../../src/services/personal/update-personal-address-change-service.js'

// Mocks
vi.mock('../../../../src/services/personal/fetch-personal-change-service', () => ({
  fetchPersonalChangeService: vi.fn()
}))

vi.mock('../../../../src/utils/notifications/flash-notification.js', () => ({
  flashNotification: vi.fn()
}))

vi.mock('../../../../src/services/DAL/update-dal-service.js', () => ({
  updateDalService: vi.fn().mockResolvedValue({})
}))

describe('updatePersonalAddressChangeService', () => {
  let yar
  let credentials

  beforeEach(() => {
    vi.clearAllMocks()

    mappedData.changePersonalAddress = {
      address1: 'A different address',
      city: 'Maidstone',
      postcode: 'BA123 ABC',
      country: 'United Kingdom'
    }

    fetchPersonalChangeService.mockReturnValue(mappedData)

    yar = {
      clear: vi.fn()
    }

    credentials = { crn: '987654321', sbi: '123456789', sessionId: 'test-session-id' }
  })

  describe('when called with a manually entered address', () => {
    test('it fetches personal details from the service', async () => {
      await updatePersonalAddressChangeService(yar, credentials)

      expect(fetchPersonalChangeService).toHaveBeenCalledWith(yar, credentials, 'changePersonalAddress')
    })

    test('it calls the updateDalService with correct mutation and variables', async () => {
      await updatePersonalAddressChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updatePersonalAddressMutation, {
        input: {
          crn: '123456890',
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
      }, credentials.sessionId)
    })

    test('adds a flash notification confirming the change in data', async () => {
      await updatePersonalAddressChangeService(yar, credentials)

      expect(flashNotification).toHaveBeenCalledWith(
        yar,
        'Success',
        'You have updated your personal address'
      )
    })

    test('it clears personalDetailsUpdate from session', async () => {
      await updatePersonalAddressChangeService(yar, credentials)

      expect(yar.clear).toHaveBeenCalledWith('personalDetailsUpdate')
    })
  })

  describe('when called with a lookup (UPRN) address', () => {
    beforeEach(() => {
      mappedData.changePersonalAddress = {
        uprn: '1234567890',
        buildingName: 'Test House',
        city: 'London',
        postcode: 'W1A 1AA',
        country: 'United Kingdom'
      }
    })

    test('it calls the updateDalService with correct lookup variables', async () => {
      await updatePersonalAddressChangeService(yar, credentials)

      expect(updateDalService).toHaveBeenCalledWith(updatePersonalAddressMutation, {
        input: {
          crn: '123456890',
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
      }, credentials.sessionId)
    })
  })
})

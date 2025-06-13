// Test framework dependencies
import { describe, test, expect, vi, beforeEach } from 'vitest'

// Thing under test
import { setSessionDataService } from '../../../src/services/set-session-data-service.js'

describe('setSessionDataService', () => {
  describe('when called with a payload, key and value', () => {
    let payload
    let key
    let value
    let yar

    beforeEach(() => {
      vi.clearAllMocks()

      const sessionData = {
        businessAddressEnterData: {
          businessName: 'Diddly Squat Farm',
          businessAddress: {
            address1: '10 Skirbeck Way',
            city: 'Maidstone',
            postcode: 'SK22 1DL',
            country: 'United Kingdom'
          }
        }
      }

      // Mock yar session manager
      yar = {
        get: (key) => sessionData[key],
        set: (key, value) => { sessionData[key] = value }
      }

      payload = {
        address1: 'Diddly Squat Farm',
        city: 'Chipping Norton',
        country: 'United Kingdom'
      }

      key = 'businessAddressEnterData'
      value = 'businessAddress'
    })

    test('it sets the payload on the yar session object using the value', () => {
      setSessionDataService(payload, yar, key, value)

      const result = yar.get(key)

      expect(result).toEqual({
        businessName: 'Diddly Squat Farm',
        businessAddress: {
          address1: 'Diddly Squat Farm',
          city: 'Chipping Norton',
          country: 'United Kingdom'
        }
      })
    })

    test('returns the updated session object', () => {
      const result = setSessionDataService(payload, yar, key, value)

      expect(result).toEqual({
        businessName: 'Diddly Squat Farm',
        businessAddress: {
          address1: 'Diddly Squat Farm',
          city: 'Chipping Norton',
          country: 'United Kingdom'
        }
      })
    })
  })
})

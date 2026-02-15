// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { setBusinessFixSessionDataService } from '../../../../src/services/business/set-business-fix-session-data-service.js'

describe('setBusinessFixSessionDataService', () => {
  let yar
  let sessionData
  let payload

  beforeEach(() => {
    vi.clearAllMocks()

    yar = {
      set: vi.fn()
    }

    sessionData = {
      orderedSectionsToFix: ['name', 'email']
    }

    payload = {
      businessName: 'New Business Name',
      businessEmail: 'john.doe@example.com'
    }
  })

  test('maps payload fields into businessFixUpdates based on section order', () => {
    setBusinessFixSessionDataService(yar, sessionData, payload)

    expect(sessionData.businessFixUpdates).toEqual({
      name: {
        businessName: 'New Business Name'
      },
      email: {
        businessEmail: 'john.doe@example.com'
      }
    })
  })

  test('defaults missing payload fields to empty strings', () => {
    payload = {
      businessName: 'New Business Name'
    }

    setBusinessFixSessionDataService(yar, sessionData, payload)

    expect(sessionData.businessFixUpdates).toEqual({
      name: {
        businessName: 'New Business Name'
      },
      email: {
        businessEmail: ''
      }
    })
  })

  test('stores the updated session data using yar.set', () => {
    setBusinessFixSessionDataService(yar, sessionData, payload)

    expect(yar.set).toHaveBeenCalledWith(
      'businessDetailsValidation',
      sessionData
    )
  })
})

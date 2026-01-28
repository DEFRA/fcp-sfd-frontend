// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { setPersonalFixSessionDataService } from '../../../../src/services/personal/set-personal-fix-session-data-service.js'

describe('setPersonalFixSessionDataService', () => {
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
      first: 'John',
      last: 'Doe',
      personalEmail: 'john.doe@example.com'
    }
  })

  test('maps payload fields into personalFixUpdates based on section order', () => {
    setPersonalFixSessionDataService(yar, sessionData, payload)

    expect(sessionData.personalFixUpdates).toEqual({
      name: {
        first: 'John',
        middle: '',
        last: 'Doe'
      },
      email: {
        personalEmail: 'john.doe@example.com'
      }
    })
  })

  test('defaults missing payload fields to empty strings', () => {
    payload = {
      first: 'John'
    }

    setPersonalFixSessionDataService(yar, sessionData, payload)

    expect(sessionData.personalFixUpdates).toEqual({
      name: {
        first: 'John',
        middle: '',
        last: ''
      },
      email: {
        personalEmail: ''
      }
    })
  })

  test('stores the updated session data using yar.set', () => {
    setPersonalFixSessionDataService(yar, sessionData, payload)

    expect(yar.set).toHaveBeenCalledWith(
      'personalDetailsValidation',
      sessionData
    )
  })
})

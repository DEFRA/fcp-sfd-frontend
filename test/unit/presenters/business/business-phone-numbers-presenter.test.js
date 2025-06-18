// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { businessPhoneNumberPresenter } from '../../../../src/presenters/business/business-phone-numbers-presenter.js'

describe('businessPhoneNumbersPresenter', () => {
  describe('when provided with phone number data', () => {
    const data = {
      businessTelephone: '999',
      businessMobile: '911'
    }
    test('it correctly presents the data', () => {
      const result = businessPhoneNumberPresenter(data)

      expect(result).toEqual({
        businessTelephone: '999',
        businessMobile: '911',
      })
    })
  })

  describe('when provided with incomplete data', () => {
    const data = {}
    test('it returns data with empty values', () => {
      const result = businessPhoneNumberPresenter(data)

      expect(result).toEqual({
        businessTelephone: '',
        businessMobile: '',
      })
    })
  })
})

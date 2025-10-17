// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalAddressChangePresenter } from '../../../../src/presenters/personal/personal-address-change-presenter.js'

describe('personalAddressChangePresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          fullNameJoined: 'Mr Test Name'
        }
      },
      address: { postcode: 'SK22 1DL' },
      changePersonalPostcode: {}
    }
  })

  describe('when provided with personal address change data', () => {
    test('it correctly presents the data', () => {
      const result = personalAddressChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your personal address?',
        metaDescription: 'Update the address for your personal account.',
        postcode: 'SK22 1DL',
        userName: 'Mr Test Name'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.fullNameJoined
      })

      test('it should return userName as null', () => {
        const result = personalAddressChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "postcode" property', () => {
    describe('when provided with a changed personal postcode', () => {
      beforeEach(() => {
        data.changePersonalPostcode.postcode = 'NEW 123'
      })

      test('it should return the changed postcode as the postcode', () => {
        const result = personalAddressChangePresenter(data)

        expect(result.postcode).toEqual(data.changePersonalPostcode.postcode)
      })
    })

    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = 'NEW 321'
      })

      test('it should return the payload as the personal postcode', () => {
        const result = personalAddressChangePresenter(data, payload)

        expect(result.postcode).toEqual(payload)
      })
    })
  })
})

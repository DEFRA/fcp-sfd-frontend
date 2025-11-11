// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalAddressCheckPresenter } from '../../../../src/presenters/personal/personal-address-check-presenter.js'

describe('personalAddressCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          first: 'Test',
          last: 'Name'
        },
        userName: 'Test Name'
      },
      address: {
        address1: '10 Skirbeck Way',
        address2: 'Lonely Lane',
        city: 'Maidstone',
        county: 'Somerset',
        postcode: 'SK22 1DL',
        country: 'United Kingdom'
      }
    }
  })

  describe('when provided with personal address check data', () => {
    test('it correctly presents the data', () => {
      const result = personalAddressCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-address-enter' },
        changeLink: '/account-address-enter',
        pageTitle: 'Check your personal address is correct before submitting',
        metaDescription: 'Check the address for your personal account is correct.',
        address: [
          '10 Skirbeck Way',
          'Lonely Lane',
          'Maidstone',
          'Somerset',
          'SK22 1DL',
          'United Kingdom'
        ],
        userName: 'Test Name'
      })
    })
  })

  describe('the "address" property', () => {
    describe('when provided with a changePersonalAddress thats entered manually', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          postcodeLookup: false,
          address1: 'A different address',
          city: 'Maidstone',
          county: 'A new county',
          postcode: 'BA123 ABC',
          country: 'United Kingdom'
        }
      })

      test('it should return the changed address as the address', () => {
        const result = personalAddressCheckPresenter(data)

        expect(result.address).toEqual([
          'A different address',
          'Maidstone',
          'A new county',
          'BA123 ABC',
          'United Kingdom'
        ])
      })
    })

    describe('when provided with a changePersonalAddress thats entered from the postcode lookup', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          postcodeLookup: true,
          uprn: '100000111111',
          displayAddress: 'Flat 3, Fake Court, 18, Maple Road, Westfield, Bristol, BS1 4AB',
          address1: 'A newer address',
          city: 'Maidstone nowhere',
          county: 'A new county',
          postcode: 'BA12 CBA',
          country: 'United Kingdom'
        }
      })

      test('it should return the changed address as the address', () => {
        const result = personalAddressCheckPresenter(data)

        expect(result.address).toEqual([
          'A newer address',
          'Maidstone nowhere',
          'A new county',
          'BA12 CBA',
          'United Kingdom'
        ])
      })
    })
  })

  describe('the "backLink" property', () => {
    describe('when postcode lookup is true', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          postcodeLookup: true
        }
      })

      test('it should return backLink as "/account-address-select"', () => {
        const result = personalAddressCheckPresenter(data)

        expect(result.backLink).toEqual({ href: '/account-address-select' })
      })
    })

    describe('when postcode lookup is false', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          postcodeLookup: false
        }
      })

      test('it should return backLink as "/account-address-enter"', () => {
        const result = personalAddressCheckPresenter(data)

        expect(result.backLink).toEqual({ href: '/account-address-enter' })
      })
    })
  })

  describe('the "changeLink" property', () => {
    describe('when postcode lookup is true', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          postcodeLookup: true
        }
      })

      test('it should return changeLink as "/account-address-change"', () => {
        const result = personalAddressCheckPresenter(data)

        expect(result.changeLink).toEqual('/account-address-change')
      })
    })

    describe('when postcode lookup is false', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          postcodeLookup: false
        }
      })

      test('it should return changeLink as "/account-address-enter"', () => {
        const result = personalAddressCheckPresenter(data)

        expect(result.changeLink).toEqual('/account-address-enter')
      })
    })
  })
})

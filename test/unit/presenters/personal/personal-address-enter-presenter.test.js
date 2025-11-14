// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalAddressEnterPresenter } from '../../../../src/presenters/personal/personal-address-enter-presenter.js'

describe('personalAddressEnterPresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      info: {
        userName: 'Test Name',
        fullName: {
          first: 'Test',
          last: 'Name'
        }
      },
      address: {
        lookup: {},
        manual: {
          line1: '10 Skirbeck Way',
          line2: 'Lonely Lane',
          line3: 'Child Okeford',
          line4: 'Maidstone',
          line5: 'Somerset'
        },
        city: 'Maidstone',
        postcode: 'SK22 1DL',
        country: 'United Kingdom'
      }
    }
  })

  describe('when provided with personal address enter data', () => {
    test('it correctly presents the data', () => {
      const result = personalAddressEnterPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-address-change' },
        pageTitle: 'Enter your personal address',
        metaDescription: 'Enter the address for your personal account.',
        address: {
          address1: '10 Skirbeck Way',
          address2: 'Lonely Lane',
          address3: 'Child Okeford',
          city: 'Maidstone',
          country: 'United Kingdom',
          county: 'Somerset',
          postcode: 'SK22 1DL'
        },
        userName: 'Test Name'
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.userName
      })

      test('it should return userName as null', () => {
        const result = personalAddressEnterPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "address" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = {
          address1: 'A new new address',
          city: 'New Address City',
          county: 'A new new county',
          postcode: 'BA123 NEW',
          country: 'United Kingdom'
        }
      })

      test('it should return the changed address as the address', () => {
        const result = personalAddressEnterPresenter(data, payload)

        expect(result.address).toEqual(payload)
      })
    })

    describe('when provided with a changed personal address without UPRN', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          address1: 'A different address',
          city: 'Maidstone',
          county: 'A new county',
          postcode: 'BA123 ABC',
          country: 'United Kingdom'
        }
      })

      test('it should return the changed address as-is', () => {
        const result = personalAddressEnterPresenter(data)

        expect(result.address).toEqual(data.changePersonalAddress)
      })
    })

    describe('when provided with a changed personal address with UPRN', () => {
      describe('and there are values missing', () => {
        beforeEach(() => {
          data.changePersonalAddress = {
            uprn: '123456',
            flatName: null,
            buildingName: null,
            buildingNumberRange: null,
            street: null,
            city: null,
            county: null,
            postcode: null,
            country: null
          }
        })

        test('it should format the changed address correctly', () => {
          const result = personalAddressEnterPresenter(data)

          expect(result.address).toEqual({
            address1: null,
            address2: null,
            address3: null,
            city: null,
            county: null,
            country: null,
            postcode: null
          })
        })
      })

      describe('and there are no values missing', () => {
        beforeEach(() => {
          data.changePersonalAddress = {
            uprn: '123456',
            flatName: 'Flat 1A',
            buildingName: 'Rosewood Court',
            buildingNumberRange: '120-124',
            street: 'High Street',
            city: 'Bristol',
            county: 'Somerset',
            postcode: 'BS1 2AB',
            country: 'United Kingdom'
          }
        })

        test('it should format the changed address correctly', () => {
          const result = personalAddressEnterPresenter(data)

          expect(result.address).toEqual({
            address1: 'Flat 1A, Rosewood Court, 120-124',
            address2: 'High Street',
            address3: null,
            city: 'Bristol',
            county: 'Somerset',
            country: 'United Kingdom',
            postcode: 'BS1 2AB'
          })
        })
      })
    })

    describe('when provided with an original personal address with UPRN', () => {
      describe('and there are no values missing', () => {
        beforeEach(() => {
          delete data.changePersonalAddress
        })

        test('it should format the original address correctly', () => {
          const result = personalAddressEnterPresenter(data)

          expect(result.address).toEqual({
            address1: '10 Skirbeck Way',
            address2: 'Lonely Lane',
            address3: 'Child Okeford',
            city: 'Maidstone',
            country: 'United Kingdom',
            county: 'Somerset',
            postcode: 'SK22 1DL'
          })
        })
      })

      describe('and there are values missing', () => {
        beforeEach(() => {
          data.address = {
            lookup: {
              uprn: '123456'
            },
            manual: {},
            postcode: null,
            country: null
          }
        })

        test('it should format the original address correctly', () => {
          const result = personalAddressEnterPresenter(data)

          expect(result.address).toEqual({
            address1: null,
            address2: null,
            address3: null,
            city: null,
            country: null,
            county: null,
            postcode: null
          })
        })
      })
    })

    describe('when provided with an original personal address without UPRN', () => {
      beforeEach(() => {
        data.address = {
          lookup: {
            uprn: '123456',
            flatName: 'Flat 1A',
            buildingName: 'Rosewood Court',
            buildingNumberRange: '120-124',
            street: 'High Street',
            city: 'Bristol'
          },
          postcode: 'BS1 2AB',
          country: 'United Kingdom'
        }
      })

      test('it should format the original address correctly', () => {
        const result = personalAddressEnterPresenter(data)

        expect(result.address).toEqual({
          address1: 'Flat 1A, Rosewood Court, 120-124',
          address2: 'High Street',
          address3: null,
          city: 'Bristol',
          county: null,
          country: 'United Kingdom',
          postcode: 'BS1 2AB'
        })
      })
    })

    describe('when no existing address is provided', () => {
      beforeEach(() => {
        delete data.address.manual.line1
        delete data.address.manual.line2
        delete data.address.manual.line3
        delete data.address.manual.line4
        delete data.address.manual.line5
        delete data.address.postcode
        delete data.address.country
      })

      test('it should return the address fields as null', () => {
        const result = personalAddressEnterPresenter(data)

        expect(result.address).toEqual({
          address1: null,
          address2: null,
          address3: null,
          city: null,
          county: null,
          country: null,
          postcode: null
        })
      })
    })
  })
})

// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressCheckPresenter } from '../../../../src/presenters/business/business-address-check-presenter.js'

describe('businessAddressCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        businessName: 'Agile Farm Ltd',
        sbi: '123456789'
      },
      customer: {
        userName: 'Alfred Waldron'
      },
      address: {
        lookup: {
          pafOrganisationName: null,
          buildingNumberRange: null,
          flatName: null,
          buildingName: null,
          dependentLocality: null,
          doubleDependentLocality: null,
          street: null,
          county: null,
          uprn: null
        },
        manual: {
          line1: '10 Skirbeck Way',
          line2: 'Lonely Lane',
          line3: null,
          line4: 'Somerset',
          line5: null
        },
        city: 'Maidstone',
        postcode: 'SK22 1DL',
        country: 'United Kingdom'
      }
    }
  })

  describe('when provided with business address check data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-address-enter' },
        changeLink: '/business-address-enter',
        pageTitle: 'Check your business address is correct before submitting',
        metaDescription: 'Check the address for your business is correct.',
        address: [
          '10 Skirbeck Way',
          'Lonely Lane',
          'Maidstone',
          'Somerset',
          'SK22 1DL',
          'United Kingdom'
        ],
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        userName: 'Alfred Waldron'
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.info.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete data.info.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.customer.userName
      })

      test('it should return userName as null', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "address" property', () => {
    describe('when provided with a changeBusinessAddress thats entered manually', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          postcodeLookup: false,
          address1: 'A different address',
          city: 'Maidstone',
          county: 'A new county',
          postcode: 'BA123 ABC',
          country: 'United Kingdom'
        }
      })

      test('it should return the changed address as the address', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.address).toEqual([
          'A different address',
          'Maidstone',
          'A new county',
          'BA123 ABC',
          'United Kingdom'
        ])
      })
    })

    describe('when provided with a changeBusinessAddress thats entered from the postcode lookup', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
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
        const result = businessAddressCheckPresenter(data)

        expect(result.address).toEqual([
          'A newer address',
          'Maidstone nowhere',
          'A new county',
          'BA12 CBA',
          'United Kingdom'
        ])
      })
    })

    describe('when there is no pending change in the session', () => {
      describe('and the mapped business address was selected from the postcode lookup', () => {
        beforeEach(() => {
          data.address = {
            lookup: {
              pafOrganisationName: null,
              buildingNumberRange: '18',
              flatName: 'Flat 3',
              buildingName: 'Fake Court',
              dependentLocality: null,
              doubleDependentLocality: null,
              street: 'Maple Road',
              county: 'Bristol',
              uprn: '100000111111'
            },
            manual: {
              line1: null,
              line2: null,
              line3: null,
              line4: null,
              line5: null
            },
            city: 'Westfield',
            postcode: 'BS1 4AB',
            country: 'United Kingdom'
          }
        })

        test('it formats the nested DAL address as a flat array of strings', () => {
          const result = businessAddressCheckPresenter(data)

          expect(result.address).toEqual([
            'Flat 3',
            'Fake Court',
            '18 Maple Road',
            'Westfield',
            'Bristol',
            'BS1 4AB',
            'United Kingdom'
          ])
        })

        test('it does not render any address line as "[object Object]"', () => {
          const result = businessAddressCheckPresenter(data)

          expect(result.address.every((line) => typeof line === 'string')).toBe(true)
        })
      })
    })
  })

  describe('the "backLink" property', () => {
    describe('when postcode lookup is true', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          postcodeLookup: true
        }
      })

      test('it should return backLink as "/business-address-select"', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.backLink).toEqual({ href: '/business-address-select' })
      })
    })

    describe('when postcode lookup is false', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          postcodeLookup: false
        }
      })

      test('it should return backLink as "/business-address-enter"', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.backLink).toEqual({ href: '/business-address-enter' })
      })
    })
  })

  describe('the "changeLink" property', () => {
    describe('when postcode lookup is true', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          postcodeLookup: true
        }
      })

      test('it should return changeLink as "/business-address-change"', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.changeLink).toEqual('/business-address-change')
      })
    })

    describe('when postcode lookup is false', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          postcodeLookup: false
        }
      })

      test('it should return changeLink as "/business-address-enter"', () => {
        const result = businessAddressCheckPresenter(data)

        expect(result.changeLink).toEqual('/business-address-enter')
      })
    })
  })
})

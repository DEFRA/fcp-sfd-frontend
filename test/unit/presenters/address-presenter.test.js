// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { addressPresenter } from '../../../src/presenters/address-presenter.js'

describe('address presenter', () => {
  describe('#formatAddress', () => {
    let address

    beforeEach(async () => {
      address = {
        lookup: {
          flatName: 'THE COACH HOUSE',
          buildingNumberRange: '7',
          buildingName: 'STOCKWELL HALL',
          street: 'HAREWOOD AVENUE',
          county: 'Dorset',
          city: 'DARLINGTON',
          uprn: '12345'
        },
        manual: {
          line1: '76 Robinswood Road',
          line2: 'UPPER CHUTE',
          line3: 'Child Okeford',
          line4: null,
          line5: null
        },
        postcode: 'CO9 3LS',
        country: 'United Kingdom'
      }
    })

    describe('when the address is a lookup address', () => {
      test('it should combine building number range and street and include all lookup fields in order', () => {
        const result = addressPresenter.formatAddress(address)

        expect(result).toStrictEqual([
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          '7 HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ])
      })

      test('it should leave street unchanged if building number is missing', () => {
        address.lookup.buildingNumberRange = null
        const result = addressPresenter.formatAddress(address)

        expect(result).toStrictEqual([
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          'HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ])
      })
    })

    describe('when the address is a manual address', () => {
      test('it should use manual lines in order, filtering out nulls, and append city, postcode, country', () => {
        address.lookup.uprn = null
        const result = addressPresenter.formatAddress(address)

        expect(result).toStrictEqual([
          '76 Robinswood Road',
          'UPPER CHUTE',
          'Child Okeford',
          'CO9 3LS',
          'United Kingdom'
        ])
      })

      test('it should handle optional line4 and line5 correctly', () => {
        address.lookup.uprn = null
        address.manual.line4 = 'Optional Line 4'
        address.manual.line5 = null

        const result = addressPresenter.formatAddress(address)

        expect(result).toStrictEqual([
          '76 Robinswood Road',
          'UPPER CHUTE',
          'Child Okeford',
          'Optional Line 4',
          'CO9 3LS',
          'United Kingdom'
        ])
      })
    })
  })
})

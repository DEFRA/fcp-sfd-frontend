// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { basePresenter } from '../../../src/presenters/base-presenter.js'

describe('basePresenter', () => {
  describe('#formatNumber', () => {
    let payload
    let changedNumber
    let originalNumber

    describe('when provided with a payload, changeNumber and original number', () => {
      beforeEach(() => {
        payload = '01234 111111'
        changedNumber = '01111 111111'
        originalNumber = '02222 222222'
      })

      test('it should return the payload', () => {
        const result = basePresenter.formatNumber(payload, changedNumber, originalNumber)

        expect(result).toBe('01234 111111')
      })
    })

    describe('when provided with a changed number and an original number', () => {
      beforeEach(() => {
        payload = undefined
        changedNumber = '01111 111111'
        originalNumber = '02222 222222'
      })

      test('it should return the changed number', () => {
        const result = basePresenter.formatNumber(payload, changedNumber, originalNumber)

        expect(result).toBe('01111 111111')
      })
    })

    describe('when provided only with an original number', () => {
      beforeEach(() => {
        payload = undefined
        changedNumber = undefined
        originalNumber = '02222 222222'
      })

      test('it should return the original number', () => {
        const result = basePresenter.formatNumber(payload, changedNumber, originalNumber)

        expect(result).toBe('02222 222222')
      })
    })
  })

  describe('#formatAddress', () => {
    let address

    beforeEach(() => {
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
        const result = basePresenter.formatAddress(address)

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

      test('it should leave street unchanged if building number range is missing', () => {
        address.lookup.buildingNumberRange = null
        const result = basePresenter.formatAddress(address)

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
      test('it should use manual lines in order, filtering out nulls, and append postcode and country', () => {
        address.lookup.uprn = null
        const result = basePresenter.formatAddress(address)

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

        const result = basePresenter.formatAddress(address)

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

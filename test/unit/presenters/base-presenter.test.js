// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import {
  formatBackLink,
  formatFullName,
  formatDisplayAddress,
  formatNumber,
  formatOriginalAddress,
  formatChangedAddress,
  formatDisplayAddresses
} from '../../../src/presenters/base-presenter.js'

describe('basePresenter', () => {
  describe('#formatBackLink', () => {
    let businessName

    describe('when the businessName property is less than 50 characters', () => {
      beforeEach(() => {
        businessName = 'Acme Farms Ltd'
      })

      test('it should return the text "Back to Acme Farms Ltd"', () => {
        const result = formatBackLink(businessName)
        expect(result).toEqual('Back to Acme Farms Ltd')
      })
    })

    describe('when the businessName property is greater than 50 characters', () => {
      beforeEach(() => {
        businessName = 'This is a very long business name that exceeds 50 characters'
      })

      test('it should return the text truncated with an ellipsis', () => {
        const result = formatBackLink(businessName)
        expect(result).toEqual('Back to This is a very long business name that exceeds 50 …')
      })
    })
  })

  describe('#formatFullName', () => {
    let fullName

    describe('when provided with a full name', () => {
      beforeEach(() => {
        fullName = {
          first: 'Alfred',
          middle: 'M',
          last: 'Waldron'
        }
      })

      test('it should return the full name as a string', () => {
        const result = formatFullName(fullName)

        expect(result).toBe('Alfred M Waldron')
      })
    })

    describe('when provided with a full name that has no middle names', () => {
      beforeEach(() => {
        fullName = {
          first: 'Alfred',
          middle: '',
          last: 'Waldron'
        }
      })

      test('it should return the full name as a string', () => {
        const result = formatFullName(fullName)

        expect(result).toBe('Alfred Waldron')
      })
    })
  })

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
        const result = formatNumber(payload, changedNumber, originalNumber)

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
        const result = formatNumber(payload, changedNumber, originalNumber)

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
        const result = formatNumber(payload, changedNumber, originalNumber)

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
        const result = formatDisplayAddress(address)

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
        const result = formatDisplayAddress(address)

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
        const result = formatDisplayAddress(address)

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

        const result = formatDisplayAddress(address)

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

  describe('#formatOriginalAddress', () => {
    let originalAddress

    beforeEach(() => {
      originalAddress = {
        lookup: {},
        manual: {
          line1: '10 Skirbeck Way',
          line2: 'Lonely Lane',
          line3: 'Child Okeford',
          line4: 'Maidstone',
          line5: 'Somerset'
        },
        postcode: 'SK22 1DL',
        country: 'United Kingdom'
      }
    })

    describe('when the original address has a UPRN (lookup address)', () => {
      beforeEach(() => {
        originalAddress.lookup = {
          uprn: '123456',
          flatName: 'Flat 1A',
          buildingName: 'Rosewood Court',
          buildingNumberRange: '120-124',
          street: 'High Street',
          city: 'Bristol',
          county: 'Somerset'
        }
      })

      test('it should format the lookup address correctly', () => {
        const result = formatOriginalAddress(originalAddress)

        expect(result).toEqual({
          address1: 'Flat 1A, Rosewood Court, 120-124',
          address2: 'High Street',
          address3: null,
          city: 'Bristol',
          county: 'Somerset',
          country: 'United Kingdom',
          postcode: 'SK22 1DL'
        })
      })

      test('it should handle missing lookup fields gracefully', () => {
        originalAddress.lookup = { uprn: '123456' }
        const result = formatOriginalAddress(originalAddress)

        expect(result).toEqual({
          address1: null,
          address2: null,
          address3: null,
          city: null,
          county: null,
          country: 'United Kingdom',
          postcode: 'SK22 1DL'
        })
      })
    })

    describe('when the original address has no UPRN (manual address)', () => {
      beforeEach(() => {
        originalAddress.lookup.uprn = null
      })

      test('it should format the manual address correctly', () => {
        const result = formatOriginalAddress(originalAddress)

        expect(result).toEqual({
          address1: '10 Skirbeck Way',
          address2: 'Lonely Lane',
          address3: 'Child Okeford',
          city: 'Maidstone',
          county: 'Somerset',
          country: 'United Kingdom',
          postcode: 'SK22 1DL'
        })
      })

      test('it should handle missing manual lines gracefully', () => {
        originalAddress.manual = {}
        const result = formatOriginalAddress(originalAddress)

        expect(result).toEqual({
          address1: null,
          address2: null,
          address3: null,
          city: null,
          county: null,
          country: 'United Kingdom',
          postcode: 'SK22 1DL'
        })
      })
    })
  })

  describe('#formatChangedAddress', () => {
    let changeBusinessAddress

    describe('when the changed address has a UPRN (lookup address)', () => {
      beforeEach(() => {
        changeBusinessAddress = {
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

      test('it should format the lookup address correctly', () => {
        const result = formatChangedAddress(changeBusinessAddress)

        expect(result).toEqual({
          address1: 'Flat 1A, Rosewood Court, 120-124',
          address2: 'High Street',
          address3: null,
          city: 'Bristol',
          county: 'Somerset',
          country: 'United Kingdom',
          postcode: 'BS1 2AB'
        })
      })

      test('it should handle missing fields gracefully', () => {
        changeBusinessAddress = { uprn: '123456' }
        const result = formatChangedAddress(changeBusinessAddress)

        expect(result).toEqual({
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

    describe('when the changed address has no UPRN (manual address)', () => {
      beforeEach(() => {
        changeBusinessAddress = {
          address1: 'A manual address',
          city: 'Bath',
          county: 'Somerset',
          postcode: 'BA1 1AA',
          country: 'United Kingdom'
        }
      })

      test('it should return the address as-is', () => {
        const result = formatChangedAddress(changeBusinessAddress)

        expect(result).toEqual(changeBusinessAddress)
      })
    })
  })

  describe('#formatDisplayAddresses', () => {
    let addresses
    let previouslyPickedAddress

    beforeEach(() => {
      addresses = [
        { uprn: '111', displayAddress: '1 Main Street, London, SW1A 1AA' },
        { uprn: '222', displayAddress: '2 High Road, Bristol, BS1 4ST' }
      ]
      previouslyPickedAddress = null
    })

    test('it should return formatted addresses with correct values and text', () => {
      const result = formatDisplayAddresses(addresses, previouslyPickedAddress)

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual({
        value: '1111 Main Street, London, SW1A 1AA',
        text: '1 Main Street, London, SW1A 1AA',
        selected: false
      })
      expect(result[2]).toEqual({
        value: '2222 High Road, Bristol, BS1 4ST',
        text: '2 High Road, Bristol, BS1 4ST',
        selected: false
      })
    })

    test('it should prepend a summary row showing the correct number of addresses', async () => {
      const result = formatDisplayAddresses(addresses, previouslyPickedAddress)

      expect(result[0]).toEqual({
        value: 'display',
        text: '2 addresses found',
        selected: true
      })
    })

    test('it should show "1 address found" if only one address exists', async () => {
      const result = formatDisplayAddresses([addresses[0]], previouslyPickedAddress)

      expect(result[0]).toEqual({
        value: 'display',
        text: '1 address found',
        selected: true
      })
    })

    test('it should mark the previously picked address as selected', async () => {
      previouslyPickedAddress = { uprn: '222', displayAddress: '2 High Road, Bristol, BS1 4ST' }

      const result = formatDisplayAddresses(addresses, previouslyPickedAddress)

      expect(result[2].selected).toEqual(true)
      expect(result[0].selected).toBe(false)
    })

    test('it should leave summary row selected if no address matches the previously picked address', async () => {
      previouslyPickedAddress = { uprn: '999', displayAddress: 'Nonexistent Address' }

      const result = formatDisplayAddresses(addresses, previouslyPickedAddress)

      expect(result[0].selected).toBe(true)
      expect(result[1].selected).toBe(false)
      expect(result[2].selected).toBe(false)
    })
  })
})

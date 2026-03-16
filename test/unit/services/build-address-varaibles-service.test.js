// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildUprnAddress, buildManualAddress } from '../../../src/services/build-address-variables-service.js'

describe('buildAddressVariablesService', () => {
  describe('#buildUprnAddress', () => {
    let change

    describe('when all address fields are provided', () => {
      beforeEach(() => {
        change = {
          pafOrganisationName: 'Test Org',
          buildingNumberRange: '10-12',
          buildingName: 'Test Building',
          flatName: 'Flat 1',
          street: 'Test Street',
          city: 'London',
          county: 'Greater London',
          postcode: 'SW1A 1AA',
          country: 'England',
          dependentLocality: 'Westminster',
          doubleDependentLocality: 'Central',
          uprn: '123456789'
        }
      })

      test('returns a fully mapped DAL address object', () => {
        const result = buildUprnAddress(change)

        expect(result).toEqual({
          pafOrganisationName: 'Test Org',
          buildingNumberRange: '10-12',
          buildingName: 'Test Building',
          flatName: 'Flat 1',
          street: 'Test Street',
          city: 'London',
          county: 'Greater London',
          postalCode: 'SW1A 1AA',
          country: 'England',
          dependentLocality: 'Westminster',
          doubleDependentLocality: 'Central',
          line1: null,
          line2: null,
          line3: null,
          line4: null,
          line5: null,
          uprn: '123456789'
        })
      })
    })

    describe('when optional address fields are undefined', () => {
      beforeEach(() => {
        change = {
          postcode: 'SW1A 1AA',
          country: 'England',
          uprn: '123456789'
        }
      })

      test('normalizes optional fields to null', () => {
        const result = buildUprnAddress(change)

        expect(result).toEqual({
          pafOrganisationName: null,
          buildingNumberRange: null,
          buildingName: null,
          flatName: null,
          street: null,
          city: null,
          county: null,
          postalCode: 'SW1A 1AA',
          country: 'England',
          dependentLocality: null,
          doubleDependentLocality: null,
          line1: null,
          line2: null,
          line3: null,
          line4: null,
          line5: null,
          uprn: '123456789'
        })
      })
    })

    describe('when optional fields are explicitly null', () => {
      beforeEach(() => {
        change = {
          pafOrganisationName: null,
          street: null,
          postcode: 'SW1A 1AA',
          country: 'England',
          uprn: '123456789'
        }
      })

      test('preserves null values', () => {
        const result = buildUprnAddress(change)

        expect(result.pafOrganisationName).toBeNull()
        expect(result.street).toBeNull()
        expect(result.postalCode).toBe('SW1A 1AA')
      })
    })
  })

  describe('#buildManualAddress', () => {
    let change

    describe('when a full manual address is provided', () => {
      beforeEach(() => {
        change = {
          address1: '123 Test Street',
          address2: 'Apartment 4',
          address3: 'Business Park',
          county: 'Somerset',
          city: 'Bath',
          postcode: 'BA1 1AA',
          country: 'England'
        }
      })

      test('returns a correctly mapped DAL address object', () => {
        const result = buildManualAddress(change)

        expect(result).toEqual({
          pafOrganisationName: null,
          buildingNumberRange: null,
          buildingName: null,
          flatName: null,
          street: null,
          dependentLocality: null,
          doubleDependentLocality: null,
          county: null,
          uprn: null,
          line1: '123 Test Street',
          line2: 'Apartment 4',
          line3: 'Business Park',
          line4: 'Somerset',
          line5: null,
          city: 'Bath',
          postalCode: 'BA1 1AA',
          country: 'England'
        })
      })
    })

    describe('when optional address lines are undefined', () => {
      beforeEach(() => {
        change = {
          address1: '123 Test Street',
          city: 'Bath',
          postcode: 'BA1 1AA',
          country: 'England'
        }
      })

      test('normalizes optional fields to null', () => {
        const result = buildManualAddress(change)

        expect(result).toEqual({
          pafOrganisationName: null,
          buildingNumberRange: null,
          buildingName: null,
          flatName: null,
          street: null,
          dependentLocality: null,
          doubleDependentLocality: null,
          county: null,
          uprn: null,
          line1: '123 Test Street',
          line2: null,
          line3: null,
          line4: null,
          line5: null,
          city: 'Bath',
          postalCode: 'BA1 1AA',
          country: 'England'
        })
      })
    })

    describe('when optional fields are provided as null', () => {
      beforeEach(() => {
        change = {
          address1: '123 Test Street',
          address2: null,
          address3: null,
          county: null,
          city: 'Bath',
          postcode: 'BA1 1AA',
          country: 'England'
        }
      })

      test('preserves null values', () => {
        const result = buildManualAddress(change)

        expect(result.line2).toBeNull()
        expect(result.line3).toBeNull()
        expect(result.line4).toBeNull()
      })
    })
  })
})

// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { addressLookupMapper } from '../../../src/mappers/address-lookup-mapper.js'

describe('address lookup mapper', () => {
  const addresses = [
    {
      properties: {
        UPRN: '100012345678',
        ADDRESS: 'LIFE 4 CUTS, 14, BRUSHFIELD STREET, LONDON, E1 6AN',
        ORGANISATION_NAME: 'LIFE 4 CUTS',
        DEPARTMENT_NAME: 'Hairdressing Department',
        SUB_BUILDING_NAME: 'Suite 2',
        BUILDING_NAME: 'The Brushfield Building',
        BUILDING_NUMBER: '14',
        DEPENDENT_THOROUGHFARE_NAME: 'Brushfield Lane',
        THOROUGHFARE_NAME: 'BRUSHFIELD STREET',
        DOUBLE_DEPENDENT_LOCALITY: 'Spitalfields',
        DEPENDENT_LOCALITY: 'London Borough of Tower Hamlets',
        POST_TOWN: 'LONDON',
        POSTCODE: 'E1 6AN',
        LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'CITY OF LONDON',
        COUNTRY_CODE: 'E'
      }
    }
  ]

  test('it maps a full OS Places address correctly', () => {
    const results = addressLookupMapper(addresses)

    expect(results).toEqual([
      {
        displayAddress: 'LIFE 4 CUTS, 14, BRUSHFIELD STREET, LONDON, E1 6AN',
        buildingName: 'LIFE 4 CUTS, Hairdressing Department, The Brushfield Building',
        flatName: 'Suite 2',
        buildingNumberRange: '14',
        street: 'Brushfield Lane, BRUSHFIELD STREET',
        dependentLocality: 'London Borough of Tower Hamlets',
        doubleDependentLocality: 'Spitalfields',
        city: 'LONDON',
        county: 'CITY OF LONDON',
        postcode: 'E1 6AN',
        country: 'England',
        uprn: '100012345678'
      }
    ])
  })

  describe('when the address has optional fields', () => {
    beforeEach(() => {
      delete addresses[0].properties.ORGANISATION_NAME
      delete addresses[0].properties.DEPARTMENT_NAME
      delete addresses[0].properties.SUB_BUILDING_NAME
      delete addresses[0].properties.BUILDING_NAME
      delete addresses[0].properties.BUILDING_NUMBER
      delete addresses[0].properties.DEPENDENT_THOROUGHFARE_NAME
      delete addresses[0].properties.THOROUGHFARE_NAME
      delete addresses[0].properties.DOUBLE_DEPENDENT_LOCALITY
      delete addresses[0].properties.DEPENDENT_LOCALITY
    })

    test('it handles optional fields correctly', () => {
      const results = addressLookupMapper(addresses)

      expect(results).toEqual([
        {
          displayAddress: 'LIFE 4 CUTS, 14, BRUSHFIELD STREET, LONDON, E1 6AN',
          buildingName: null,
          flatName: null,
          buildingNumberRange: null,
          street: null,
          dependentLocality: null,
          doubleDependentLocality: null,
          city: 'LONDON',
          county: 'CITY OF LONDON',
          postcode: 'E1 6AN',
          country: 'England',
          uprn: '100012345678'
        }
      ])
    })
  })

  describe('when the local custodian code is "ORDNANCE SURVEY"', () => {
    beforeEach(() => {
      addresses[0].properties.LOCAL_CUSTODIAN_CODE_DESCRIPTION = 'ORDNANCE SURVEY'
    })

    test('it sets the county to null', () => {
      const results = addressLookupMapper(addresses)

      expect(results[0].county).toEqual(null)
    })
  })

  describe('when the local custodian code is the same as the post town', () => {
    beforeEach(() => {
      addresses[0].properties.LOCAL_CUSTODIAN_CODE_DESCRIPTION = 'LONDON'
    })

    test('it sets the county to null', () => {
      const results = addressLookupMapper(addresses)

      expect(results[0].county).toEqual(null)
    })
  })

  describe('when an address fails schema validation', () => {
    beforeEach(() => {
      delete addresses[0].properties.UPRN
    })

    test('it skips invalid addresses', () => {
      const results = addressLookupMapper(addresses)

      expect(results).toEqual([])
    })
  })

  describe('when multiple addresses include invalid ones', () => {
    beforeEach(() => {
      addresses.push({
        properties: {
          ADDRESS: 'VALID ADDRESS',
          POST_TOWN: 'NOWHERE',
          POSTCODE: 'X1 1XX',
          LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'NOWHERE',
          COUNTRY_CODE: 'E',
          UPRN: '100012345678'
        }
      })
    })

    test('it only returns valid addresses', () => {
      const results = addressLookupMapper(addresses)

      expect(results.length).toBe(1)
    })
  })
})

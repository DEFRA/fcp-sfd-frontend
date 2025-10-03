// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressLookupSchema } from '../../../../src/schemas/business/business-address-lookup-schema.js'

describe('businessAddressLookupSchema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = businessAddressLookupSchema

    payload = {
      properties: {
        UPRN: '123456',
        ADDRESS: '10 Skirbeck Way, Lonely Lane',
        ORGANISATION_NAME: 'Acme Corp',
        DEPARTMENT_NAME: 'Sales',
        SUB_BUILDING_NAME: 'Flat 1',
        BUILDING_NAME: 'Block A',
        BUILDING_NUMBER: '10',
        DEPENDENT_THOROUGHFARE_NAME: 'Skirbeck Way',
        THOROUGHFARE_NAME: 'Lonely Lane',
        DOUBLE_DEPENDENT_LOCALITY: 'Suburbia',
        DEPENDENT_LOCALITY: 'Neighbourhood',
        POST_TOWN: 'Maidstone',
        POSTCODE: 'SK22 1DL',
        LOCAL_CUSTODIAN_CODE_DESCRIPTION: 'Kent',
        COUNTRY_CODE: 'GB'
      }
    }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })
  })

  describe('when invalid data is provided', () => {
    describe('because "UPRN" is missing', () => {
      beforeEach(() => {
        delete payload.properties.UPRN
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(
          expect.objectContaining({
            message: '"properties.UPRN" is required',
            path: ['properties', 'UPRN'],
            type: 'any.required'
          })
        )
        expect(value).toEqual(payload)
      })
    })

    describe('because "ADDRESS" is missing', () => {
      beforeEach(() => {
        delete payload.properties.ADDRESS
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(
          expect.objectContaining({
            message: '"properties.ADDRESS" is required',
            path: ['properties', 'ADDRESS'],
            type: 'any.required'
          })
        )
        expect(value).toEqual(payload)
      })
    })

    describe('because "POST_TOWN" is missing', () => {
      beforeEach(() => {
        delete payload.properties.POST_TOWN
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(
          expect.objectContaining({
            message: '"properties.POST_TOWN" is required',
            path: ['properties', 'POST_TOWN'],
            type: 'any.required'
          })
        )
        expect(value).toEqual(payload)
      })
    })

    describe('because "POSTCODE" is missing', () => {
      beforeEach(() => {
        delete payload.properties.POSTCODE
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(
          expect.objectContaining({
            message: '"properties.POSTCODE" is required',
            path: ['properties', 'POSTCODE'],
            type: 'any.required'
          })
        )
        expect(value).toEqual(payload)
      })
    })

    describe('because "LOCAL_CUSTODIAN_CODE_DESCRIPTION" is missing', () => {
      beforeEach(() => {
        delete payload.properties.LOCAL_CUSTODIAN_CODE_DESCRIPTION
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(
          expect.objectContaining({
            message: '"properties.LOCAL_CUSTODIAN_CODE_DESCRIPTION" is required',
            path: ['properties', 'LOCAL_CUSTODIAN_CODE_DESCRIPTION'],
            type: 'any.required'
          })
        )
        expect(value).toEqual(payload)
      })
    })

    describe('because "COUNTRY_CODE" is missing', () => {
      beforeEach(() => {
        delete payload.properties.COUNTRY_CODE
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(
          expect.objectContaining({
            message: '"properties.COUNTRY_CODE" is required',
            path: ['properties', 'COUNTRY_CODE'],
            type: 'any.required'
          })
        )
        expect(value).toEqual(payload)
      })
    })

    describe('because optional fields are null', () => {
      beforeEach(() => {
        payload.properties.ORGANISATION_NAME = null
        payload.properties.DEPARTMENT_NAME = null
        payload.properties.SUB_BUILDING_NAME = null
        payload.properties.BUILDING_NAME = null
        payload.properties.BUILDING_NUMBER = null
        payload.properties.DEPENDENT_THOROUGHFARE_NAME = null
        payload.properties.THOROUGHFARE_NAME = null
        payload.properties.DOUBLE_DEPENDENT_LOCALITY = null
        payload.properties.DEPENDENT_LOCALITY = null
      })

      test('it still passes validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
        expect(value).toEqual(payload)
      })
    })

    describe('when unknown properties are provided', () => {
      beforeEach(() => {
        payload.properties.EXTRA_FIELD = 'unexpected'
        payload.ANOTHER_TOP_LEVEL_FIELD = 42
      })

      test('it still validates successfully and keeps the unknown fields', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
        expect(value.properties.EXTRA_FIELD).toBe('unexpected')
        expect(value.ANOTHER_TOP_LEVEL_FIELD).toBe(42)
      })
    })
  })
})

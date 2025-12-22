// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalDetailsSchema } from '../../../../src/schemas/personal/personal-details-schema.js'

// Test helpers
import { personalDetailsMapped } from '../../constants/test-personal-details.js'

describe('personal details schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = personalDetailsSchema

    payload = personalDetailsMapped()
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
    })

    test('it normalises the data', () => {
      const { value } = schema.validate(payload, { abortEarly: false })

      expect(value).toEqual({
        crn: '123456890',
        info: {
          userName: 'John Doe',
          fullName: { first: 'John', last: 'Doe', middle: 'M' },
          fullNameJoined: 'John M Doe',
          dateOfBirth: new Date('1990-01-01T00:00:00.000Z')
        },
        address: {
          lookup: {
            flatName: 'THE COACH HOUSE',
            buildingName: 'STOCKWELL HALL',
            buildingNumberRange: '7',
            street: 'HAREWOOD AVENUE',
            city: 'DARLINGTON',
            county: 'Dorset',
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
        },
        contact: { email: 'test@example.com', telephone: '01234567890' },
        business: { info: { name: 'Acme Farms Ltd' } }
      })
    })

    describe('when a UPRN is provided', () => {
      beforeEach(() => {
        payload.address.lookup.uprn = '12345'
        payload.address.manual.line1 = ''
        payload.address.manual.line4 = ''
        payload.address.postcode = ''
        payload.address.country = ''
      })

      test('it does not validate manual address fields', () => {
        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
      })
    })
  })

  describe('when invalid data is provided', () => {
    describe('for the name fields', () => {
      describe('because the first name is missing', () => {
        beforeEach(() => {
          payload.info.fullName.first = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'fullName', 'first'],
            type: 'string.empty'
          }))
        })
      })

      describe('because the first name exceeds 100 characters', () => {
        beforeEach(() => {
          payload.info.fullName.first = 'Thisisareallylongfirstnametoshowthatitexceedsonehundredcharactersandfailsourvaldiationtestscorrectly!!'
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'fullName', 'first'],
            type: 'string.max'
          }))
        })
      })

      describe('because the last name is missing', () => {
        beforeEach(() => {
          payload.info.fullName.last = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'fullName', 'last'],
            type: 'string.empty'
          }))
        })
      })

      describe('because the last name exceeds 100 characters', () => {
        beforeEach(() => {
          payload.info.fullName.last = 'Thisisareallylonglastnametoshowthatitexceedsonehundredcharactersandfailsourvaldiationtestscorrectly!!'
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'fullName', 'last'],
            type: 'string.max'
          }))
        })
      })

      describe('because the middle name exceeds 100 characters', () => {
        beforeEach(() => {
          payload.info.fullName.middle = 'Thisisareallylongmiddlenametoshowthatitexceedsonehundredcharactersandfailsourvaldiationtestscorrectly!!'
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'fullName', 'middle'],
            type: 'string.max'
          }))
        })
      })
    })

    describe('for the date of birth field', () => {
      describe('because the date of birth is missing', () => {
        beforeEach(() => {
          payload.info.dateOfBirth = null
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'dateOfBirth'],
            type: 'date.base'
          }))
        })
      })

      describe('because the date of birth is not a valid date', () => {
        beforeEach(() => {
          payload.info.dateOfBirth = 'not-a-date'
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['info', 'dateOfBirth'],
            type: 'date.base'
          }))
        })
      })
    })

    describe('for the contact fields', () => {
      describe('because the email is missing', () => {
        beforeEach(() => {
          payload.contact.email = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['contact', 'email'],
            type: 'string.empty'
          }))
        })
      })

      describe('because the email is not valid', () => {
        beforeEach(() => {
          payload.contact.email = 'not-an-email'
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['contact', 'email'],
            type: 'string.email'
          }))
        })
      })

      describe('because both telephone and mobile are missing', () => {
        beforeEach(() => {
          payload.contact.telephone = null
          payload.contact.mobile = null
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['contact'],
            type: 'object.missing'
          }))
        })
      })
    })

    describe('for the address fields', () => {
      describe('because neither lookup nor manual address is provided', () => {
        beforeEach(() => {
          payload.address.lookup.uprn = null
          payload.address.manual.line1 = ''
          payload.address.manual.line4 = ''
          payload.address.postcode = ''
          payload.address.country = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            type: 'any.custom'
          }))
        })
      })

      describe('because manual address line 1 is missing when no UPRN is provided', () => {
        beforeEach(() => {
          payload.address.lookup.uprn = null
          payload.address.manual.line1 = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['address'],
            type: 'any.custom'
          }))
        })
      })

      describe('because manual address city is missing when no UPRN is provided', () => {
        beforeEach(() => {
          payload.address.lookup.uprn = null
          payload.address.manual.line4 = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['address'],
            type: 'any.custom'
          }))
        })
      })

      describe('because postcode is missing when no UPRN is provided', () => {
        beforeEach(() => {
          payload.address.lookup.uprn = null
          payload.address.postcode = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['address'],
            type: 'any.custom'
          }))
        })
      })

      describe('because country is missing when no UPRN is provided', () => {
        beforeEach(() => {
          payload.address.lookup.uprn = null
          payload.address.country = ''
        })

        test('it fails validation', () => {
          const { error } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            path: ['address'],
            type: 'any.custom'
          }))
        })
      })
    })
  })
})

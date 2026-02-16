// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessPhoneSchema } from '../../../../src/schemas/business/business-phone-schema.js'

describe('business phone schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = businessPhoneSchema

    payload = {
      businessTelephone: '01234567890',
      businessMobile: '01234567890'
    }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })

    describe('when "businessTelephone" contains valid special characters', () => {
      test.each([
        { desc: 'spaces', value: '012 345 67890' },
        { desc: 'brackets', value: '(012) 345 67890' },
        { desc: 'hyphens', value: '012-345-67890' },
        { desc: 'plus sign', value: '+44 1234567890' }
      ])('it allows $desc', ({ value }) => {
        payload.businessTelephone = value

        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
      })
    })

    describe('when "businessMobile" contains valid special characters', () => {
      test.each([
        { desc: 'spaces', value: '012 345 67890' },
        { desc: 'brackets', value: '(012) 345 67890' },
        { desc: 'hyphens', value: '012-345-67890' },
        { desc: 'plus sign', value: '+44 1234567890' }
      ])('it allows $desc', ({ value }) => {
        payload.businessMobile = value

        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
      })
    })
  })

  describe('when invalid data is provided', () => {
    describe('because both "businessMobile" and "businessTelephone" are missing', () => {
      beforeEach(() => {
        delete payload.businessMobile
        delete payload.businessTelephone
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter at least one phone number',
          path: [],
          type: 'object.missing',
          context: {
            peers: ['businessTelephone', 'businessMobile'],
            peersWithLabels: ['businessTelephone', 'businessMobile'],
            label: 'value',
            value: {}
          }
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because both "businessMobile" and "businessTelephone" are empty strings', () => {
      beforeEach(() => {
        payload.businessMobile = ''
        payload.businessTelephone = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter at least one phone number',
          path: [],
          type: 'object.missing',
          context: {
            peers: ['businessTelephone', 'businessMobile'],
            peersWithLabels: ['businessTelephone', 'businessMobile'],
            label: 'value',
            value: {}
          }
        }))
        expect(value).toEqual({})
      })
    })

    describe('because "businessMobile" is too short', () => {
      beforeEach(() => {
        payload.businessMobile = '012'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Business mobile phone number must be 10 characters or more',
          path: ['businessMobile'],
          type: 'string.min'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessMobile" is too long', () => {
      beforeEach(() => {
        payload.businessMobile = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Business mobile phone number must be 50 characters or less',
          path: ['businessMobile'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessMobile" has invalid characters', () => {
      beforeEach(() => {
        payload.businessMobile = '0123@#$%^&*abcdef'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Business mobile number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +',
          path: ['businessMobile'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessTelephone" is too short', () => {
      beforeEach(() => {
        payload.businessTelephone = '012'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Business telephone number must be 10 characters or more',
          path: ['businessTelephone'],
          type: 'string.min'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessTelephone" is too long', () => {
      beforeEach(() => {
        payload.businessTelephone = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Business telephone number must be 50 characters or less',
          path: ['businessTelephone'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "businessTelephone" has invalid characters', () => {
      beforeEach(() => {
        payload.businessTelephone = '0123@#$%^&*abcdef'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Business telephone number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +',
          path: ['businessTelephone'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })
  })
})

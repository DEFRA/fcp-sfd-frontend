// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalPhoneSchema } from '../../../../src/schemas/personal/personal-phone-schema.js'

describe('personal phone schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = personalPhoneSchema

    payload = {
      personalTelephone: '01234567890',
      personalMobile: '01234567890'
    }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })

    describe('when "personalTelephone" contains valid special characters', () => {
      test.each([
        { desc: 'spaces', value: '012 345 67890' },
        { desc: 'brackets', value: '(012) 345 67890' },
        { desc: 'hyphens', value: '012-345-67890' },
        { desc: 'plus sign', value: '+44 1234567890' }
      ])('it allows $desc', ({ value }) => {
        payload.personalTelephone = value

        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
      })
    })

    describe('when "personalMobile" contains valid special characters', () => {
      test.each([
        { desc: 'spaces', value: '012 345 67890' },
        { desc: 'brackets', value: '(012) 345 67890' },
        { desc: 'hyphens', value: '012-345-67890' },
        { desc: 'plus sign', value: '+44 1234567890' }
      ])('it allows $desc', ({ value }) => {
        payload.personalMobile = value

        const { error } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
      })
    })
  })

  describe('when invalid data is provided', () => {
    describe('because both "personalMobile" and "personalTelephone" are missing', () => {
      beforeEach(() => {
        delete payload.personalMobile
        delete payload.personalTelephone
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter at least one phone number',
          path: [],
          type: 'object.missing',
          context: {
            peers: ['personalTelephone', 'personalMobile'],
            peersWithLabels: ['personalTelephone', 'personalMobile'],
            label: 'value',
            value: {}
          }
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because both "personalMobile" and "personalTelephone" are empty strings', () => {
      beforeEach(() => {
        payload.personalMobile = ''
        payload.personalTelephone = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter at least one phone number',
          path: [],
          type: 'object.missing'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalMobile" is too short', () => {
      beforeEach(() => {
        payload.personalMobile = '012'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Personal mobile phone number must be 10 characters or more',
          path: ['personalMobile'],
          type: 'string.min'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalMobile" is too long', () => {
      beforeEach(() => {
        payload.personalMobile = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Personal mobile phone number must be 50 characters or less',
          path: ['personalMobile'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalMobile" has invalid characters', () => {
      beforeEach(() => {
        payload.personalMobile = '0123@#$%^&*abcdef'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Personal mobile number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +',
          path: ['personalMobile'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalTelephone" is too short', () => {
      beforeEach(() => {
        payload.personalTelephone = '012'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Personal telephone number must be 10 characters or more',
          path: ['personalTelephone'],
          type: 'string.min'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalTelephone" is too long', () => {
      beforeEach(() => {
        payload.personalTelephone = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Personal telephone number must be 50 characters or less',
          path: ['personalTelephone'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalTelephone" has invalid characters', () => {
      beforeEach(() => {
        payload.personalTelephone = '0123@#$%^&*abcdef'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Personal telephone number must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +',
          path: ['personalTelephone'],
          type: 'string.pattern.base'
        }))
        expect(value).toEqual(payload)
      })
    })
  })
})

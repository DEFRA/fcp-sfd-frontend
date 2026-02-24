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

    const validSpecialCharactersTestCases = [
      { validSpecialCharacter: 'spaces', value: '012 345 67890' },
      { validSpecialCharacter: 'brackets', value: '(012) 345 67890' },
      { validSpecialCharacter: 'hyphens', value: '012-345-67890' },
      { validSpecialCharacter: 'plus sign', value: '+44 1234567890' }
    ]

    describe.each(['personalTelephone', 'personalMobile'])(
      'when "%s" contains valid special characters',
      (fieldName) => {
        test.each(validSpecialCharactersTestCases)(
          'it allows $validSpecialCharacter',
          ({ value }) => {
            payload[fieldName] = value

            const { error } = schema.validate(payload, { abortEarly: false })

            expect(error).toBeUndefined()
          }
        )
      }
    )
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
          type: 'object.missing',
          context: {
            peers: ['personalTelephone', 'personalMobile'],
            peersWithLabels: ['personalTelephone', 'personalMobile'],
            label: 'value',
            value: {}
          }
        }))

        expect(value).toEqual({})
      })
    })

    describe.each([
      { field: 'personalMobile', label: 'mobile phone number' },
      { field: 'personalTelephone', label: 'telephone number' }
    ])(
      'because $field is too short', ({ field, label }) => {
        beforeEach(() => {
          payload[field] = '012'
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(value).toEqual(payload)

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: `Personal ${label} must be 10 characters or more`,
            path: [field],
            type: 'string.min'
          }))
        })
      }
    )

    describe.each([
      { field: 'personalMobile', label: 'mobile phone number' },
      { field: 'personalTelephone', label: 'telephone number' }
    ])(
      'because $field is too long', ({ field, label }) => {
        beforeEach(() => {
          payload[field] = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(value).toEqual(payload)

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: `Personal ${label} must be 50 characters or less`,
            path: [field],
            type: 'string.max'
          }))
        })
      }
    )

    describe.each([
      { field: 'personalMobile', label: 'mobile phone number' },
      { field: 'personalTelephone', label: 'telephone number' }
    ])(
      'because $field contains invalid characters', ({ field, label }) => {
        beforeEach(() => {
          payload[field] = '0123@#$%^&*abcdef'
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(value).toEqual(payload)

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: `Personal ${label} must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +`,
            path: [field],
            type: 'string.pattern.base'
          }))
        })
      }
    )
  })
})

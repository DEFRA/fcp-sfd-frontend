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

    const validSpecialCharactersTestCases = [
      { validSpecialCharacter: 'spaces', value: '012 345 67890' },
      { validSpecialCharacter: 'brackets', value: '(012) 345 67890' },
      { validSpecialCharacter: 'hyphens', value: '012-345-67890' },
      { validSpecialCharacter: 'plus sign', value: '+44 1234567890' }
    ]

    describe.each(['businessMobile', 'businessTelephone'])(
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

    describe.each([
      { field: 'businessMobile', label: 'mobile phone number' },
      { field: 'businessTelephone', label: 'telephone number' }
    ])(
      'because $field is too short', ({ field, label }) => {
        beforeEach(() => {
          payload[field] = '012'
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(value).toEqual(payload)

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: `Business ${label} must be 10 characters or more`,
            path: [field],
            type: 'string.min'
          }))
        })
      }
    )

    describe.each([
      { field: 'businessMobile', label: 'mobile phone number' },
      { field: 'businessTelephone', label: 'telephone number' }
    ])(
      'because $field is too long', ({ field, label }) => {
        beforeEach(() => {
          payload[field] = '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567891'
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(value).toEqual(payload)

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: `Business ${label} must be 50 characters or less`,
            path: [field],
            type: 'string.max'
          }))
        })
      }
    )

    describe.each([
      { field: 'businessMobile', label: 'mobile number' },
      { field: 'businessTelephone', label: 'telephone number' }
    ])(
      'because $field has invalid characters', ({ field, label }) => {
        beforeEach(() => {
          payload[field] = '0123@#$%^&*abcdef'
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(value).toEqual(payload)

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: `Business ${label} must only include numbers 0 to 9 and special characters such as spaces, hyphens, brackets, - and +`,
            path: [field],
            type: 'string.pattern.base'
          }))
        })
      }
    )
  })
})

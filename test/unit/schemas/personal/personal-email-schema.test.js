// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalEmailSchema } from '../../../../src/schemas/personal/personal-email-schema.js'

describe('personal email schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = personalEmailSchema

    payload = { personalEmail: 'example@email.com' }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })
  })

  describe('when invalid data is provided', () => {
    describe('because "personalEmail" is missing', () => {
      beforeEach(() => {
        payload.personalEmail = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter a personal email address',
          path: ['personalEmail'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalEmail" is not an email', () => {
      beforeEach(() => {
        payload.personalEmail = 'This is not an email'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter an email address, like name@example.com',
          path: ['personalEmail'],
          type: 'string.email'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "personalEmail" is longer than 254 characters', () => {
      beforeEach(() => {
        payload.personalEmail = 'reallyreallyreallyreallyreallyreallyreallyreallyreallylongemail@exampleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeexample.cooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ukkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.com'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Email address must be 254 characters or less',
          path: ['personalEmail'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })
  })
})

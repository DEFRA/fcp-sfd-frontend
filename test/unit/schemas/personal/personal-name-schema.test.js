// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalNameSchema } from '../../../../src/schemas/personal/personal-name-schema.js'

describe('personal name schema', () => {
  let payload
  let schema

  beforeEach(() => {
    schema = personalNameSchema

    payload = {
      first: 'John',
      last: 'Doe',
      middle: 'M'
    }
  })

  describe('when valid data is provided', () => {
    test('it confirms the data is valid', () => {
      const { error, value } = schema.validate(payload, { abortEarly: false })

      expect(error).toBeUndefined()
      expect(value).toEqual(payload)
    })

    describe('when "middle" is missing', () => {
      beforeEach(() => {
        delete payload.middle
      })

      test('it validates successfully', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error).toBeUndefined()
        expect(value.middle).toBeUndefined()
      })
    })
  })

  describe('when invalid data is provided', () => {
    describe('because "first" is an empty string', () => {
      beforeEach(() => {
        payload.first = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter first name',
          path: ['first'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "first" is longer than 100 characters', () => {
      beforeEach(() => {
        payload.first = 'This sentence is intentionally longer than 100 characters as an example of a string that can be used for testing'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'First name must be 100 characters or less',
          path: ['first'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
      describe('because "first" is missing', () => {
        beforeEach(() => {
          delete payload.first
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: 'Enter first name',
            path: ['first'],
            type: 'any.required'
          }))
          expect(value).toEqual(payload)
        })
      })
    })

    describe('because "last" is an empty string', () => {
      beforeEach(() => {
        payload.last = ''
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Enter last name',
          path: ['last'],
          type: 'string.empty'
        }))
        expect(value).toEqual(payload)
      })
    })

    describe('because "last" is longer than 100 characters', () => {
      beforeEach(() => {
        payload.last = 'This sentence is intentionally longer than 100 characters as an example of a string that can be used for testing'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Last name must be 100 characters or less',
          path: ['last'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
      describe('because "last" is missing', () => {
        beforeEach(() => {
          delete payload.last
        })

        test('it fails validation', () => {
          const { error, value } = schema.validate(payload, { abortEarly: false })

          expect(error.details[0]).toEqual(expect.objectContaining({
            message: 'Enter last name',
            path: ['last'],
            type: 'any.required'
          }))
          expect(value).toEqual(payload)
        })
      })
    })

    describe('because "middle" is longer than 100 characters', () => {
      beforeEach(() => {
        payload.middle = 'This sentence is intentionally longer than 100 characters as an example of a string that can be used for testing'
      })

      test('it fails validation', () => {
        const { error, value } = schema.validate(payload, { abortEarly: false })

        expect(error.details[0]).toEqual(expect.objectContaining({
          message: 'Middle names must be 100 characters or less',
          path: ['middle'],
          type: 'string.max'
        }))
        expect(value).toEqual(payload)
      })
    })
  })
})

import { describe, test, expect } from 'vitest'
import { cookiesSchema } from '../../../../src/schemas/footer/cookies-schema.js'

describe('cookiesSchema', () => {
  describe('when a valid payload is provided', () => {
    test('it should pass validation', () => {
      const { error, value } = cookiesSchema.validate({ analytics: true, async: true, referer: '/some-page' })

      expect(error).toBeUndefined()
      expect(value).toEqual({ analytics: true, async: true, referer: '/some-page' })
    })

    test('it should coerce string radio values into booleans', () => {
      const { error, value } = cookiesSchema.validate({ analytics: 'false' })

      expect(error).toBeUndefined()
      expect(value.analytics).toBe(false)
    })
  })

  describe('when analytics is missing', () => {
    test('it should fail with "Select yes if you want to accept analytics cookies"', () => {
      const { error } = cookiesSchema.validate({})

      expect(error.details[0].message).toBe('Select yes if you want to accept analytics cookies')
    })
  })

  describe('when analytics is not a boolean', () => {
    test('it should fail with "Select yes if you want to accept analytics cookies"', () => {
      const { error } = cookiesSchema.validate({ analytics: 'not-a-boolean' })

      expect(error.details[0].message).toBe('Select yes if you want to accept analytics cookies')
    })
  })

  describe('when async and referer are omitted', () => {
    test('it should default async to false and referer to an empty string', () => {
      const { error, value } = cookiesSchema.validate({ analytics: true })

      expect(error).toBeUndefined()
      expect(value).toEqual({ analytics: true, async: false, referer: '' })
    })
  })
})

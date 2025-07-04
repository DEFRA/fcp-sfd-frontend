import { describe, test, expect } from 'vitest'
import { rawBusinessDetailsSchema } from '../../../../src/schemas/dal/business-details-schema.js'
import { dalData } from '../../../mocks/mock-business-details.js'

describe('businessDetailsSchema', () => {
  const validData = dalData

  describe('When the data is valid', () => {
    test('it should successfully validate with no errors', () => {
      const result = rawBusinessDetailsSchema.validate(validData, { abortEarly: false })
      expect(result.error).toBeUndefined()
    })
  })

  describe('when the data is invalid', () => {
    test('it should fail validation for non string type', () => {
      const invalidData = {
        ...validData,
        business: {
          ...validData.business,
          sbi: 1
        }

      }
      const result = rawBusinessDetailsSchema.validate(invalidData, { abortEarly: false })
      expect(result.error).toBeDefined()
      expect(result.error.details[0].message).toBe('"business.sbi" must be a string')
    })

    test('it should fail validation for non number type', () => {
      const invalidData = {
        ...validData,
        business: {
          ...validData.business,
          info: {
            ...validData.business.info,
            legalStatus: {
              ...validData.business.info.legalStatus,
              code: 'invalid'
            }

          }
        }

      }
      const result = rawBusinessDetailsSchema.validate(invalidData, { abortEarly: false })
      expect(result.error).toBeDefined()
      expect(result.error.details[0].message).toBe('"business.info.legalStatus.code" must be a number')
    })
  })
})

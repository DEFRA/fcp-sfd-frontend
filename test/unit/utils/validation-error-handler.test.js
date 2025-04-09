import { describe, test, expect } from '@jest/globals'
import { formatValidationErrors } from '../../../src/utils/validation-error-handler.js'

describe('formatValidationErrors', () => {
  test('should format validation errors correctly', () => {
    const errorDetails = [
      {
        path: ['businessName'],
        message: 'Enter business name'
      },
      {
        path: ['address1'],
        message: 'Enter address line 1'
      }
    ]

    const result = formatValidationErrors(errorDetails)

    expect(result).toEqual({
      businessName: { text: 'Enter business name' },
      address1: { text: 'Enter address line 1' }
    })
  })

  test('should handle empty array', () => {
    expect(formatValidationErrors([])).toEqual({})
  })
})

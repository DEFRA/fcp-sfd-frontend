import { describe, test, expect } from 'vitest'
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

  test('should handle object.missing error with peers', () => {
    const errorDetails = [
      {
        type: 'object.missing',
        path: ['parentObject'],
        message: 'Missing object fields',
        context: {
          peers: ['field1', 'field2']
        }
      }
    ]

    const result = formatValidationErrors(errorDetails)

    expect(result).toEqual({
      field1: { text: 'Missing object fields' },
      field2: { text: 'Missing object fields' }
    })
  })

  test('should handle object.missing error without peers', () => {
    const errorDetails = [
      {
        type: 'object.missing',
        path: ['parentObject'],
        message: 'Missing object fields'
      }
    ]

    const result = formatValidationErrors(errorDetails)

    expect(result).toEqual({
      parentObject: { text: 'Missing object fields' }
    })
  })

  test('should handle multiple object.missing errors with peers', () => {
    const errorDetails = [
      {
        type: 'object.missing',
        path: ['parentObject1'],
        message: 'Missing object fields',
        context: {
          peers: ['fieldA', 'fieldB']
        }
      },
      {
        type: 'object.missing',
        path: ['parentObject2'],
        message: 'Missing object fields',
        context: {
          peers: ['fieldC', 'fieldD']
        }
      }
    ]

    const result = formatValidationErrors(errorDetails)

    expect(result).toEqual({
      fieldA: { text: 'Missing object fields' },
      fieldB: { text: 'Missing object fields' },
      fieldC: { text: 'Missing object fields' },
      fieldD: { text: 'Missing object fields' }
    })
  })
})

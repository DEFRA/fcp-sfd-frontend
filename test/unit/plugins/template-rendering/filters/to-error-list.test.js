// test/unit/plugins/template-renderer/filters/to-error-list.test.js
import { describe, test, expect } from '@jest/globals'
import { toErrorList } from '../../../../../src/plugins/template-renderer/filters/to-error-list.js'

describe('toErrorList filter', () => {
  test('should convert errors object to error list format', () => {
    const errors = {
      businessName: { text: 'Enter business name' },
      address1: { text: 'Enter address line 1' }
    }

    const result = toErrorList(errors)

    expect(result).toEqual([
      { text: 'Enter business name', href: '#businessName' },
      { text: 'Enter address line 1', href: '#address1' }
    ])
  })

  test('should return empty array when errors is null', () => {
    const result = toErrorList(null)
    expect(result).toEqual([])
  })

  test('should return empty array when errors is undefined', () => {
    const result = toErrorList(undefined)
    expect(result).toEqual([])
  })

  test('should return empty array when errors is an empty object', () => {
    const result = toErrorList({})
    expect(result).toEqual([])
  })

  test('should create correct href attributes with field IDs', () => {
    const errors = {
      'field-with-dashes': { text: 'Error with dashes' },
      fieldWithCamelCase: { text: 'Error with camel case' }
    }

    const result = toErrorList(errors)

    expect(result).toEqual([
      { text: 'Error with dashes', href: '#field-with-dashes' },
      { text: 'Error with camel case', href: '#fieldWithCamelCase' }
    ])
  })

  test('should handle error objects with additional properties', () => {
    const errors = {
      email: {
        text: 'Enter a valid email',
        type: 'validation',
        severity: 'error'
      }
    }

    const result = toErrorList(errors)

    expect(result).toEqual([
      { text: 'Enter a valid email', href: '#email' }
    ])
  })
})

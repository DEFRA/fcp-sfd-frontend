// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { toDalErrorLog, toLoggableDalMessage } from '../../../src/dal/dal-error-log.js'

// Messages in the exact format graphql-js 16 produces for variable coercion errors
const UNDEFINED_FIELD_MESSAGE = 'Variable "$input" got invalid value { email: { address: "jo.bloggs@example.com" }, phone: "07700900000" }; Field "phone" is not defined by type "UpdateCustomerInput".'
const WRONG_TYPE_MESSAGE = 'Variable "$input" got invalid value 9000000001 at "input.crn"; String cannot represent a non string value: 9000000001'
const CUSTOM_SCALAR_MESSAGE = 'Variable "$input" got invalid value "1234567" at "input.accountNumber"; UkAccountNumber must be exactly 8 digits'
const QUOTED_SEPARATOR_MESSAGE = 'Variable "$input" got invalid value { line1: "Flat 1; at \\"The Mill\\"" } at "input.address"; Expected type "AddressInput".'
const LITERAL_MESSAGE = 'Expected value of type "Int", found "jo.bloggs@example.com".'

describe('DAL error log', () => {
  describe('toLoggableDalMessage', () => {
    test('should remove a whole input object echoed for an undefined field', () => {
      const message = toLoggableDalMessage({ message: UNDEFINED_FIELD_MESSAGE })

      expect(message).toBe('Variable "$input" got invalid value [redacted]; Field "phone" is not defined by type "UpdateCustomerInput".')
    })

    test('should remove the value from both the prefix and the scalar reason on a wrong type', () => {
      const message = toLoggableDalMessage({ message: WRONG_TYPE_MESSAGE })

      expect(message).toBe('Variable "$input" got invalid value [redacted] at "input.crn"; String cannot represent a non string value: [redacted]')
    })

    test('should remove the value and keep the path and reason for a DAL custom scalar', () => {
      const message = toLoggableDalMessage({ message: CUSTOM_SCALAR_MESSAGE })

      expect(message).toBe('Variable "$input" got invalid value [redacted] at "input.accountNumber"; UkAccountNumber must be exactly 8 digits')
    })

    test('should remove a value whose quoted text contains a separator', () => {
      const message = toLoggableDalMessage({ message: QUOTED_SEPARATOR_MESSAGE })

      expect(message).toBe('Variable "$input" got invalid value [redacted] at "input.address"; Expected type "AddressInput".')
    })

    test('should remove the literal echoed by query validation', () => {
      const message = toLoggableDalMessage({ message: LITERAL_MESSAGE })

      expect(message).toBe('Expected value of type "Int", found [redacted]')
    })

    test('should remove the upstream message that mapDalErrors appends', () => {
      const message = toLoggableDalMessage({
        message: 'Bad request: Email jo.bloggs@example.com already in use',
        extensions: { parsedBody: { message: 'Email jo.bloggs@example.com already in use' } }
      })

      expect(message).toBe('Bad request')
    })

    test('should keep a message that echoes no value', () => {
      const message = toLoggableDalMessage({ message: "variable 'input.email.address' must match pattern" })

      expect(message).toBe("variable 'input.email.address' must match pattern")
    })

    test('should return an empty string when the error has no message', () => {
      expect(toLoggableDalMessage({})).toBe('')
    })
  })

  describe('toDalErrorLog', () => {
    test('should put the codes, messages and status in tenant-settable fields', () => {
      const log = toDalErrorLog({
        statusCode: 400,
        errors: [
          { message: CUSTOM_SCALAR_MESSAGE, extensions: { code: 'BAD_USER_INPUT' } },
          { message: 'Internal error' }
        ]
      })

      expect(log).toEqual({
        error: {
          type: 'DalGraphQLError',
          code: 'BAD_USER_INPUT,UNKNOWN',
          message: 'Variable "$input" got invalid value [redacted] at "input.accountNumber"; UkAccountNumber must be exactly 8 digits | Internal error'
        },
        event: {
          outcome: 'failure',
          reason: 'DAL responded with status 400'
        }
      })
    })

    test('should not include any submitted value in the log', () => {
      const log = toDalErrorLog({
        statusCode: 400,
        errors: [{ message: UNDEFINED_FIELD_MESSAGE }, { message: WRONG_TYPE_MESSAGE }]
      })

      const logged = JSON.stringify(log)
      expect(logged).not.toContain('jo.bloggs@example.com')
      expect(logged).not.toContain('07700900000')
      expect(logged).not.toContain('9000000001')
    })
  })
})

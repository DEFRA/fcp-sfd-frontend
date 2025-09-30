import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updateBusinessPhoneNumbersMutation } from '../../../../src/dal/mutations/business/update-business-phone-numbers.js'

describe('When the updateBusinessPhoneNumbersMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updateBusinessPhoneNumbersMutation)).not.toThrow()
  })

  test('it contains the Mutation operation and the correct variable', () => {
    // Parsing the GQL mutation returns a Abstract Syntax Tree (ast)
    // this converts the string into a structural representation of the mutation.
    // This allows it be inspected and validated.

    const ast = parse(updateBusinessPhoneNumbersMutation)
    const operation = ast.definitions[0]
    expect(operation.name.value).toBe('Mutation')

    const variable = operation.variableDefinitions[0]
    expect(variable.variable.name.value).toBe('input')
    expect(variable.type.type.name.value).toBe('UpdateBusinessPhoneInput')
  })
})

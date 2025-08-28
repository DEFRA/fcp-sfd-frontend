import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updateBusinessPhoneMutation } from '../../../../src/dal/mutations/update-business-phone-numbers.js'

describe('When the updateBusinessPhoneMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updateBusinessPhoneMutation)).not.toThrow()
  })

  test('it contains the Mutation operation and the correct variable', () => {
    // Parsing the GQL mutation returns a Abstract Syntax Tree (ast)
    // this converts the string into a structural representation of the mutation.
    // This allows it be inspected and validated.

    const ast = parse(updateBusinessPhoneMutation)
    const operation = ast.definitions[0]
    expect(operation.name.value).toBe('Mutation')

    const variable = operation.variableDefinitions[0]
    expect(variable.variable.name.value).toBe('input')
    expect(variable.type.type.name.value).toBe('UpdateBusinessPhoneInput')
  })
})

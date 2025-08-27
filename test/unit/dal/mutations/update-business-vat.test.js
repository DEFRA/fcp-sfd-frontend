import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updateBusinessVATMutation } from '../../../../src/dal/mutations/update-business-vat.js'

describe('When the updateBusinessVATMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updateBusinessVATMutation)).not.toThrow()
  })

  test('it contains the Mutation operation and the correct variable', () => {
    // Parsing the GQL mutation returns a Abstract Syntax Tree (ast)
    // this converts the string into a structural representation of the mutation.
    // This allows it be inspected and validated.

    const ast = parse(updateBusinessVATMutation)
    const operation = ast.definitions[0]
    expect(operation.vatNumber.value).toBe('Mutation')

    const variable = operation.variableDefinitions[0]
    expect(variable.variable.vatNumber.value).toBe('input')
    expect(variable.type.type.vatNumber.value).toBe('UpdateBusinessVATInput')
  })
})

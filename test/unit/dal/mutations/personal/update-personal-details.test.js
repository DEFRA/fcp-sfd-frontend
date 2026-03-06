import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updatePersonalDetailsMutation } from '../../../../../src/dal/mutations/personal/update-personal-details.js'

describe('When the updatePersonalDetailsMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updatePersonalDetailsMutation)).not.toThrow()
  })

  test('it contains the Mutation operation and the correct variable', () => {
    // Parse the GQL mutation into an AST (Abstract Syntax Tree)
    const ast = parse(updatePersonalDetailsMutation)
    const operation = ast.definitions[0]

    // Check the mutation operation name
    expect(operation.name.value).toBe('Mutation')

    // Check the variable definition
    const variable = operation.variableDefinitions[0]
    expect(variable.variable.name.value).toBe('allFieldsInput')
    expect(variable.type.type.name.value).toBe('UpdateCustomerAllFieldsInput')
  })
})

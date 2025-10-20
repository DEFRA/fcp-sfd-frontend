import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updatePersonalEmailMutation } from '../../../../../src/dal/mutations/personal/update-personal-email.js'

describe('When the updatePersonalEmailMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updatePersonalEmailMutation)).not.toThrow()
  })

  test('it contains the Mutation operation and the correct variable', () => {
    // Parsing the GQL mutation returns a Abstract Syntax Tree (ast)
    // this converts the string into a structural representation of the mutation.
    // This allows it be inspected and validated.

    const ast = parse(updatePersonalEmailMutation)
    const operation = ast.definitions[0]
    expect(operation.name.value).toBe('Mutation')

    const variable = operation.variableDefinitions[0]
    expect(variable.variable.name.value).toBe('input')
    expect(variable.type.type.name.value).toBe('UpdateCustomerEmailInput')
  })
})

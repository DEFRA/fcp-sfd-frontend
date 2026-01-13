import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updatePersonalDetailsMutation } from '../../../../../src/dal/mutations/personal/update-personal-details.js'

describe('When the updatePersonalDetailsMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updatePersonalDetailsMutation)).not.toThrow()
  })

  test('it contains the Mutation operation with the correct variables', () => {
    // Parsing the GQL mutation returns an Abstract Syntax Tree (AST).
    // This allows us to inspect the structure of the mutation and
    // validate its operation name and variable definitions.

    const ast = parse(updatePersonalDetailsMutation)
    const operation = ast.definitions[0]

    expect(operation.name.value).toBe('Mutation')

    const variableNames = operation.variableDefinitions.map(
      (variable) => variable.variable.name.value
    )

    expect(variableNames).toEqual([
      'updateCustomerNameInput',
      'updateCustomerEmailInput',
      'updateCustomerPhoneInput',
      'updateCustomerDateOfBirthInput',
      'updateCustomerAddressInput'
    ])
  })

  test('it uses the correct input types for each variable', () => {
    const ast = parse(updatePersonalDetailsMutation)
    const operation = ast.definitions[0]
    const variables = operation.variableDefinitions

    expect(variables[0].type.type.name.value).toBe('UpdateCustomerNameInput')
    expect(variables[1].type.type.name.value).toBe('UpdateCustomerEmailInput')
    expect(variables[2].type.type.name.value).toBe('UpdateCustomerPhoneInput')
    expect(variables[3].type.type.name.value).toBe('UpdateCustomerDateOfBirthInput')
    expect(variables[4].type.type.name.value).toBe('UpdateCustomerAddressInput')
  })
})

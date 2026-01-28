import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updateBusinessDetailsMutation } from '../../../../../src/dal/mutations/business/update-business-details.js'

describe('When the updateBusinessDetailsMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updateBusinessDetailsMutation)).not.toThrow()
  })

  test('it contains the Mutation operation with the correct variables', () => {
    // Parsing the GQL mutation returns an Abstract Syntax Tree (AST).
    // This allows us to inspect the structure of the mutation and
    // validate its operation name and variable definitions.

    const ast = parse(updateBusinessDetailsMutation)
    const operation = ast.definitions[0]

    expect(operation.name.value).toBe('Mutation')

    const variableNames = operation.variableDefinitions.map(
      (variable) => variable.variable.name.value
    )

    expect(variableNames).toEqual([
      'updateBusinessAddressInput',
      'updateBusinessEmailInput',
      'updateBusinessNameInput',
      'updateBusinessPhoneInput',
      'updateBusinessVATInput'
    ])
  })

  test('it uses the correct input types for each variable', () => {
    const ast = parse(updateBusinessDetailsMutation)
    const operation = ast.definitions[0]
    const variables = operation.variableDefinitions

    expect(variables[0].type.type.name.value).toBe('UpdateBusinessAddressInput')
    expect(variables[1].type.type.name.value).toBe('UpdateBusinessEmailInput')
    expect(variables[2].type.type.name.value).toBe('UpdateBusinessNameInput')
    expect(variables[3].type.type.name.value).toBe('UpdateBusinessPhoneInput')
    expect(variables[4].type.type.name.value).toBe('UpdateBusinessVATInput')
  })
})

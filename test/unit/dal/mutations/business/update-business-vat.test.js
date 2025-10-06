import { parse } from 'graphql'
import { describe, test, expect } from 'vitest'
import { updateBusinessVATMutation } from '../../../../../src/dal/mutations/business/update-business-vat.js'

describe('When the updateBusinessVATMutation is parsed', () => {
  test('it is valid GraphQL syntax', () => {
    expect(() => parse(updateBusinessVATMutation)).not.toThrow()
  })

  test('it contains the Mutation operation and the correct variable', () => {
    const ast = parse(updateBusinessVATMutation)
    const operation = ast.definitions[0]

    expect(operation.operation).toBe('mutation')

    const variable = operation.variableDefinitions[0]
    expect(variable.variable.name.value).toBe('input')
    expect(variable.type.type.name.value).toBe('UpdateBusinessVATInput')
  })
})

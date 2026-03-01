// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { personalMutationSectionMap, personalVariableTypeMap } from '../../../../../src/dal/mutations/personal/update-personal-details.js'

describe('personalMutationSectionMap', () => {
  test('it contains the correct mutation for name', () => {
    expect(personalMutationSectionMap.name).toContain('updateCustomerName(input: $updateCustomerNameInput)')
    expect(personalMutationSectionMap.name).toContain('customer {')
    expect(personalMutationSectionMap.name).toContain('name {')
    expect(personalMutationSectionMap.name).toContain('first')
    expect(personalMutationSectionMap.name).toContain('last')
    expect(personalMutationSectionMap.name).toContain('middle')
  })

  test('it contains the correct mutation for email', () => {
    expect(personalMutationSectionMap.email).toContain('updateCustomerEmail(input: $updateCustomerEmailInput)')
    expect(personalMutationSectionMap.email).toContain('customer {')
    expect(personalMutationSectionMap.email).toContain('email {')
    expect(personalMutationSectionMap.email).toContain('address')
  })

  test('it contains the correct mutation for address', () => {
    expect(personalMutationSectionMap.address).toContain('updateCustomerAddress(input: $updateCustomerAddressInput)')
    expect(personalMutationSectionMap.address).toContain('customer {')
    expect(personalMutationSectionMap.address).toContain('address {')
    expect(personalMutationSectionMap.address).toContain('line1')
    expect(personalMutationSectionMap.address).toContain('uprn')
  })

  test('it contains the correct mutation for phone', () => {
    expect(personalMutationSectionMap.phone).toContain('updateCustomerPhone(input: $updateCustomerPhoneInput)')
    expect(personalMutationSectionMap.phone).toContain('customer {')
    expect(personalMutationSectionMap.phone).toContain('phone {')
    expect(personalMutationSectionMap.phone).toContain('landline')
    expect(personalMutationSectionMap.phone).toContain('mobile')
  })

  test('it contains the correct mutation for dateOfBirth', () => {
    expect(personalMutationSectionMap.dateOfBirth).toContain('updateCustomerDateOfBirth(input: $updateCustomerDateOfBirthInput)')
    expect(personalMutationSectionMap.dateOfBirth).toContain('customer {')
    expect(personalMutationSectionMap.dateOfBirth).toContain('dateOfBirth')
  })
})

describe('personalVariableTypeMap', () => {
  test('it contains the correct variable type for name', () => {
    expect(personalVariableTypeMap.name).toBe('$updateCustomerNameInput: UpdateCustomerNameInput!')
  })

  test('it contains the correct variable type for email', () => {
    expect(personalVariableTypeMap.email).toBe('$updateCustomerEmailInput: UpdateCustomerEmailInput!')
  })

  test('it contains the correct variable type for address', () => {
    expect(personalVariableTypeMap.address).toBe('$updateCustomerAddressInput: UpdateCustomerAddressInput!')
  })

  test('it contains the correct variable type for phone', () => {
    expect(personalVariableTypeMap.phone).toBe('$updateCustomerPhoneInput: UpdateCustomerPhoneInput!')
  })

  test('it contains the correct variable type for dateOfBirth', () => {
    expect(personalVariableTypeMap.dateOfBirth).toBe('$updateCustomerDateOfBirthInput: UpdateCustomerDateOfBirthInput!')
  })
})

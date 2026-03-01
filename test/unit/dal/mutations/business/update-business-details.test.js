// Test framework dependencies
import { describe, test, expect } from 'vitest'

// Thing under test
import { businessMutationSectionMap, businessVariableTypeMap } from '../../../../../src/dal/mutations/business/update-business-details.js'

describe('businessMutationSectionMap', () => {
  test('it contains the correct mutation for name', () => {
    expect(businessMutationSectionMap.name).toContain('updateBusinessName(input: $updateBusinessNameInput)')
    expect(businessMutationSectionMap.name).toContain('business {')
    expect(businessMutationSectionMap.name).toContain('name')
    expect(businessMutationSectionMap.name).toContain('success')
  })

  test('it contains the correct mutation for email', () => {
    expect(businessMutationSectionMap.email).toContain('updateBusinessEmail(input: $updateBusinessEmailInput)')
    expect(businessMutationSectionMap.email).toContain('business {')
    expect(businessMutationSectionMap.email).toContain('email {')
    expect(businessMutationSectionMap.email).toContain('address')
    expect(businessMutationSectionMap.email).toContain('success')
  })

  test('it contains the correct mutation for address', () => {
    expect(businessMutationSectionMap.address).toContain('updateBusinessAddress(input: $updateBusinessAddressInput)')
    expect(businessMutationSectionMap.address).toContain('business {')
    expect(businessMutationSectionMap.address).toContain('address {')
    expect(businessMutationSectionMap.address).toContain('line1')
    expect(businessMutationSectionMap.address).toContain('uprn')
  })

  test('it contains the correct mutation for phone', () => {
    expect(businessMutationSectionMap.phone).toContain('updateBusinessPhone(input: $updateBusinessPhoneInput)')
    expect(businessMutationSectionMap.phone).toContain('business {')
    expect(businessMutationSectionMap.phone).toContain('phone {')
    expect(businessMutationSectionMap.phone).toContain('landline')
    expect(businessMutationSectionMap.phone).toContain('mobile')
  })

  test('it contains the correct mutation for vat', () => {
    expect(businessMutationSectionMap.vat).toContain('updateBusinessVAT(input: $updateBusinessVATInput)')
    expect(businessMutationSectionMap.vat).toContain('business {')
    expect(businessMutationSectionMap.vat).toContain('vat')
    expect(businessMutationSectionMap.vat).toContain('success')
  })
})

describe('businessVariableTypeMap', () => {
  test('it contains the correct variable type for name', () => {
    expect(businessVariableTypeMap.name).toBe('$updateBusinessNameInput: UpdateBusinessNameInput!')
  })

  test('it contains the correct variable type for email', () => {
    expect(businessVariableTypeMap.email).toBe('$updateBusinessEmailInput: UpdateBusinessEmailInput!')
  })

  test('it contains the correct variable type for address', () => {
    expect(businessVariableTypeMap.address).toBe('$updateBusinessAddressInput: UpdateBusinessAddressInput!')
  })

  test('it contains the correct variable type for phone', () => {
    expect(businessVariableTypeMap.phone).toBe('$updateBusinessPhoneInput: UpdateBusinessPhoneInput!')
  })

  test('it contains the correct variable type for vat', () => {
    expect(businessVariableTypeMap.vat).toBe('$updateBusinessVATInput: UpdateBusinessVATInput!')
  })
})

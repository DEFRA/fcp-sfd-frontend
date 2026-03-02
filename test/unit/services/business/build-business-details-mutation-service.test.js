// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildBusinessDetailsMutationService } from '../../../../src/services/business/build-business-details-mutation-service.js'

// Test helpers
import { businessVariableTypeMap, businessMutationSectionMap } from '../../../../src/dal/mutations/business/update-business-details.js'

describe('buildBusinessDetailsMutationService', () => {
  let sectionsNeedingUpdate

  describe('when no sections need updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = []
    })

    test('returns null', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toBeNull()
    })
  })

  describe('when only the name section needs updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['name']
    })

    test('includes only the name variable definition', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessVariableTypeMap.name)

      expect(result).not.toContain(businessVariableTypeMap.email)
      expect(result).not.toContain(businessVariableTypeMap.phone)
      expect(result).not.toContain(businessVariableTypeMap.vat)
      expect(result).not.toContain(businessVariableTypeMap.address)
    })

    test('includes only the name mutation block', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessMutationSectionMap.name.trim())

      expect(result).not.toContain(businessMutationSectionMap.email.trim())
      expect(result).not.toContain(businessMutationSectionMap.phone.trim())
      expect(result).not.toContain(businessMutationSectionMap.vat.trim())
      expect(result).not.toContain(businessMutationSectionMap.address.trim())
    })
  })

  describe('when only the email section needs updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['email']
    })

    test('includes only the email variable definition', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessVariableTypeMap.email)

      expect(result).not.toContain(businessVariableTypeMap.name)
      expect(result).not.toContain(businessVariableTypeMap.phone)
      expect(result).not.toContain(businessVariableTypeMap.vat)
      expect(result).not.toContain(businessVariableTypeMap.address)
    })

    test('includes only the email mutation block', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessMutationSectionMap.email.trim())

      expect(result).not.toContain(businessMutationSectionMap.name.trim())
      expect(result).not.toContain(businessMutationSectionMap.phone.trim())
      expect(result).not.toContain(businessMutationSectionMap.vat.trim())
      expect(result).not.toContain(businessMutationSectionMap.address.trim())
    })
  })

  describe('when multiple sections need updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['name', 'email', 'vat']
    })

    test('includes all specified variable definitions', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessVariableTypeMap.name)
      expect(result).toContain(businessVariableTypeMap.email)
      expect(result).toContain(businessVariableTypeMap.vat)

      expect(result).not.toContain(businessVariableTypeMap.phone)
      expect(result).not.toContain(businessVariableTypeMap.address)
    })

    test('includes all specified mutation blocks', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessMutationSectionMap.name.trim())
      expect(result).toContain(businessMutationSectionMap.email.trim())
      expect(result).toContain(businessMutationSectionMap.vat.trim())

      expect(result).not.toContain(businessMutationSectionMap.phone.trim())
      expect(result).not.toContain(businessMutationSectionMap.address.trim())
    })
  })

  describe('when an invalid section is passed', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['name', 'invalid']
    })

    test('ignores unknown sections', () => {
      const result = buildBusinessDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(businessVariableTypeMap.name)
      expect(result).toContain(businessMutationSectionMap.name.trim())

      expect(result).not.toContain('invalid')
    })
  })
})

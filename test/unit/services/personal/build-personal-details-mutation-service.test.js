// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { buildPersonalDetailsMutationService } from '../../../../src/services/personal/build-personal-details-mutation-service.js'

// Test helpers
import { personalVariableTypeMap, personalMutationSectionMap } from '../../../../src/dal/mutations/personal/update-personal-details.js'

describe('buildPersonalDetailsMutationService', () => {
  let sectionsNeedingUpdate

  describe('when no sections need updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = []
    })

    test('returns null', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toBeNull()
    })
  })

  describe('when only the name section needs updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['name']
    })

    test('includes only the name variable definition', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalVariableTypeMap.name)

      expect(result).not.toContain(personalVariableTypeMap.email)
      expect(result).not.toContain(personalVariableTypeMap.phone)
      expect(result).not.toContain(personalVariableTypeMap.dateOfBirth)
      expect(result).not.toContain(personalVariableTypeMap.address)
    })

    test('includes only the name mutation block', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalMutationSectionMap.name.trim())

      expect(result).not.toContain(personalMutationSectionMap.email.trim())
      expect(result).not.toContain(personalMutationSectionMap.phone.trim())
      expect(result).not.toContain(personalMutationSectionMap.dateOfBirth.trim())
      expect(result).not.toContain(personalMutationSectionMap.address.trim())
    })
  })

  describe('when only the email section needs updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['email']
    })

    test('includes only the email variable definition', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalVariableTypeMap.email)

      expect(result).not.toContain(personalVariableTypeMap.name)
      expect(result).not.toContain(personalVariableTypeMap.phone)
      expect(result).not.toContain(personalVariableTypeMap.dateOfBirth)
      expect(result).not.toContain(personalVariableTypeMap.address)
    })

    test('includes only the email mutation block', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalMutationSectionMap.email.trim())

      expect(result).not.toContain(personalMutationSectionMap.name.trim())
      expect(result).not.toContain(personalMutationSectionMap.phone.trim())
      expect(result).not.toContain(personalMutationSectionMap.dateOfBirth.trim())
      expect(result).not.toContain(personalMutationSectionMap.address.trim())
    })
  })

  describe('when multiple sections need updating', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['name', 'email', 'dateOfBirth']
    })

    test('includes all specified variable definitions', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalVariableTypeMap.name)
      expect(result).toContain(personalVariableTypeMap.email)
      expect(result).toContain(personalVariableTypeMap.dateOfBirth)

      expect(result).not.toContain(personalVariableTypeMap.phone)
      expect(result).not.toContain(personalVariableTypeMap.address)
    })

    test('includes all specified mutation blocks', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalMutationSectionMap.name.trim())
      expect(result).toContain(personalMutationSectionMap.email.trim())
      expect(result).toContain(personalMutationSectionMap.dateOfBirth.trim())

      expect(result).not.toContain(personalMutationSectionMap.phone.trim())
      expect(result).not.toContain(personalMutationSectionMap.address.trim())
    })
  })

  describe('when an invalid section is passed', () => {
    beforeEach(() => {
      sectionsNeedingUpdate = ['name', 'invalid']
    })

    test('ignores unknown sections', () => {
      const result = buildPersonalDetailsMutationService(sectionsNeedingUpdate)

      expect(result).toContain(personalVariableTypeMap.name)
      expect(result).toContain(personalMutationSectionMap.name.trim())

      expect(result).not.toContain('invalid')
    })
  })
})

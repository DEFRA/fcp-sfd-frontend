// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsChangeLinksPresenter } from '../../../../src/presenters/business/business-details-change-links-presenter.js'

// Test helpers
import { constants } from '@defra/fcp-sfd-frontend-engine'
import { PERMISSION_GROUP } from '../../../../src/constants/scope/business-details.js'

// Mock dependencies
import { getConfigService } from '../../../../src/services/get-config-service.js'
import { isBusinessFieldAccessible } from '../../../../src/utils/feature-toggle/check-field-accessibility.js'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

// Mock imports
vi.mock('../../../../src/services/get-config-service.js', () => ({
  getConfigService: vi.fn()
}))

vi.mock('../../../../src/utils/feature-toggle/check-field-accessibility.js', () => ({
  isBusinessFieldAccessible: vi.fn()
}))

describe('businessDetailsChangeLinksPresenter', () => {
  let permissionLevel
  let hasValidBusinessDetails
  let sectionsNeedingUpdate

  beforeEach(() => {
    vi.clearAllMocks()

    // Default: interrupter ON
    getConfigService.mockReturnValue(true)

    // Default: every field is enabled by feature toggles
    isBusinessFieldAccessible.mockReturnValue(true)

    permissionLevel = PERMISSION_GROUP.VIEW
    hasValidBusinessDetails = true
    sectionsNeedingUpdate = []
  })

  describe('when the user has view permission', () => {
    test('it returns no change links and vat is null', () => {
      const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

      expect(result).toEqual({
        vat: null
      })
    })
  })

  describe('when the user has amend permission', () => {
    beforeEach(() => {
      permissionLevel = PERMISSION_GROUP.AMEND
    })

    describe('and there are no blocked sections', () => {
      beforeEach(() => {
        sectionsNeedingUpdate = ['address', 'phone']
      })

      test('it returns change links for address, phone, and email', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessAddress,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessPhone,
          businessEmail: BUSINESS_CHANGE_LINKS.businessEmail,
          vat: null
        })
      })
    })

    describe('and the user has blocked sections', () => {
      beforeEach(() => {
        sectionsNeedingUpdate = ['name'] // Amend cannot update 'name'
      })

      test('it returns the no permission placeholder links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          vat: null
        })
      })
    })

    describe('and the user has blocked sections and a field is disabled by a feature toggle', () => {
      beforeEach(() => {
        sectionsNeedingUpdate = ['name'] // Amend cannot update 'name'
      })

      describe('and the address toggle is disabled', () => {
        beforeEach(() => {
          isBusinessFieldAccessible.mockImplementation((fieldName) => {
            return fieldName !== 'address'
          })
        })

        test('it hides the address link and keeps the other placeholder links', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result).toEqual({
            businessAddress: null,
            businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
            businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
            vat: null
          })
        })
      })

      describe('and the phone toggle is disabled', () => {
        beforeEach(() => {
          isBusinessFieldAccessible.mockImplementation((fieldName) => {
            return fieldName !== 'phone'
          })
        })

        test('it hides the phone link and keeps the other placeholder links', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result).toEqual({
            businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
            businessTelephone: null,
            businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
            vat: null
          })
        })
      })

      describe('and the email toggle is disabled', () => {
        beforeEach(() => {
          isBusinessFieldAccessible.mockImplementation((fieldName) => {
            return fieldName !== 'email'
          })
        })

        test('it hides the email link and keeps the other placeholder links', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result).toEqual({
            businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
            businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
            businessEmail: null,
            vat: null
          })
        })
      })

      describe('and the parent toggle disables all business updates', () => {
        beforeEach(() => {
          isBusinessFieldAccessible.mockReturnValue(false)
        })

        test('it hides every link', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result).toEqual({
            businessAddress: null,
            businessTelephone: null,
            businessEmail: null,
            vat: null
          })
        })
      })
    })

    describe('when the interrupter feature toggle is ON', () => {
      beforeEach(() => {
        getConfigService.mockReturnValue(true)
        sectionsNeedingUpdate = ['name']
      })

      test('blocked sections still return placeholder links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          vat: null
        })
      })
    })
  })

  describe('when the user has legal permission', () => {
    beforeEach(() => {
      permissionLevel = PERMISSION_GROUP.LEGAL
    })

    describe('and all sections are valid', () => {
      beforeEach(() => {
        hasValidBusinessDetails = true
        sectionsNeedingUpdate = []
      })

      test('it returns normal links and vat is normal', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessAddress,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessPhone,
          businessEmail: BUSINESS_CHANGE_LINKS.businessEmail,
          businessName: BUSINESS_CHANGE_LINKS.businessName,
          vat: 'normal'
        })
      })
    })

    describe('and the interrupter feature toggle is ON', () => {
      describe('when a single section needs fixing', () => {
        describe('when VAT is the single invalid section', () => {
          beforeEach(() => {
            hasValidBusinessDetails = false
            sectionsNeedingUpdate = ['vat']
          })

          test('vat remains normal', () => {
            const result = businessDetailsChangeLinksPresenter(
              permissionLevel,
              hasValidBusinessDetails,
              sectionsNeedingUpdate
            )

            expect(result.vat).toBe('normal')
          })
        })

        describe('when a non-VAT section is the single invalid section', () => {
          beforeEach(() => {
            hasValidBusinessDetails = false
            sectionsNeedingUpdate = ['phone']
          })

          test('the single invalid section link points to the normal change page', () => {
            const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

            expect(result.businessTelephone).toEqual(BUSINESS_CHANGE_LINKS.businessPhone)
          })

          test('all other sections point to the business-fix page', () => {
            const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

            expect(result.businessAddress).toEqual('/business-fix?source=address')
            expect(result.businessEmail).toEqual('/business-fix?source=email')
            expect(result.businessName).toEqual('/business-fix?source=name')
            expect(result.vat).toEqual('interrupter')
          })
        })
      })

      describe('when multiple sections need fixing', () => {
        beforeEach(() => {
          hasValidBusinessDetails = false
          sectionsNeedingUpdate = ['phone', 'email']
        })

        test('all sections point to the business-fix page', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessAddress).toEqual('/business-fix?source=address')
          expect(result.businessTelephone).toEqual('/business-fix?source=phone')
          expect(result.businessEmail).toEqual('/business-fix?source=email')
          expect(result.businessName).toEqual('/business-fix?source=name')
          expect(result.vat).toEqual('interrupter')
        })
      })

      describe('when the single invalid section is name', () => {
        beforeEach(() => {
          hasValidBusinessDetails = false
          sectionsNeedingUpdate = ['name']
        })

        test('the name link points to normal change page, others point to business-fix', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessName).toBe(BUSINESS_CHANGE_LINKS.businessName)
          expect(result.businessAddress).toBe('/business-fix?source=address')
          expect(result.businessTelephone).toBe('/business-fix?source=phone')
          expect(result.businessEmail).toBe('/business-fix?source=email')
          expect(result.vat).toEqual('interrupter')
        })
      })

      describe('when business details are invalid but no sections are flagged', () => {
        beforeEach(() => {
          hasValidBusinessDetails = false
          sectionsNeedingUpdate = []
        })

        test('the interrupter is not active and all links are normal', () => {
          const result = businessDetailsChangeLinksPresenter(
            permissionLevel,
            hasValidBusinessDetails,
            sectionsNeedingUpdate
          )

          expect(result.businessAddress).toBe(BUSINESS_CHANGE_LINKS.businessAddress)
          expect(result.businessTelephone).toBe(BUSINESS_CHANGE_LINKS.businessPhone)
          expect(result.businessEmail).toBe(BUSINESS_CHANGE_LINKS.businessEmail)
          expect(result.businessName).toBe(BUSINESS_CHANGE_LINKS.businessName)
          expect(result.vat).toBe('normal')
        })
      })
    })

    describe('and the interrupter feature toggle is OFF', () => {
      beforeEach(() => {
        // interrupter OFF
        getConfigService.mockReturnValue(false)
      })

      describe('all sections valid', () => {
        beforeEach(() => {
          hasValidBusinessDetails = true
          sectionsNeedingUpdate = []
        })

        test('all links point to their standard change pages', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessAddress).toBe(BUSINESS_CHANGE_LINKS.businessAddress)
          expect(result.businessTelephone).toBe(BUSINESS_CHANGE_LINKS.businessPhone)
          expect(result.businessEmail).toBe(BUSINESS_CHANGE_LINKS.businessEmail)
          expect(result.businessName).toBe(BUSINESS_CHANGE_LINKS.businessName)
          expect(result.vat).toBe('normal')
        })
      })

      describe('some sections invalid', () => {
        beforeEach(() => {
          hasValidBusinessDetails = false
          sectionsNeedingUpdate = ['phone', 'name']
        })

        test('all links still point to their normal change pages', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessAddress).toBe(BUSINESS_CHANGE_LINKS.businessAddress)
          expect(result.businessTelephone).toBe(BUSINESS_CHANGE_LINKS.businessPhone)
          expect(result.businessEmail).toBe(BUSINESS_CHANGE_LINKS.businessEmail)
          expect(result.businessName).toBe(BUSINESS_CHANGE_LINKS.businessName)
          expect(result.vat).toBe('normal')
        })
      })
    })
  })

  describe('when a business field is disabled by a feature toggle', () => {
    beforeEach(() => {
      permissionLevel = PERMISSION_GROUP.LEGAL
    })

    describe('and the business name toggle is disabled', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockImplementation((fieldName) => {
          return fieldName !== 'name'
        })
      })

      test('it hides the business name link', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessName).toBeNull()
      })

      test('it keeps the other links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessAddress).not.toBeNull()
        expect(result.businessTelephone).not.toBeNull()
        expect(result.businessEmail).not.toBeNull()
        expect(result.vat).not.toBeNull()
      })
    })

    describe('and the business address toggle is disabled', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockImplementation((fieldName) => {
          return fieldName !== 'address'
        })
      })

      test('it hides the business address link', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessAddress).toBeNull()
      })

      test('it keeps the other links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessName).not.toBeNull()
        expect(result.businessTelephone).not.toBeNull()
        expect(result.businessEmail).not.toBeNull()
        expect(result.vat).not.toBeNull()
      })
    })

    describe('and the business phone toggle is disabled', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockImplementation((fieldName) => {
          return fieldName !== 'phone'
        })
      })

      test('it hides the business phone link', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessTelephone).toBeNull()
      })

      test('it keeps the other links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessName).not.toBeNull()
        expect(result.businessAddress).not.toBeNull()
        expect(result.businessEmail).not.toBeNull()
        expect(result.vat).not.toBeNull()
      })
    })

    describe('and the business email toggle is disabled', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockImplementation((fieldName) => {
          return fieldName !== 'email'
        })
      })

      test('it hides the business email link', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessEmail).toBeNull()
      })

      test('it keeps the other links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessName).not.toBeNull()
        expect(result.businessAddress).not.toBeNull()
        expect(result.businessTelephone).not.toBeNull()
        expect(result.vat).not.toBeNull()
      })
    })

    describe('and the VAT toggle is disabled', () => {
      beforeEach(() => {
        isBusinessFieldAccessible.mockImplementation((fieldName) => {
          return fieldName !== 'vat'
        })
      })

      test('it hides the VAT link', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vat).toBeNull()
      })

      test('it keeps the other links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessName).not.toBeNull()
        expect(result.businessAddress).not.toBeNull()
        expect(result.businessTelephone).not.toBeNull()
        expect(result.businessEmail).not.toBeNull()
      })
    })

    test('it hides every link when no field is accessible', () => {
      isBusinessFieldAccessible.mockReturnValue(false)

      const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

      expect(result).toEqual({
        businessAddress: null,
        businessTelephone: null,
        businessEmail: null,
        businessName: null,
        vat: null
      })
    })

    test('it still hides the link when the interrupter is active', () => {
      isBusinessFieldAccessible.mockImplementation((fieldName) => {
        return fieldName !== 'email'
      })
      hasValidBusinessDetails = false
      sectionsNeedingUpdate = ['email']

      const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

      expect(result.businessEmail).toBeNull()
    })
  })
})

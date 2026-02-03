// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsChangeLinksPresenter } from '../../../../src/presenters/business/business-details-change-links-presenter.js'

// Mock constants
import { BUSINESS_CHANGE_LINKS } from '../../../../src/constants/change-links.js'

// Mock dependencies
import { config } from '../../../../src/config/index.js'

// Mock imports
vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

describe('businessDetailsChangeLinksPresenter', () => {
  let permissionLevel
  let hasValidBusinessDetails
  let sectionsNeedingUpdate

  beforeEach(() => {
    vi.clearAllMocks()

    // Default: interrupter ON
    config.get.mockReturnValue(true)

    permissionLevel = 'view'
    hasValidBusinessDetails = true
    sectionsNeedingUpdate = []
  })

  describe('when the user has view permission', () => {
    test('it returns an empty object', () => {
      const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

      expect(result).toEqual({})
    })
  })

  describe('when the user has amend permission', () => {
    beforeEach(() => {
      permissionLevel = 'amend'
    })

    describe('and there are no blocked sections', () => {
      beforeEach(() => {
        sectionsNeedingUpdate = ['address', 'phone']
      })

      test('it returns change links for address, phone, and email', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessAddress,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessTelephone,
          businessEmail: BUSINESS_CHANGE_LINKS.businessEmail
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
          businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission
        })
      })
    })

    describe('when the interrupter feature toggle is ON', () => {
      beforeEach(() => {
        config.get.mockReturnValue(true)
        sectionsNeedingUpdate = ['name']
      })

      test('blocked sections still return placeholder links', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission,
          businessEmail: BUSINESS_CHANGE_LINKS.businessFixNameNoPermission
        })
      })
    })
  })

  describe('when the user has full permission', () => {
    beforeEach(() => {
      permissionLevel = 'full'
    })

    describe('and all sections are valid', () => {
      beforeEach(() => {
        hasValidBusinessDetails = true
        sectionsNeedingUpdate = []
      })

      test('it returns change links for address, phone, email, and business name', () => {
        const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result).toEqual({
          businessAddress: BUSINESS_CHANGE_LINKS.businessAddress,
          businessTelephone: BUSINESS_CHANGE_LINKS.businessTelephone,
          businessEmail: BUSINESS_CHANGE_LINKS.businessEmail,
          businessName: BUSINESS_CHANGE_LINKS.businessName
        })
      })
    })

    describe('and the interrupter feature toggle is ON', () => {
      describe('when a single section needs fixing', () => {
        beforeEach(() => {
          hasValidBusinessDetails = false
          sectionsNeedingUpdate = ['phone']
        })

        test('the single invalid section link points to the normal change page', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessTelephone).toEqual(BUSINESS_CHANGE_LINKS.businessTelephone)
        })

        test('all other sections point to the business-fix page', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessAddress).toEqual('/business-fix?source=address')
          expect(result.businessEmail).toEqual('/business-fix?source=email')
          expect(result.businessName).toEqual('/business-fix?source=name')
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
        })
      })
    })

    describe('and the interrupter feature toggle is OFF', () => {
      beforeEach(() => {
        // interrupter OFF
        config.get.mockReturnValue(false)
      })

      describe('all sections valid', () => {
        beforeEach(() => {
          hasValidBusinessDetails = true
          sectionsNeedingUpdate = []
        })

        test('all links point to their standard change pages', () => {
          const result = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

          expect(result.businessAddress).toBe(BUSINESS_CHANGE_LINKS.businessAddress)
          expect(result.businessTelephone).toBe(BUSINESS_CHANGE_LINKS.businessTelephone)
          expect(result.businessEmail).toBe(BUSINESS_CHANGE_LINKS.businessEmail)
          expect(result.businessName).toBe(BUSINESS_CHANGE_LINKS.businessName)
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
          expect(result.businessTelephone).toBe(BUSINESS_CHANGE_LINKS.businessTelephone)
          expect(result.businessEmail).toBe(BUSINESS_CHANGE_LINKS.businessEmail)
          expect(result.businessName).toBe(BUSINESS_CHANGE_LINKS.businessName)
        })
      })
    })
  })
})

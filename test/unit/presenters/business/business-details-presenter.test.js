// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details-presenter.js'

// Mock data
import { mappedData } from '../../../mocks/mock-business-details.js'

// Mock dependencies
import { businessDetailsChangeLinksPresenter } from '../../../../src/presenters/business/business-details-change-links-presenter.js'

// Mock imports
vi.mock('../../../../src/presenters/business/business-details-change-links-presenter.js', () => ({
  businessDetailsChangeLinksPresenter: vi.fn()
}))

describe('businessDetailsPresenter', () => {
  let yar
  let data
  let permissionLevel
  let hasValidBusinessDetails
  let sectionsNeedingUpdate

  beforeEach(() => {
    vi.clearAllMocks()

    // Deep clone the data to avoid mutation across tests
    data = JSON.parse(JSON.stringify(mappedData))

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }])
    }

    permissionLevel = 'view'
    hasValidBusinessDetails = true
    sectionsNeedingUpdate = []
    businessDetailsChangeLinksPresenter.mockReturnValue({ vat: null })
  })

  describe('when provided with business details data and view permission level', () => {
    test('it correctly presents the data', () => {
      const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

      expect(result).toEqual({
        backLink: {
          text: `Back to ${data.info.businessName}`,
          href: '/home'
        },
        businessNameHeader: data.info.businessName,
        notification: { title: 'Update', text: 'Business details updated successfully' },
        pageTitle: 'View business details',
        metaDescription: 'View and update your business details.',
        userName: data.customer.userName,
        businessAddress: {
          value: [
            'THE COACH HOUSE',
            'STOCKWELL HALL',
            '7 HAREWOOD AVENUE',
            'DARLINGTON',
            'Dorset',
            'CO9 3LS',
            'United Kingdom'
          ],
          changeLink: undefined,
          action: 'Change'
        },
        businessName: {
          value: data.info.businessName,
          changeLink: undefined,
          action: 'Change'
        },
        businessTelephone: {
          changeLink: undefined,
          action: 'Change',
          telephone: data.contact.landline,
          mobile: 'Not added'
        },
        businessEmail: {
          value: data.contact.email,
          changeLink: undefined,
          action: 'Change'
        },
        sbi: data.info.sbi,
        vatNumber: {
          action: null,
          changeLink: null,
          value: 'GB123456789'
        },
        tradeNumber: data.info.traderNumber,
        vendorRegistrationNumber: data.info.vendorNumber,
        countyParishHoldingNumbers: ['12/123/1234'],
        countyParishHoldingNumbersText: 'County Parish Holding (CPH) number',
        businessLegalStatus: {
          value: data.info.legalStatus,
          action: 'Change',
          changeLink: null
        },
        businessType: {
          value: data.info.type,
          action: 'Change',
          changeLink: null
        },
        permissionsText: 'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
      })
    })
  })

  describe('the "pageTitle" property', () => {
    describe('when the permissionLevel is view', () => {
      test('returns "View business details" when user has only view permission', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.pageTitle).toEqual('View business details')
      })
    })

    describe('when the permission level is amend', () => {
      beforeEach(() => {
        permissionLevel = 'amend'
      })

      test('returns "View and update your business details" when user has amend or full permission', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.pageTitle).toEqual('View and update your business details')
      })
    })

    describe('when the permission level is full', () => {
      beforeEach(() => {
        permissionLevel = 'full'
      })

      test('returns "View and update your business details" when user has amend or full permission', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.pageTitle).toEqual('View and update your business details')
      })
    })
  })

  describe('the "permissionsText" property', () => {
    describe('when the user has amend permission', () => {
      beforeEach(() => {
        permissionLevel = 'amend'
      })

      test('returns amend-level permissions text', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.permissionsText).toEqual(
          'You only have permission to update contact details for this business. You can ask the business to raise your permission level.'
        )
      })
    })

    describe('when the user has view permission', () => {
      beforeEach(() => {
        permissionLevel = 'view'
      })

      test('returns view-level permissions text', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.permissionsText).toEqual(
          'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
        )
      })
    })

    describe('when the user has full permission', () => {
      beforeEach(() => {
        permissionLevel = 'full'
      })

      test('returns null', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.permissionsText).toBeNull()
      })
    })
  })

  describe('the "backLink" property', () => {
    describe('when the businessName property is missing', () => {
      test('it should return the text "Back"', () => {
        data.info.businessName = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.backLink.text).toEqual('Back')
      })
    })
  })

  describe('the "businessTelephone" property', () => {
    describe('when both business telephone and mobile properties have values', () => {
      beforeEach(() => {
        data.contact.landline = '01234567890'
        data.contact.mobile = '07123456789'
      })

      test('it should return the actual values', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessTelephone.telephone).toEqual('01234567890')
        expect(result.businessTelephone.mobile).toEqual('07123456789')
      })

      test('the action text should be "Change"', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessTelephone.action).toEqual('Change')
      })
    })

    describe('when the telephone property is missing', () => {
      test('it should return the text "Not added"', () => {
        data.contact.landline = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessTelephone.telephone).toEqual('Not added')
      })
    })

    describe('when the businessMobile property is missing', () => {
      test('it should return the text "Not added"', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessTelephone.mobile).toEqual('Not added')
      })
    })

    describe('when both telephone and mobile properties are missing', () => {
      test('the action text should be "Add"', () => {
        data.contact.landline = null
        data.contact.mobile = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessTelephone.action).toEqual('Add')
      })
    })
  })

  describe('the "vatNumber" property', () => {
    describe('when the property is null for view only permission', () => {
      test('it should return "No number added" for value', () => {
        data.info.vat = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.value).toEqual('No number added')
      })

      test('it should return null for action and change link', () => {
        data.info.vat = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.action).toEqual(null)
        expect(result.vatNumber.changeLink).toEqual(null)
      })
    })

    describe('when the property is null for view full permission', () => {
      beforeEach(() => {
        businessDetailsChangeLinksPresenter.mockReturnValue({ vat: 'normal' })
      })

      test('it should return "No number added" for value', () => {
        data.info.vat = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.value).toEqual('No number added')
      })

      test('it should return "Add" for action and the change link', () => {
        data.info.vat = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.action).toEqual('Add')
        expect(result.vatNumber.changeLink).toEqual('/business-vat-registration-number-change')
      })
    })

    describe('when the property has a value for view permissions', () => {
      test('it should return the vat number', () => {
        data.info.vat = 'GB987654321'
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.value).toEqual('GB987654321')
      })
    })

    describe('when the property has a value for full permissions', () => {
      beforeEach(() => {
        businessDetailsChangeLinksPresenter.mockReturnValue({ vat: 'normal' })
      })

      test('it should return the vat number', () => {
        data.info.vat = 'GB987654321'
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.value).toEqual('GB987654321')
      })

      test('it should return the "Change and Remove links"', () => {
        data.info.vat = 'GB987654321'
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.action).toEqual('Change')
        expect(result.vatNumber.changeLink).toEqual({
          items: [
            {
              href: '/business-vat-registration-number-change',
              text: 'Change',
              visuallyHiddenText: 'VAT registration number',
              classes: 'govuk-link--no-visited-state'
            },
            {
              href: '/business-vat-registration-remove',
              text: 'Remove',
              visuallyHiddenText: 'VAT registration number',
              classes: 'govuk-link--no-visited-state'
            }
          ]
        })
      })
    })

    describe('when the property has a value for full permissions with interrupter', () => {
      beforeEach(() => {
        data.info.vat = 'GB987654321'
        businessDetailsChangeLinksPresenter.mockReturnValue({ vat: 'interrupter' })
      })

      test('it should return the vat number', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.value).toEqual('GB987654321')
      })

      test('it should return the "Change and Remove links" via business-fix', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.action).toEqual('Change')
        expect(result.vatNumber.changeLink).toEqual({
          items: [
            {
              href: '/business-fix?source=vat',
              text: 'Change',
              visuallyHiddenText: 'VAT registration number',
              classes: 'govuk-link--no-visited-state'
            },
            {
              href: '/business-fix?source=vat',
              text: 'Remove',
              visuallyHiddenText: 'VAT registration number',
              classes: 'govuk-link--no-visited-state'
            }
          ]
        })
      })
    })

    describe('when the property is null for full permissions with interrupter', () => {
      beforeEach(() => {
        data.info.vat = null
        businessDetailsChangeLinksPresenter.mockReturnValue({ vat: 'interrupter' })
      })

      test('it should return "No number added" for value', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.value).toEqual('No number added')
      })

      test('it should return "Add" for action and the change link via business-fix', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.action).toEqual('Add')
        expect(result.vatNumber.changeLink).toEqual('/business-fix?source=vat')
      })
    })
  })

  describe('the "cph" property', () => {
    describe('when there are multiple CPH numbers', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = [
          { cphNumber: '12/123/1234' },
          { cphNumber: '45/678/9012' }
        ]
      })

      test('it should return an array of CPH numbers', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.countyParishHoldingNumbers).toEqual(['12/123/1234', '45/678/9012'])
      })
    })

    describe('when the cph array is empty', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = []
      })

      test('it should return an array of CPH numbers', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.countyParishHoldingNumbers).toEqual([])
      })
    })

    describe('when the cph array has incorrect values', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = [
          { cphNumber: '123/456/7890' },
          { cphNumber: null },
          { cphNumber: undefined }
        ]
      })

      test('it should filter out incorrect values', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.countyParishHoldingNumbers).toEqual(['123/456/7890'])
      })
    })
  })

  describe('the "countyParishHoldingNumbersText" property', () => {
    describe('when there are no CPH numbers', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = []
      })

      test('it should return "County Parish Holding (CPH) number"', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.countyParishHoldingNumbersText).toEqual('County Parish Holding (CPH) number')
      })
    })

    describe('when there is 1 CPH number', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = [{ cphNumber: '12/123/1234' }]
      })

      test('it should return "County Parish Holding (CPH) number"', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.countyParishHoldingNumbersText).toEqual('County Parish Holding (CPH) number')
      })
    })

    describe('when there are multiple CPH numbers', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = [
          { cphNumber: '12/123/1234' },
          { cphNumber: '45/678/9012' }
        ]
      })

      test('it should return "County Parish Holding (CPH) numbers"', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.countyParishHoldingNumbersText).toEqual('County Parish Holding (CPH) numbers')
      })
    })
  })

  describe('the "tradeNumber" property', () => {
    describe('when the property is null', () => {
      test('it should return "null"', () => {
        data.info.traderNumber = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.tradeNumber).toEqual(null)
      })
    })
  })

  describe('the "vendorRegistrationNumber" property', () => {
    describe('when the property is null', () => {
      test('it should return null', () => {
        data.info.vendorNumber = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vendorRegistrationNumber).toEqual(null)
      })
    })
  })

  describe('the "notification" property', () => {
    describe('when yar is falsey', () => {
      test('it should return null', () => {
        yar = null
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.notification).toEqual(null)
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.customer.userName
      })

      test('it should return userName as null', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "businessNameHeader" property', () => {
    describe('when the business name property is missing', () => {
      beforeEach(() => {
        delete data.info.businessName
      })

      test('it should return businessNameHeader as null', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessNameHeader).toEqual(null)
      })
    })
  })

  describe('the "changeLinks" property', () => {
    describe('when the permission level is less than amend', () => {
      beforeEach(() => {
        permissionLevel = 'view'
        businessDetailsChangeLinksPresenter.mockReturnValue({})
      })

      test('it returns an empty object', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.vatNumber.changeLink).toEqual(null)
        expect(result.businessName.changeLink).toBeUndefined()
        expect(result.businessAddress.changeLink).toBeUndefined()
        expect(result.businessTelephone.changeLink).toBeUndefined()
        expect(result.businessEmail.changeLink).toBeUndefined()
        expect(result.businessType.changeLink).toEqual(null)
        expect(result.businessLegalStatus.changeLink).toEqual(null)
      })
    })

    describe('when the permission level is amend and there are no blockers', () => {
      beforeEach(() => {
        permissionLevel = 'amend'

        businessDetailsChangeLinksPresenter.mockReturnValue({
          businessAddress: '/business-address-change',
          businessTelephone: '/business-phone-numbers-change',
          businessEmail: '/business-email-change',
          vat: null
        })
      })

      test('returns the correct change links', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessAddress.changeLink).toEqual('/business-address-change')
        expect(result.businessTelephone.changeLink).toEqual('/business-phone-numbers-change')
        expect(result.businessEmail.changeLink).toEqual('/business-email-change')
        expect(result.vatNumber.changeLink).toEqual(null)
        expect(result.businessName.changeLink).toBeUndefined()
        expect(result.businessType.changeLink).toEqual(null)
        expect(result.businessLegalStatus.changeLink).toEqual(null)
      })
    })

    describe('when the permission level is full', () => {
      beforeEach(() => {
        permissionLevel = 'full'

        businessDetailsChangeLinksPresenter.mockReturnValue({
          businessAddress: '/business-address-change',
          businessTelephone: '/business-phone-numbers-change',
          businessEmail: '/business-email-change',
          businessName: '/business-name-change',
          vat: 'normal'
        })
      })

      test('returns the correct change links', () => {
        const result = businessDetailsPresenter(data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)

        expect(result.businessAddress.changeLink).toEqual('/business-address-change')
        expect(result.businessTelephone.changeLink).toEqual('/business-phone-numbers-change')
        expect(result.businessEmail.changeLink).toEqual('/business-email-change')
        expect(result.businessName.changeLink).toEqual('/business-name-change')
        expect(result.businessType.changeLink).toEqual('/business-type-change')
        expect(result.businessLegalStatus.changeLink).toEqual('/business-legal-status-change')
        expect(result.vatNumber.changeLink).toEqual({
          items: [
            {
              href: '/business-vat-registration-number-change',
              text: 'Change',
              visuallyHiddenText: 'VAT registration number',
              classes: 'govuk-link--no-visited-state'
            },
            {
              href: '/business-vat-registration-remove',
              text: 'Remove',
              visuallyHiddenText: 'VAT registration number',
              classes: 'govuk-link--no-visited-state'
            }
          ]
        })
      })
    })
  })
})

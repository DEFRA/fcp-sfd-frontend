// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details-presenter.js'

// Mock data
import { mappedData } from '../../../mocks/mock-business-details.js'

describe('businessDetailsPresenter', () => {
  let yar
  let data
  let permission = ['view']

  beforeEach(() => {
    vi.clearAllMocks()

    // Deep clone the data to avoid mutation across tests
    data = JSON.parse(JSON.stringify(mappedData))

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }])
    }
  })

  describe('when provided with business details data', () => {
    test('it correctly presents the data', () => {
      const result = businessDetailsPresenter(data, yar, permission)

      expect(result).toEqual({
        backLink: {
          text: `Back to ${data.info.businessName}`,
          href: '/home'
        },
        notification: { title: 'Update', text: 'Business details updated successfully' },
        pageTitle: 'View business details',
        metaDescription: 'View and update your business details.',
        userName: data.customer.userName,
        address: [
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          '7 HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ],
        businessName: data.info.businessName,
        businessTelephone: {
          telephone: data.contact.landline,
          mobile: 'Not added'
        },
        businessEmail: data.contact.email,
        sbi: data.info.sbi,
        vatNumber: data.info.vat,
        tradeNumber: data.info.traderNumber,
        vendorRegistrationNumber: data.info.vendorNumber,
        countyParishHoldingNumbers: ['12/123/1234'],
        countyParishHoldingNumbersText: 'County Parish Holding (CPH) number',
        businessLegalStatus: data.info.legalStatus,
        businessType: data.info.type,
        changeLinks: {},
        permissionsText: 'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
      })
    })
  })

  describe('the "pageTitle" property', () => {
    test('returns "View and update your business details" when user has amend or full permission', () => {
      const result = businessDetailsPresenter(data, yar, ['BUSINESS_DETAILS:AMEND'])

      expect(result.pageTitle).toEqual('View and update your business details')
    })

    test('returns "View business details" when user has only view permission', () => {
      const result = businessDetailsPresenter(data, yar, ['view'])

      expect(result.pageTitle).toEqual('View business details')
    })
  })

  describe('the "permissionsText" property', () => {
    test('returns amend-level permissions text when user has amend permission', () => {
      const result = businessDetailsPresenter(data, yar, ['BUSINESS_DETAILS:AMEND'])

      expect(result.permissionsText).toEqual(
        'You only have permission to update contact details for this business. You can ask the business to raise your permission level.'
      )
    })

    test('returns view-level permissions text when user has only view permission', () => {
      const result = businessDetailsPresenter(data, yar, ['view'])

      expect(result.permissionsText).toEqual(
        'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
      )
    })

    test('returns null when user has full permission', () => {
      const result = businessDetailsPresenter(data, yar, ['BUSINESS_DETAILS:FULL_PERMISSION'])

      expect(result.permissionsText).toBeNull()
    })
  })

  describe('the "backLink" property', () => {
    describe('when the businessName property is missing', () => {
      test('it should return the text "Back"', () => {
        data.info.businessName = null
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.backLink.text).toEqual('Back')
      })
    })
  })

  describe('the "businessTelephone" property', () => {
    describe('when both business telephone and mobile properties have values', () => {
      test('it should return the actual values', () => {
        data.contact.landline = '01234567890'
        data.contact.mobile = '07123456789'
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.businessTelephone.telephone).toEqual('01234567890')
        expect(result.businessTelephone.mobile).toEqual('07123456789')
      })
    })

    describe('when the telephone property is missing', () => {
      test('it should return the text "Not added"', () => {
        data.contact.landline = null
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.businessTelephone.telephone).toEqual('Not added')
      })
    })

    describe('when the businessMobile property is missing', () => {
      test('it should return the text "Not added"', () => {
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.businessTelephone.mobile).toEqual('Not added')
      })
    })
  })

  describe('the "vatNumber" property', () => {
    describe('when the property is null', () => {
      test('it should return null', () => {
        data.info.vat = null
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.vatNumber).toEqual('No number added')
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
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.countyParishHoldingNumbers).toEqual(['12/123/1234', '45/678/9012'])
      })
    })

    describe('when the cph array is empty', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = []
      })

      test('it should return an array of CPH numbers', () => {
        const result = businessDetailsPresenter(data, yar, permission)

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
        const result = businessDetailsPresenter(data, yar, permission)

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
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.countyParishHoldingNumbersText).toEqual('County Parish Holding (CPH) number')
      })
    })

    describe('when there is 1 CPH number', () => {
      beforeEach(() => {
        data.info.countyParishHoldingNumbers = [{ cphNumber: '12/123/1234' }]
      })

      test('it should return "County Parish Holding (CPH) number"', () => {
        const result = businessDetailsPresenter(data, yar, permission)

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
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.countyParishHoldingNumbersText).toEqual('County Parish Holding (CPH) numbers')
      })
    })
  })

  describe('the "traderNumber" property', () => {
    describe('when the property is null', () => {
      test('it should return null', () => {
        data.info.traderNumber = null
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.tradeNumber).toEqual(null)
      })
    })
  })

  describe('the "vendorRegistrationNumber" property', () => {
    describe('when the property is null', () => {
      test('it should return null', () => {
        data.info.vendorNumber = null
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.vendorRegistrationNumber).toEqual(null)
      })
    })
  })

  describe('the "notification" property', () => {
    describe('when yar is falsey', () => {
      test('it should return null', () => {
        yar = null
        const result = businessDetailsPresenter(data, yar, permission)

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
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "changeLinks" property', () => {
    describe('when the permission level is less than full and amend', () => {
      test('it returns an empty object', () => {
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.changeLinks).toEqual({})
      })
    })

    describe('when the permission level is amend', () => {
      beforeEach(() => {
        permission = ['BUSINESS_DETAILS:AMEND']
      })

      test('returns the correct change links', () => {
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.changeLinks).toEqual({
          businessAddress: {
            items: [
              {
                href: '/business-address-change',
                text: 'Change',
                visuallyHiddenText: 'business address'
              }
            ]
          },
          businessTelephone: {
            items: [
              {
                href: '/business-phone-numbers-change',
                text: 'Change',
                visuallyHiddenText: 'business phone numbers'
              }
            ]
          },
          businessEmail: {
            items: [
              {
                href: '/business-email-change',
                text: 'Change',
                visuallyHiddenText: 'business email address'
              }
            ]
          },
          amendPermission: true
        })
      })

      test('sets the amend permission property to true', () => {
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.changeLinks.amendPermission).toEqual(true)
      })

      test('returns the correct text if there is no landline of mobile', () => {
        delete data.contact.landline
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.changeLinks.businessTelephone.items[0].text).toEqual('Add')
      })
    })

    describe('when the permission level is full', () => {
      beforeEach(() => {
        permission = ['BUSINESS_DETAILS:FULL_PERMISSION']
      })

      describe('and a vat number is present', () => {
        test('returns the correct change links', () => {
          const result = businessDetailsPresenter(data, yar, permission)

          expect(result.changeLinks).toEqual({
            businessName: {
              items: [
                {
                  href: '/business-name-change',
                  text: 'Change',
                  visuallyHiddenText: 'business name'
                }
              ]
            },
            businessLegal: {
              items: [
                {
                  href: '/business-legal-status-change',
                  text: 'Change',
                  visuallyHiddenText: 'business legal status'
                }
              ]
            },
            businessType: {
              items: [
                {
                  href: '/business-type-change',
                  text: 'Change',
                  visuallyHiddenText: 'business type'
                }
              ]
            },
            businessAddress: {
              items: [
                {
                  href: '/business-address-change',
                  text: 'Change',
                  visuallyHiddenText: 'business address'
                }
              ]
            },
            businessTelephone: {
              items: [
                {
                  href: '/business-phone-numbers-change',
                  text: 'Change',
                  visuallyHiddenText: 'business phone numbers'
                }
              ]
            },
            businessEmail: {
              items: [
                {
                  href: '/business-email-change',
                  text: 'Change',
                  visuallyHiddenText: 'business email address'
                }
              ]
            },
            businessVatNumber: {
              items: [
                {
                  href: '/business-vat-registration-remove',
                  text: 'Remove',
                  visuallyHiddenText: 'VAT registration number'
                },
                {
                  href: '/business-vat-registration-number-change',
                  text: 'Change',
                  visuallyHiddenText: 'VAT registration number'
                }
              ]
            },
            fullPermission: true
          })
        })
      })

      describe('and a vat number is not present', () => {
        test('returns the correct change links', () => {
          delete data.info.vat
          const result = businessDetailsPresenter(data, yar, permission)

          expect(result.changeLinks.businessVatNumber).toEqual({
            items: [
              {
                href: '/business-vat-registration-number-change',
                text: 'Add',
                visuallyHiddenText: 'VAT registration number'
              }
            ]
          })
        })
      })

      test('sets the amend permission property to true', () => {
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.changeLinks.fullPermission).toEqual(true)
      })
    })
  })
})

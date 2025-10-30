// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details-presenter.js'

describe('businessDetailsPresenter', () => {
  let yar
  let data
  let permission = ['view']

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules() // vi is weird about clearing modules after each test, you must import AFTER calling reset
    const { mappedData } = await import('../../../mocks/mock-business-details.js')
    data = mappedData

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }])
    }
  })

  describe('when provided with business details data', () => {
    test('it correctly presents the data', () => {
      const result = businessDetailsPresenter(data, yar, permission)

      expect(result).toEqual({
        notification: { title: 'Update', text: 'Business details updated successfully' },
        pageTitle: 'View business details',
        metaDescription: 'View and update your business details.',
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
        businessLegalStatus: data.info.legalStatus,
        businessType: data.info.type,
        userName: data.customer.fullName,
        backLink: { href: '/home' },
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

  describe('when both business telephone and mobile properties have values', () => {
    test('it should return the actual values', () => {
      data.contact.landline = '01234567890'
      data.contact.mobile = '07123456789'
      const result = businessDetailsPresenter(data, yar, permission)

      expect(result.businessTelephone.telephone).toEqual('01234567890')
      expect(result.businessTelephone.mobile).toEqual('07123456789')
    })
  })

  describe('the "businessTelephone" property', () => {
    describe('when the landline property is missing', () => {
      test('it should return the text "Not added"', () => {
        data.contact.landline = null
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.businessTelephone.telephone).toEqual('Not added')
      })
    })
  })

  describe('the "businessMobile" property', () => {
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
    describe('when the property is empty', () => {
      test('it should return empty array', () => {
        data.info.countyParishHoldingNumbers = []
        const result = businessDetailsPresenter(data, yar, permission)

        expect(result.countyParishHoldingNumbers).toEqual([])
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

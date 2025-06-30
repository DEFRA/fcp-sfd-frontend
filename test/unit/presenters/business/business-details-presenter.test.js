// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessDetailsPresenter } from '../../../../src/presenters/business/business-details-presenter.js'

describe('businessDetailsPresenter', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      business: {
        organisationId: '5565448',
        sbi: '107183280',
        info: {
          name: 'HENLEY, RE',
          vat: 'GB123456789',
          traderNumber: '010203040506070880980',
          vendorNumber: '694523',
          legalStatus: { code: 102111, type: 'Sole Proprietorship' },
          type: { code: 101443, type: 'Not Specified' },
          address: {
            buildingNumberRange: '7',
            buildingName: 'STOCKWELL HALL',
            flatName: 'THE COACH HOUSE',
            street: 'HAREWOOD AVENUE',
            city: 'DARLINGTON',
            county: 'Dorset',
            postalCode: 'CO9 3LS',
            country: 'United Kingdom',
            dependentLocality: 'ELLICOMBE',
            doubleDependentLocality: 'WOODTHORPE',
            line1: 'Estate Office',
            line2: 'Crawley',
            line3: null,
            line4: null,
            line5: null
          },
          email: { address: 'henleyrej@eryelnehk.com.test' },
          phone: { mobile: null, landline: '01234031859' }
        }
      },
      customer: {
        info: {
          name: {
            first: 'Ingrid Jerimire Klaufichious Limouhetta Mortimious Neuekind Orpheus Perimillian Quixillotrio Reviticlese',
            last: 'Cook',
            title: 'Mrs.'
          }
        }
      }
    }

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }])
    }
  })

  describe('when provided with business details data', () => {
    test('it correctly presents the data', () => {
      const result = businessDetailsPresenter(data, yar)

      expect(result).toEqual({
        notification: { title: 'Update', text: 'Business details updated successfully' },
        pageTitle: 'View and update your business details',
        metaDescription: 'View and change the details for your business.',
        // address needs seperate test
        // address: ['10 Skirbeck Way', 'Lonely Lane', 'Maidstone', 'Somerset', 'SK22 1DL', 'United Kingdom'],
        businessName: data.business.info.name,
        businessTelephone: data.business.info.phone.landline,
        businessMobile: data.business.info.phone.mobile ?? 'Not added',
        businessEmail: data.business.info.email.address,
        sbi: data.business.sbi,
        vatNumber: data.business.info.vat,
        tradeNumber: data.business.info.traderNumber,
        vendorRegistrationNumber: data.business.info.vendorNumber,
        countyParishHoldingNumber: null, // CPH not available yet
        businessLegalStatus: data.business.info.legalStatus.type,
        businessType: data.business.info.type.type,
        userName: `${data.customer.info.name.title} ${data.customer.info.name.first} ${data.customer.info.name.last}`
      })
    })
  })

  describe('the "address" property', () => {
    describe('when the address has line properties and named properties', () => {
      beforeEach(() => {
      })

      test('it should use the named properties ', () => {
        const result = businessDetailsPresenter(data, yar)

        expect(result.address).toStrictEqual(['THE COACH HOUSE', '7', 'STOCKWELL HALL', 'HAREWOOD AVENUE', 'DARLINGTON', 'Dorset', 'CO9 3LS', 'United Kingdom'])
      })
    })

    describe('when the address has no named properties', () => {
      console.log(data)
      // remove the fields
      test('it should use the lined properties ', () => {
        const result = businessDetailsPresenter(data, yar)

        expect(result.address).toEqual(['Estate Office', 'Crawley'])
      })
    })

    describe('the "businessTelephone" property', () => {
      describe('when the businessAddress property is missing', () => {
        beforeEach(() => {
          data.business.info.phone.landline = null
        })

        test('it should return the text "Not added', () => {
          const result = businessDetailsPresenter(data, yar)

          expect(result.businessTelephone).toEqual('Not added')
        })
      })
    })

    describe('the "businessMobile" property', () => {
      describe('when the businessMobile property is missing', () => {
        test('it should return the text "Not added', () => {
          const result = businessDetailsPresenter(data, yar)

          expect(result.businessMobile).toEqual('Not added')
        })
      })
    })
  })
})

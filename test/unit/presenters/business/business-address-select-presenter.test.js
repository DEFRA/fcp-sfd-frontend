// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessAddressSelectPresenter } from '../../../../src/presenters/business/business-address-select-presenter.js'

describe('businessAddressSelectPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        businessName: 'Agile Farm Ltd',
        sbi: '123456789'
      },
      customer: {
        userName: 'Alfred Waldron'
      },
      changeBusinessPostcode: {
        postcode: 'SK22 1DL'
      },
      changeBusinessAddresses: [
        {
          uprn: '100000111111',
          displayAddress: 'Flat 3, Fake Court, 18, Maple Road, Westfield, Bristol, BS1 4AB'
        },
        {
          uprn: '100000222222',
          displayAddress: 'TechWorks Ltd, Customer Services, Innovation House, 42, Harbour Street, Manchester, M1 7YZ'
        }
      ]
    }
  })

  describe('when provided with business address select change data', () => {
    test('it correctly presents the data', () => {
      const result = businessAddressSelectPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-address-change' },
        pageTitle: 'Choose your business address',
        metaDescription: 'Choose the address for your business.',
        postcode: 'SK22 1DL',
        businessName: 'Agile Farm Ltd',
        sbi: '123456789',
        userName: 'Alfred Waldron',
        displayAddresses: [
          {
            value: 'display',
            text: '2 addresses found',
            selected: true
          },
          {
            value: '100000111111Flat 3, Fake Court, 18, Maple Road, Westfield, Bristol, BS1 4AB',
            text: 'Flat 3, Fake Court, 18, Maple Road, Westfield, Bristol, BS1 4AB',
            selected: false
          },
          {
            value: '100000222222TechWorks Ltd, Customer Services, Innovation House, 42, Harbour Street, Manchester, M1 7YZ',
            text: 'TechWorks Ltd, Customer Services, Innovation House, 42, Harbour Street, Manchester, M1 7YZ',
            selected: false
          }
        ]
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.info.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessAddressSelectPresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete data.info.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessAddressSelectPresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "displayAddresses" property', () => {
    describe('when provided with an additional address', () => {
      beforeEach(() => {
        data.changeBusinessAddresses.push({
          uprn: '100000333333',
          displayAddress: 'Willow Barn, Green Lane, Oakham Road, Little End, Middlethorpe, York, YO23 3ZX'
        })
      })

      test('it should return the correct number of addresses for the display summary option', () => {
        const result = businessAddressSelectPresenter(data)

        expect(result.displayAddresses[0].text).toEqual('3 addresses found')
      })
    })

    describe('when provided with only 1 address', () => {
      beforeEach(() => {
        data.changeBusinessAddresses = [{
          uprn: '100000333333',
          displayAddress: 'Willow Barn, Green Lane, Oakham Road, Little End, Middlethorpe, York, YO23 3ZX'
        }]
      })

      test('it should return the correct text for the display summary option', () => {
        const result = businessAddressSelectPresenter(data)

        expect(result.displayAddresses[0].text).toEqual('1 address found')
      })
    })

    describe('when a previously picked address exists', () => {
      beforeEach(() => {
        data.changeBusinessAddress = {
          uprn: '100000222222',
          displayAddress: 'TechWorks Ltd, Customer Services, Innovation House, 42, Harbour Street, Manchester, M1 7YZ'
        }
      })

      test('the matching address should be selected and the display option should not be selected', () => {
        const result = businessAddressSelectPresenter(data)

        expect(result.displayAddresses[0].selected).toBe(false)
        expect(result.displayAddresses[2].selected).toBe(true)
      })
    })
  })
})

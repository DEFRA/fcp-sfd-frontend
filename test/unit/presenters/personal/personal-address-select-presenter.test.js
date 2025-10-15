// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { personalAddressSelectPresenter } from '../../../../src/presenters/personal/personal-address-select-presenter.js'

describe('personalAddressSelectPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      info: {
        fullName: {
          fullNameJoined: 'Mr Test Name'
        }
      },
      changePersonalPostcode: {
        postcode: 'SK22 1DL'
      },
      changePersonalAddresses: [
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

  describe('when provided with personal address select change data', () => {
    test('it correctly presents the data', () => {
      const result = personalAddressSelectPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/account-address-change' },
        pageTitle: 'Choose your personal address',
        metaDescription: 'Choose the address for your personal account.',
        postcode: 'SK22 1DL',
        userName: 'Mr Test Name',
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

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.info.fullName.fullNameJoined
      })

      test('it should return userName as null', () => {
        const result = personalAddressSelectPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('the "displayAddresses" property', () => {
    describe('when provided with an additional address', () => {
      beforeEach(() => {
        data.changePersonalAddresses.push({
          uprn: '100000333333',
          displayAddress: 'Willow Barn, Green Lane, Oakham Road, Little End, Middlethorpe, York, YO23 3ZX'
        })
      })

      test('it should return the correct number of addresses for the display summary option', () => {
        const result = personalAddressSelectPresenter(data)

        expect(result.displayAddresses[0].text).toEqual('3 addresses found')
      })
    })

    describe('when provided with only 1 address', () => {
      beforeEach(() => {
        data.changePersonalAddresses = [{
          uprn: '100000333333',
          displayAddress: 'Willow Barn, Green Lane, Oakham Road, Little End, Middlethorpe, York, YO23 3ZX'
        }]
      })

      test('it should return the correct text for the display summary option', () => {
        const result = personalAddressSelectPresenter(data)

        expect(result.displayAddresses[0].text).toEqual('1 address found')
      })
    })

    describe('when a previously picked address exists', () => {
      beforeEach(() => {
        data.changePersonalAddress = {
          uprn: '100000222222',
          displayAddress: 'TechWorks Ltd, Customer Services, Innovation House, 42, Harbour Street, Manchester, M1 7YZ'
        }
      })

      test('the matching address should be selected and the display option should not be selected', () => {
        const result = personalAddressSelectPresenter(data)

        expect(result.displayAddresses[0].selected).toBe(false)
        expect(result.displayAddresses[2].selected).toBe(true)
      })
    })
  })
})

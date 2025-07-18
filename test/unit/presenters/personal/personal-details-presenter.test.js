// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { personalDetailsPresenter } from '../../../../src/presenters/personal/personal-details-presenter.js'

describe('personalDetailsPresenter', () => {
  let yar
  let data

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules() // vi is weird about clearing modules after each test, you must import AFTER calling reset
    const { mappedData } = await import('../../../mocks/mock-personal-details.js')
    data = mappedData

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Personal details updated successfully' }])
    }
  })

  describe('when provided with personal details data', () => {
    test('it correctly presents the data', () => {
      const result = personalDetailsPresenter(data, yar)

      expect(result).toEqual({
        notification: { title: 'Update', text: 'Personal details updated successfully' },
        pageTitle: 'View and update your personal details',
        metaDescription: 'View and update your personal details.',
        address: [
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          '7 HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ],
        crn: data.crn,
        fullName: data.customer.fullName,
        dateOfBirth: data.info.dateOfBirth,
        personalTelephone: data.contact.landline ?? 'Not added',
        personalMobile: data.contact.mobile ?? 'Not added',
        personalEmail: data.contact.email
      })
    })
  })

  describe('the "address" property', () => {
    describe('when the address has line properties and named properties', () => {
      test('it should use the named properties ', () => {
        const result = personalDetailsPresenter(data, yar)

        expect(result.address).toStrictEqual([
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          '7 HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ])
      })
    })

    describe('when the named properties include a building number', () => {
      test('it should prefix the street with the number', () => {
        const result = personalDetailsPresenter(data, yar)

        expect(result.address).toStrictEqual([
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          '7 HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ])
      })
    })

    describe('when the named properties does not have a building number', () => {
      test('it should leave the street property unchanged', () => {
        data.address.lookup.buildingNumberRange = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.address).toStrictEqual([
          'THE COACH HOUSE',
          'STOCKWELL HALL',
          'HAREWOOD AVENUE',
          'DARLINGTON',
          'Dorset',
          'CO9 3LS',
          'United Kingdom'
        ])
      })
    })

    describe('when the address has no named properties', () => {
      test('it should use the lined properties ', () => {
        data.address.lookup.flatName = null
        data.address.lookup.buildingNumberRange = null
        data.address.lookup.buildingName = null
        data.address.lookup.street = null
        data.address.lookup.city = null
        data.address.lookup.county = null

        const result = personalDetailsPresenter(data, yar)

        expect(result.address).toEqual([
          '76 Robinswood Road',
          'UPPER CHUTE',
          'Child Okeford',
          'CO9 3LS',
          'United Kingdom'
        ])
      })
    })
  })

  describe('the "personalTelephone" property', () => {
    describe('when the landline property is missing', () => {
      test('it should return the text "Not added', () => {
        data.contact.landline = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalTelephone).toEqual('Not added')
      })
    })
  })

  describe('the "personalMobile" property', () => {
    describe('when the personalMobile property is missing', () => {
      test('it should return the text "Not added', () => {
        const result = personalDetailsPresenter(data, yar)

        expect(result.personalMobile).toEqual('Not added')
      })
    })
  })

  describe('the "notification" property', () => {
    describe('when yar is falsey', () => {
      test('it should return null', () => {
        yar = null
        const result = personalDetailsPresenter(data, yar)

        expect(result.notification).toEqual(null)
      })
    })
  })
})

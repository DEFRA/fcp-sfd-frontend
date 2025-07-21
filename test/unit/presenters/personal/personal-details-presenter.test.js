// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { personalDetailsPresenter } from '../../../../src/presenters/personal/personal-details-presenter.js'

// Mock data
import { mappedData as originalData } from '../../../mocks/mock-personal-details.js'

describe('personalDetailsPresenter', () => {
  let yar
  let data

  beforeEach(() => {
    vi.clearAllMocks()

    // Deep clone the data to avoid mutation across tests
    data = JSON.parse(JSON.stringify(originalData))

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
        fullName: 'John M Doe', // Assumes your mock fullName is { first: 'John', middle: 'M', last: 'Doe' }
        dateOfBirth: data.info.dateOfBirth,
        personalTelephone: data.contact.telephone ?? 'Not added',
        personalMobile: data.contact.mobile ?? 'Not added',
        personalEmail: data.contact.email
      })
    })
  })

  describe('the "address" property', () => {
    test('uses the lookup address with building number + street combined', () => {
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

    test('leaves street unchanged if buildingNumberRange is missing', () => {
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

    test('falls back to manual address if lookup fields are all null', () => {
      Object.keys(data.address.lookup).forEach(key => {
        data.address.lookup[key] = null
      })

      const result = personalDetailsPresenter(data, yar)

      expect(result.address).toStrictEqual([
        '76 Robinswood Road',
        'UPPER CHUTE',
        'Child Okeford',
        'CO9 3LS',
        'United Kingdom'
      ])
    })
  })

  describe('the "personalTelephone" property', () => {
    test('returns "Not added" if telephone is missing', () => {
      data.contact.telephone = null

      const result = personalDetailsPresenter(data, yar)

      expect(result.personalTelephone).toBe('Not added')
    })
  })

  describe('the "personalMobile" property', () => {
    test('returns "Not added" if mobile is missing', () => {
      data.contact.mobile = null

      const result = personalDetailsPresenter(data, yar)

      expect(result.personalMobile).toBe('Not added')
    })
  })

  describe('the "notification" property', () => {
    test('returns null if yar is falsy', () => {
      const result = personalDetailsPresenter(data, null)

      expect(result.notification).toBe(null)
    })
  })
})

// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessNameChangePresenter } from '../../../../src/presenters/business/business-name-change-presenter.js'

describe('businessAddressEnterPresenter', () => {
  let data
  let payload

  beforeEach(() => {
    data = {
      sbi: '123456789',
      userName: 'Alfred Waldron',
      businessName: 'Agile Farm Ltd',
    }
  })

  describe('when provided with business address enter data', () => {
    test('it correctly presents the data', () => {
      const result = businessNameChangePresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-details' },
        pageTitle: 'What is your business name?',
        metaDescription: 'Update the name for your business.',
        businessName: 'Agile Farm Ltd',
        subHeader: {
          sbi: '123456789',
          userName: 'Alfred Waldron',
          businessName: 'Agile Farm Ltd'
        }
      })
    })
  })

  describe('the "subHeader.businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.subHeader.businessName).toEqual(null)
      })
    })
  })

  describe('the "subHeader.sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete data.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.subHeader.sbi).toEqual(null)
      })
    })
  })

  describe('the "subHeader.userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.userName
      })

      test('it should return userName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.subHeader.userName).toEqual(null)
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when provided with a payload', () => {
      beforeEach(() => {
        payload = {
          businessName: 'New name'
        }
      })

      test('it should return the payload as the businessName', () => {
        const result = businessNameChangePresenter(data, payload)

        expect(result.businessName).toEqual(payload)
      })
    })
  })
})

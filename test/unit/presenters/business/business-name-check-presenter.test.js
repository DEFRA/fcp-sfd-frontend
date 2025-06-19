// Test framework dependencies
import { describe, test, expect, beforeEach } from 'vitest'

// Thing under test
import { businessNameCheckPresenter } from '../../../../src/presenters/business/business-name-check-presenter.js'

describe('businessNameCheckPresenter', () => {
  let data

  beforeEach(() => {
    data = {
      sbi: '123456789',
      userName: 'Alfred Waldron',
      businessName: 'Agile Farm Ltd'
    }
  })

  describe('when provided with business name check data', () => {
    test('it correctly presents the data', () => {
      const result = businessNameCheckPresenter(data)

      expect(result).toEqual({
        backLink: { href: '/business-name-change' },
        cancelLink: '/business-details',
        changeLink: '/business-name-change',
        pageTitle: 'Check your business name is correct before submitting',
        metaDescription: 'Check the name for your business is correct.',
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
        const result = businessNameCheckPresenter(data)

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
        const result = businessNameCheckPresenter(data)

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
        const result = businessNameCheckPresenter(data)

        expect(result.subHeader.userName).toEqual(null)
      })
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessNameCheckPresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })
  })
})

// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessNameChangePresenter } from '../../../../src/presenters/business/business-name-change-presenter.js'

describe('businessNameChangePresenter', () => {
  let data
  let presenterData

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      businessName: 'Agile Farm Ltd',
      changeBusinessName: 'Agile Farm Ltd',
      sbi: '123456789',
      userName: 'Alfred Waldron'
    }

    presenterData = {
      backLink: { href: '/business-details' },
      pageTitle: 'What is your business name?',
      metaDescription: 'Update the name for your business.',
      businessName: 'Agile Farm Ltd',
      changeBusinessName: 'Agile Farm Ltd',
      sbi: '123456789',
      userName: 'Alfred Waldron'
    }
  })

  describe('when provided with business name change data', () => {
    test('it correctly presents the data', () => {
      const result = businessNameChangePresenter(data)

      expect(result).toEqual(presenterData)
    })
  })

  describe('the "businessName" property', () => {
    describe('when the businessName property is missing', () => {
      beforeEach(() => {
        delete data.businessName
      })

      test('it should return businessName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })

    describe('when the businessName property is undefined', () => {
      beforeEach(() => {
        data.businessName = undefined
      })

      test('it should return businessName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.businessName).toEqual(null)
      })
    })
  })

  describe('the "changeBusinessName" property', () => {
    describe('when the changeBusinessName property is missing', () => {
      beforeEach(() => {
        delete data.changeBusinessName
      })

      test('it should fallback to businessName value', () => {
        const result = businessNameChangePresenter(data)

        expect(result.changeBusinessName).toEqual('Agile Farm Ltd')
      })
    })

    describe('when the changeBusinessName property is undefined', () => {
      beforeEach(() => {
        data.changeBusinessName = undefined
      })

      test('it should fallback to businessName value', () => {
        const result = businessNameChangePresenter(data)

        expect(result.changeBusinessName).toEqual('Agile Farm Ltd')
      })
    })

    describe('when both changeBusinessName and businessName are missing', () => {
      beforeEach(() => {
        delete data.changeBusinessName
        delete data.businessName
      })

      test('it should return changeBusinessName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.changeBusinessName).toEqual(null)
      })
    })

    describe('when changeBusinessName is missing but businessName is undefined', () => {
      beforeEach(() => {
        delete data.changeBusinessName
        data.businessName = undefined
      })

      test('it should return changeBusinessName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.changeBusinessName).toEqual(null)
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when the sbi (singleBusinessIdentifier) property is missing', () => {
      beforeEach(() => {
        delete data.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })

    describe('when the sbi property is undefined', () => {
      beforeEach(() => {
        data.sbi = undefined
      })

      test('it should return sbi as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })
  })

  describe('the "userName" property', () => {
    describe('when the userName property is missing', () => {
      beforeEach(() => {
        delete data.userName
      })

      test('it should return userName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })

    describe('when the userName property is undefined', () => {
      beforeEach(() => {
        data.userName = undefined
      })

      test('it should return userName as null', () => {
        const result = businessNameChangePresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })
})

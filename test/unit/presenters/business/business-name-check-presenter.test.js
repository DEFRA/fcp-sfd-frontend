// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessNameCheckPresenter } from '../../../../src/presenters/business/business-name-check-presenter.js'

describe('businessNameCheckPresenter', () => {
  let data
  let presenterData
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      businessName: 'Agile Farm Ltd',
      changeBusinessName: 'Agile Farm Ltd',
      sbi: '123456789',
      userName: 'Alfred Waldron'
    }

    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }

    presenterData = {
      backLink: { href: '/business-name-change' },
      cancelLink: '/business-details',
      changeLink: '/business-name-change',
      pageTitle: 'Check your business name is correct before submitting',
      metaDescription: 'Check the name for your business is correct.',
      businessName: 'Agile Farm Ltd',
      changeBusinessName: 'Agile Farm Ltd',
      sbi: '123456789',
      userName: 'Alfred Waldron'
    }
  })

  describe('when called with complete data', () => {
    test('it correctly returns the data', () => {
      const result = businessNameCheckPresenter(data)
      expect(result).toEqual(presenterData)
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

    describe('when the businessName property is undefined', () => {
      beforeEach(() => {
        data.businessName = undefined
      })

      test('it should return businessName as null', () => {
        const result = businessNameCheckPresenter(data)

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
        const result = businessNameCheckPresenter(data)

        expect(result.changeBusinessName).toEqual('Agile Farm Ltd')
      })
    })

    describe('when the changeBusinessName property is undefined', () => {
      beforeEach(() => {
        data.changeBusinessName = undefined
      })

      test('it should fallback to businessName value', () => {
        const result = businessNameCheckPresenter(data)

        expect(result.changeBusinessName).toEqual('Agile Farm Ltd')
      })
    })

    describe('when both changeBusinessName and businessName are missing', () => {
      beforeEach(() => {
        delete data.changeBusinessName
        delete data.businessName
      })

      test('it should return changeBusinessName as null', () => {
        const result = businessNameCheckPresenter(data)

        expect(result.changeBusinessName).toEqual(null)
      })
    })

    describe('when changeBusinessName is missing but businessName is undefined', () => {
      beforeEach(() => {
        delete data.changeBusinessName
        data.businessName = undefined
      })

      test('it should return changeBusinessName as null', () => {
        const result = businessNameCheckPresenter(data)

        expect(result.changeBusinessName).toEqual(null)
      })
    })
  })

  describe('the "sbi" property', () => {
    describe('when the sbi property is missing', () => {
      beforeEach(() => {
        delete data.sbi
      })

      test('it should return sbi as null', () => {
        const result = businessNameCheckPresenter(data)

        expect(result.sbi).toEqual(null)
      })
    })

    describe('when the sbi property is undefined', () => {
      beforeEach(() => {
        data.sbi = undefined
      })

      test('it should return sbi as null', () => {
        const result = businessNameCheckPresenter(data)

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
        const result = businessNameCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })

    describe('when the userName property is undefined', () => {
      beforeEach(() => {
        data.userName = undefined
      })

      test('it should return userName as null', () => {
        const result = businessNameCheckPresenter(data)

        expect(result.userName).toEqual(null)
      })
    })
  })

  describe('when called with yar parameter', () => {
    test('it correctly presents data when provided with valid yar', () => {
      const result = businessNameCheckPresenter(data, yar)

      expect(result).toEqual(presenterData)
    })

    test('it correctly presents data when provided with no yar', () => {
      const result = businessNameCheckPresenter(data, null)

      expect(result).toEqual(presenterData)
    })
  })
})

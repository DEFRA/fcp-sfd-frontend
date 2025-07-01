// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessNameChangePresenter } from '../../../../src/presenters/business/business-name-change-presenter.js'

describe('businessNameChangePresenter', () => {
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
  })

  describe('when called with yar parameter', () => {
    test('it correctly presents data when provided with valid yar', () => {
      const result = businessNameChangePresenter(data, yar)

      expect(result).toEqual(presenterData)
    })

    test('it correctly presents data when provided with no yar', () => {
      const result = businessNameChangePresenter(data, null)

      expect(result).toEqual(presenterData)
    })
  })
})

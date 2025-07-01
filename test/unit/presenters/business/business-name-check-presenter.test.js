// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessNameCheckPresenter } from '../../../../src/presenters/business/business-name-check-presenter.js'

describe('businessNameCheckPresenter', () => {
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

  describe('when called', () => {
    test('it correctly returns the data', () => {
      const result = businessNameCheckPresenter(data)
      expect(result).toEqual(presenterData)
    })
  })
})

// Test framework dependencies
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Thing under test
import { businessEmailChangePresenter } from '../../../../src/presenters/business/business-email-change-presenter'
const businessEmail = 'business.email@test.com'
const changeBusinessEmail = 'change_business.email@test.com'

describe('businessEmailChangePresenter', () => {
  let data
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      businessName: 'Agile Farm Ltd',
      businessAddress: {
        address1: '10 Skirbeck Way',
        address2: 'Lonely Lane',
        city: 'Maidstone',
        county: 'Somerset',
        postcode: 'SK22 1DL',
        country: 'United Kingdom'
      },
      businessTelephone: '01234567890',
      businessMobile: '01234567890',
      businessEmail,
      changeBusinessEmail,
      singleBusinessIdentifier: '123456789',
      vatNumber: '',
      tradeNumber: '987654',
      vendorRegistrationNumber: '699368',
      countyParishHoldingNumber: '12/563/0998',
      businessLegalStatus: 'Sole proprietorship',
      businessType: 'Central or local government',
      userName: 'Alfred Waldron'
    }

    // Mock yar session manager
    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }
  })

  test('it correctly presents notification value when provided with valid yar', () => {
    const result = businessEmailChangePresenter(data, yar)

    expect(result).toEqual({
      notification: { title: 'Update', text: 'Business details updated successfully' },
      pageTitle: 'View and update your business details',
      metaDescription: 'View and change the details for your business.',
      businessEmail: changeBusinessEmail
    })
  })

  test('it correctly presents null notification value when provided with no yar', () => {
    const result = businessEmailChangePresenter(data, null)

    expect(result).toEqual({
      notification: null,
      pageTitle: 'View and update your business details',
      metaDescription: 'View and change the details for your business.',
      businessEmail: changeBusinessEmail
    })
  })
})

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { businessEmailChangePresenter } from '../../../../src/presenters/business/business-email-change-presenter'
import { dalData } from '../../../mocks/mock-business-details'

const businessEmail = 'business.email@test.com'
const changeBusinessEmail = 'change_business.email@test.com'

describe('businessEmailChangePresenter', () => {
  let data
  let presenterData
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      ...dalData,
      changeBusinessEmail
    }
    data.businessEmail = businessEmail

    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }

    presenterData = {
      backLink: { href: '/business-details' },
      pageTitle: 'View and update your business details',
      metaDescription: 'View and change the details for your business.',
      businessEmail: data.changeBusinessEmail,
      businessName: data.businessName,
      sbi: data.sbi,
      userName: data.userName
    }
  })

  test('it correctly presents notification value when provided with valid yar', () => {
    const result = businessEmailChangePresenter(data, yar)

    expect(result).toEqual(presenterData)
  })

  test('it correctly presents null notification value when provided with no yar', () => {
    const result = businessEmailChangePresenter(data, null)

    expect(result).toEqual(presenterData)
  })
})

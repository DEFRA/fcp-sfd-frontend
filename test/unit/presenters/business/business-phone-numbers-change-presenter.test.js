import { describe, test, expect, beforeEach, vi } from 'vitest'
import { businessPhoneNumbersChangePresenter } from '../../../../src/presenters/business/business-phone-numbers-change-presenter'
import { dalData } from '../../../mockObjects/mock-business-details'

const changeBusinessPhones = {
  telephone: '1234568765',
  mobile: '2222234567'
}

describe('businessPhoneNumbersChangePresenter', () => {
  let data
  let presenterData
  let yar

  beforeEach(() => {
    vi.clearAllMocks()

    data = {
      ...dalData,
      changeBusinessPhones
    }
    data.changeBusinessPhones = changeBusinessPhones

    yar = {
      flash: vi.fn().mockReturnValue([{ title: 'Update', text: 'Business details updated successfully' }]),
      set: vi.fn().mockReturnValue(data),
      get: vi.fn().mockReturnValue(data)
    }

    presenterData = {
      backLink: { href: '/business-details' },
      pageTitle: 'What are your business phone numbers?',
      metaDescription: 'Update the phone numbers for your business.',
      businessTelephone: data.changeBusinessPhones?.telephone ?? '',
      businessMobile: data.changeBusinessPhones?.mobile ?? '',
      businessName: data.businessName,
      sbi: data.sbi,
      userName: data.userName
    }
  })

  test('it correctly presents notification value when provided with valid yar', () => {
    const result = businessPhoneNumbersChangePresenter(data, yar)

    expect(result).toEqual(presenterData)
  })

  test('it correctly presents null notification value when provided with no yar', () => {
    const result = businessPhoneNumbersChangePresenter(data, null)

    expect(result).toEqual(presenterData)
  })
})

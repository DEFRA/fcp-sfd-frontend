import { describe, test, expect, beforeEach, vi } from 'vitest'
import { businessPhoneNumbersCheckPresenter } from '../../../../src/presenters/business/business-phone-numbers-check-presenter'
import { dalData } from '../../../mockObjects/mock-business-details'

const changeBusinessPhones = {
  telephone: '1234568765',
  mobile: '2222234567'
}

describe('businessPhoneNumbersCheckPresenter', () => {
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
      pageTitle: 'Check your business phone numbers are correct before submitting',
      metaDescription: 'Check the phone numbers for your business are correct.',
      businessTelephone: data.changeBusinessPhones?.telephone ?? 'Not added',
      businessMobile: data.changeBusinessPhones?.mobile ?? 'Not added',
      businessName: data.businessName,
      sbi: data.sbi,
      userName: data.userName
    }
  })

  test('it correctly presents notification value when provided with valid yar', () => {
    const result = businessPhoneNumbersCheckPresenter(data, yar)

    expect(result).toEqual(presenterData)
  })

  test('confirm Business-Telephone is empty when changeBusinessPhones.telephone value is Not added', () => {
    data.changeBusinessPhones.telephone = null
    const result = businessPhoneNumbersCheckPresenter(data, yar)

    expect(result.businessTelephone).toEqual('Not added')
  })

  test('confirm Business-Mobile is empty when changeBusinessPhones.mobile value is Not added', () => {
    data.changeBusinessPhones.mobile = null
    const result = businessPhoneNumbersCheckPresenter(data, yar)

    expect(result.businessMobile).toEqual('Not added')
  })

  test('it correctly presents null notification value when provided with no yar', () => {
    const result = businessPhoneNumbersCheckPresenter(data, null)

    expect(result).toEqual(presenterData)
  })
})

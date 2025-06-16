import { fetchBusinessPhoneNumbersService } from '../../services/business/fetch-business-phone-numbers-service.js'
import { saveBusinessPhoneNumbersService } from '../../services/business/save-business-phone-numbers-service.js'
import { businessPhoneNumberPresenter } from '../../presenters/business/business-phone-numbers-presenter.js'

const getBusinessPhoneNumbersCheck = {
  method: 'GET',
  path: '/business-phone-numbers-check',
  handler: async (request, h) => {
    const businessPhoneCheck = await fetchBusinessPhoneNumbersService(request.yar)
    const pageData = businessPhoneNumberPresenter(businessPhoneCheck)

    return h.view('business/business-phone-numbers-check', pageData)
  }
}

const postBusinessPhoneNumbersCheck = {
  method: 'POST',
  path: '/business-phone-numbers-check',
  handler: async (request, h) => {
    await saveBusinessPhoneNumbersService(request.yar)
    return h.redirect('/business-details')
  }
}

export const businessPhoneNumbersCheckRoutes = [
  getBusinessPhoneNumbersCheck,
  postBusinessPhoneNumbersCheck
]

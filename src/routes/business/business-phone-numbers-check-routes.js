import { businessPhoneNumbersCheckPresenter } from '../../presenters/business/business-phone-numbers-check-presenter.js'
import { fetchBusinessPhoneNumbersChangeService } from '../../services/business/fetch-business-phone-numbers-change-service.js'
import { updateBusinessPhoneNumbersChangeService } from '../../services/business/update-business-phone-numbers-change-service.js'

const getBusinessPhoneNumbersCheck = {
  method: 'GET',
  path: '/business-phone-numbers-check',
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessPhoneNumbersChangeService(request.yar, request.auth.credentials)
    const pageData = businessPhoneNumbersCheckPresenter(businessDetails)

    return h.view('business/business-phone-numbers-check', pageData)
  }
}

const postBusinessPhoneNumbersCheck = {
  method: 'POST',
  path: '/business-phone-numbers-check',
  handler: async (request, h) => {
    await updateBusinessPhoneNumbersChangeService(request.yar, request.auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessPhoneNumbersCheckRoutes = [
  getBusinessPhoneNumbersCheck,
  postBusinessPhoneNumbersCheck
]

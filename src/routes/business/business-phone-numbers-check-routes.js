import { fetchBusinessPhoneNumbersChangeService } from '../../services/business/fetch-business-phone-numbers-change-service.js'
import { updateBusinessPhoneNumbersChangeService } from '../../services/business/update-business-phone-numbers-change-service.js'
import { businessPhoneNumbersCheckPresenter } from '../../presenters/business/business-phone-numbers-check-presenter.js'

const getBusinessPhoneNumbersCheck = {
  method: 'GET',
  path: '/business-phone-numbers-check',
  handler: async (request, h) => {
    const businessPhoneumbersChange = await fetchBusinessPhoneNumbersChangeService(request.yar)
    const pageData = businessPhoneNumbersCheckPresenter(businessPhoneumbersChange, request.yar)

    return h.view('business/business-phone-numbers-check.njk', pageData)
  }
}

const postBusinessPhoneNumbersCheck = {
  method: 'POST',
  path: '/business-phone-numbers-check',
  handler: async (request, h) => {
    await updateBusinessPhoneNumbersChangeService(request.yar)
    return h.redirect('/business-details')
  }
}

export const businessPhoneNumbersCheckRoutes = [
  getBusinessPhoneNumbersCheck,
  postBusinessPhoneNumbersCheck
]

import { getBusinessEmailChangeService } from '../../services/business/get-business-email-change-service .js'
import { saveBusinessEmailChangeService } from '../../services/business/save-business-email-change-service.js'
import { businessEmailChangePresenter } from '../../presenters/business/business-email-change-presenter.js'
const getBusinessEmailCheck = {
  method: 'GET',
  path: '/business-email-check',
  handler: async (request, h) => {
    const businessEmailChange = await getBusinessEmailChangeService(request)
    const pageData = businessEmailChangePresenter(businessEmailChange, request.yar)

    return h.view('business/business-email-check.njk', pageData)
  }
}

const postBusinessEmailCheck = {
  method: 'POST',
  path: '/business-email-check',
  handler: async (request, h) => {
    await saveBusinessEmailChangeService(request.yar)
    return h.redirect('/business-details')
  }
}

export const businessEmailCheckRoutes = [
  getBusinessEmailCheck,
  postBusinessEmailCheck
]

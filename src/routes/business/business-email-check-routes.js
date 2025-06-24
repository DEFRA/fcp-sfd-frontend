import { fetchBusinessEmailChangeService } from '../../services/business/fetch-business-email-change-service.js'
import { updateBusinessEmailChangeService } from '../../services/business/update-business-email-change-service.js'
import { businessEmailChangePresenter } from '../../presenters/business/business-email-change-presenter.js'

const getBusinessEmailCheck = {
  method: 'GET',
  path: '/business-email-check',
  handler: async (request, h) => {
    const businessEmailChange = await fetchBusinessEmailChangeService(request.yar)
    const pageData = businessEmailChangePresenter(businessEmailChange, request.yar)

    return h.view('business/business-email-check.njk', pageData)
  }
}

const postBusinessEmailCheck = {
  method: 'POST',
  path: '/business-email-check',
  handler: async (request, h) => {
    await updateBusinessEmailChangeService(request.yar)
    return h.redirect('/business-details')
  }
}

export const businessEmailCheckRoutes = [
  getBusinessEmailCheck,
  postBusinessEmailCheck
]

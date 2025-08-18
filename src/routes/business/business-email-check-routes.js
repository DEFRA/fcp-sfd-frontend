import { fetchBusinessEmailChangeService } from '../../services/business/fetch-business-email-change-service.js'
import { updateBusinessEmailChangeService } from '../../services/business/update-business-email-change-service.js'
import { businessEmailCheckPresenter } from '../../presenters/business/business-email-check-presenter.js'

const getBusinessEmailCheck = {
  method: 'GET',
  path: '/business-email-check',
  handler: async (request, h) => {
    const { yar, auth, server } = request
    const businessEmailChange = await fetchBusinessEmailChangeService(yar, auth.credentials, server.app.tokenCache)
    const pageData = businessEmailCheckPresenter(businessEmailChange)

    return h.view('business/business-email-check', pageData)
  }
}

const postBusinessEmailCheck = {
  method: 'POST',
  path: '/business-email-check',
  handler: async (request, h) => {
    const { yar, auth, server } = request
    await updateBusinessEmailChangeService(yar, auth.credentials, server.app.tokenCache)

    return h.redirect('/business-details')
  }
}

export const businessEmailCheckRoutes = [
  getBusinessEmailCheck,
  postBusinessEmailCheck
]

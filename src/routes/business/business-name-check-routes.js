import { fetchBusinessNameChangeService } from '../../services/business/fetch-business-name-change-service.js'
import { updateBusinessNameChangeService } from '../../services/business/update-business-name-change-service.js'
import { businessNameCheckPresenter } from '../../presenters/business/business-name-check-presenter.js'

const getBusinessNameCheck = {
  method: 'GET',
  path: '/business-name-check',
  handler: async (request, h) => {
    const { yar, auth, server } = request
    const businessDetails = await fetchBusinessNameChangeService(yar, auth.credentials, server.app.tokenCache)
    const pageData = businessNameCheckPresenter(businessDetails)

    return h.view('business/business-name-check', pageData)
  }
}

const postBusinessNameCheck = {
  method: 'POST',
  path: '/business-name-check',
  handler: async (request, h) => {
    const { yar, auth, server } = request
    await updateBusinessNameChangeService(yar, auth.credentials, server.app.tokenCache)

    return h.redirect('/business-details')
  }
}

export const businessNameCheckRoutes = [
  getBusinessNameCheck,
  postBusinessNameCheck
]

import { fetchBusinessFixService } from '../../services/business/fetch-business-fix-service.js'
import { businessFixCheckPresenter } from '../../presenters/business/business-fix-check-presenter.js'
import { updateBusinessFixService } from '../../services/business/update-business-fix-service.js'

const getBusinessFixCheck = {
  method: 'GET',
  path: '/business-fix-check',
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('businessDetailsValidation')
    const businessDetails = await fetchBusinessFixService(auth.credentials, sessionData)
    const pageData = businessFixCheckPresenter(businessDetails)

    return h.view('business/business-fix-check.njk', pageData)
  }
}

const postBusinessFixCheck = {
  method: 'POST',
  path: '/business-fix-check',
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('businessDetailsValidation')
    await updateBusinessFixService(sessionData, yar, auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessFixCheckRoutes = [
  getBusinessFixCheck,
  postBusinessFixCheck
]

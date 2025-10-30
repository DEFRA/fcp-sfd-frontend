import { fetchPersonalDetailsService } from '../../services/personal/fetch-personal-details-service.js'
import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { personalDetailsPresenter } from '../../presenters/personal/personal-details-presenter.js'

const getPersonalDetails = {
  method: 'GET',
  path: '/personal-details',
  handler: async (request, h) => {
    const { yar, auth } = request
    yar.clear('personalDetails')

    const personalDetails = await fetchPersonalDetailsService(auth.credentials)
    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    const businessName = businessDetails.info.businessName
    const pageData = personalDetailsPresenter({ ...personalDetails, businessName }, yar)

    return h.view('personal/personal-details.njk', pageData)
  }
}

export const personalDetailsRoutes = [
  getPersonalDetails
]

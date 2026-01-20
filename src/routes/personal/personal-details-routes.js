import { fetchPersonalDetailsService } from '../../services/personal/fetch-personal-details-service.js'
import { personalDetailsPresenter } from '../../presenters/personal/personal-details-presenter.js'
import { validatePersonalDetailsService } from '../../services/personal/validate-personal-details-service.js'

const getPersonalDetails = {
  method: 'GET',
  path: '/personal-details',
  handler: async (request, h) => {
    const { yar, auth } = request
    yar.clear('personalDetails')
    yar.clear('personalDetailsValidation')

    const personalDetails = await fetchPersonalDetailsService(auth.credentials)
    const { hasValidPersonalDetails, sectionsNeedingUpdate } = validatePersonalDetailsService(personalDetails)

    if (!hasValidPersonalDetails) {
      yar.set('personalDetailsValidation', { personalDetailsValid: false, sectionsNeedingUpdate })
    }

    const pageData = personalDetailsPresenter(personalDetails, yar, hasValidPersonalDetails, sectionsNeedingUpdate)

    return h.view('personal/personal-details.njk', pageData)
  }
}

export const personalDetailsRoutes = [
  getPersonalDetails
]

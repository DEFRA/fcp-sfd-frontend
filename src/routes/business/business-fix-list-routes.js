import { setBusinessFixSessionDataService } from '../../services/business/set-business-fix-session-data-service.js'
import { businessFixListPresenter } from '../../presenters/business/business-fix-list-presenter.js'
import { validateFixDetailsService } from '../../services/validate-fix-details-service.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { fetchBusinessFixService } from '../../services/business/fetch-business-fix-service.js'
import { businessDetailsSchema } from '../../schemas/business/business-details-schema.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessFixList = {
  method: 'GET',
  path: '/business-fix-list',
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('businessDetailsValidation') || {}
    const businessDetails = await fetchBusinessFixService(auth.credentials, sessionData)
    const pageData = businessFixListPresenter(businessDetails)

    return h.view('business/business-fix-list.njk', pageData)
  }
}

const postBusinessFixList = {
  method: 'POST',
  path: '/business-fix-list',
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    const sessionData = yar.get('businessDetailsValidation')
    const validation = validateFixDetailsService(payload, sessionData.orderedSectionsToFix, businessDetailsSchema)

    if (validation.error) {
      const errors = formatValidationErrors(validation.error.details || [])
      const businessDetails = await fetchBusinessFixService(auth.credentials, sessionData)
      const pageData = businessFixListPresenter(businessDetails, payload, errors)

      return h.view('business/business-fix-list.njk', { ...pageData, errors }).code(BAD_REQUEST).takeover()
    }

    setBusinessFixSessionDataService(yar, sessionData, payload)

    return h.redirect('/business-fix-check')
  }
}

export const businessFixListRoutes = [
  getBusinessFixList,
  postBusinessFixList
]

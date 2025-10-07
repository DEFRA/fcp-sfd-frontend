/* import { personalDobSchema } from '../../schemas/personal/personal-dob-schema.js' import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
 */
import { personalDobChangePresenter } from '../../presenters/personal/personal-dob-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalDobChange = {
  method: 'GET',
  path: '/personal-dob-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob')
    const pageData = personalDobChangePresenter(personalDetails)
    return h.view('personal/personal-dob-change', pageData)
  }
}

const postPersonalDobChange = {
  method: 'POST',
  path: '/personal-dob-change',
  options: {
    handler: (request, h) => {
      setSessionData(request.yar, 'personalDetails', 'changePersonalDob', request.payload)

      return h.redirect('/personal-dob-check')
    }
  }
}

export const personalDobChangeRoutes = [
  getPersonalDobChange,
  postPersonalDobChange
]

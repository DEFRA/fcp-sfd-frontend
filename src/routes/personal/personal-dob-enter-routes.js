/* import { personalPhoneSchema } from '../../schemas/personal/personal-phone-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { personalPhoneNumbersChangePresenter } from '../../presenters/personal/personal-phone-numbers-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js' */

const getPersonalDobEnter = {
  method: 'GET',
  path: '/personal-dob-enter',
  handler: async (request, h) => {
    const pageData = {}
    return h.view('personal/personal-dob-enter', pageData)
  }
}


export const personalDobEnterRoutes = [
  getPersonalDobEnter
]

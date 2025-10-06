/* import { personalPhoneSchema } from '../../schemas/personal/personal-phone-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { personalPhoneNumbersChangePresenter } from '../../presenters/personal/personal-phone-numbers-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js' */

const getPersonalDobCheck = {
  method: 'GET',
  path: '/personal-dob-check',
  handler: async (request, h) => {
    const pageData = { pageTitle: 'Check your date of birth is correct before submitting',
      dobText: '2 November 1970'
    }
    return h.view('personal/personal-dob-check', pageData)
  }
}


export const personalDobCheckRoutes = [
  getPersonalDobCheck
]

import { fetchPersonalDetailsService } from '../../services/personal/fetch-personal-details-service.js'
import { fullNameChangePresenter } from '../../presenters/personal/full-name-change-presenter.js'
import { fullNameSchema } from '../../schemas/personal/full-name-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getFullNameChange = {
    method: 'GET',
    path: '/account-name-change',
    handler: async (request, h) => {
        const { yar, auth } = request
        const personalDetails = await fetchPersonalDetailsService(yar, auth.credentials)
        const pageData = fullNameChangePresenter(personalDetails)

        return h.view('personal/full-name-change', pageData)
    }
}

const postFullNameChange = {
    method: 'POST',
    path: '/account-name-change',
    options: {
        validate: {
            payload: fullNameSchema,
            options: { abortEarly: false },
            failAction: async (request, h, err) => {
                const errors = formatValidationErrors(err.details || [])
                const personalDetailsData = request.yar.get('personalDetails')
                const pageData = fullNameChangePresenter(personalDetailsData, request.payload.fullName)

                return h.view('personal/full-name-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
            }
        },
        handler: async (request, h) => {
            setSessionData(request.yar, 'personalDetails', 'changeFirstName', request.payload.fullName.firstName)
            setSessionData(request.yar, 'personalDetails', 'changeMiddleName', request.payload.fullName.middleName)
            setSessionData(request.yar, 'personalDetails', 'changeLastName', request.payload.fullName.lastName)

            return h.redirect('/account-name-check')
        }
    }
}

export const fullNameChangeRoutes = [
    getFullNameChange,
    postFullNameChange
]

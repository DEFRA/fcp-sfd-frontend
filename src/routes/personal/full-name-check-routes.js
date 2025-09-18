import { fetchFullNameChangeService } from '../../services/personal/fetch-full-name-change-service.js'
import { updateFullNameChangeService } from '../../services/personal/update-full-name-change-service.js'
import { fullNameCheckPresenter } from '../../presenters/personal/full-name-check-presenter.js'

const getFullNameCheck = {
    method: 'GET',
    path: '/account-name-check',
    handler: async (request, h) => {
        const { yar, auth } = request
        const personalDetails = await fetchFullNameChangeService(yar, auth.credentials)
        const pageData = fullNameCheckPresenter(personalDetails)

        return h.view('personal/full-name-check', pageData)
    }
}

const postFullNameCheck = {
    method: 'POST',
    path: '/account-name-check',
    handler: async (request, h) => {
        const { yar, auth } = request
        await updateFullNameChangeService(yar, auth.credentials)

        return h.redirect('/personal-details')
    }
}

export const fullNameCheckRoutes = [
    getFullNameCheck,
    postFullNameCheck
]

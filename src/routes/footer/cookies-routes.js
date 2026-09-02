import { utils, constants } from '@defra/fcp-sfd-frontend-engine'
import { getCurrentPolicy, updatePolicy } from '../../utils/cookies.js'
import { cookiesPresenter } from '../../presenters/footer/cookies-presenter.js'
import { cookiesSchema } from '../../schemas/footer/cookies-schema.js'

const getCookies = {
  method: 'GET',
  path: '/cookies',
  options: {
    auth: false
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    const cookiesPolicy = getCurrentPolicy(request, h)

    return h.view('cookies', {
      pageTitle: 'Cookies',
      heading: 'How we use cookies to store information about how you use this service.',
      backLink,
      ...cookiesPresenter(false, backLink, cookiesPolicy)
    })
  }
}

const postCookies = {
  method: 'POST',
  path: '/cookies',
  options: {
    auth: false,
    validate: {
      payload: cookiesSchema,
      options: { abortEarly: false },
      failAction: (request, h, err) => {
        const errors = utils.formatValidationErrors(err.details || [])
        const { payload } = request
        const cookiesPolicy = getCurrentPolicy(request, h)

        return h.view('cookies', {
          pageTitle: 'Cookies',
          heading: 'How we use cookies to store information about how you use this service.',
          backLink: payload.referer,
          ...cookiesPresenter(false, payload.referer, cookiesPolicy, errors)
        }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    }
  },
  handler: (request, h) => {
    const { payload } = request

    updatePolicy(request, h, payload.analytics)

    if (payload.async) {
      return h.response({ message: 'success' })
    }

    const cookiesPolicy = getCurrentPolicy(request, h)

    return h.view('cookies', {
      pageTitle: 'Cookies',
      heading: 'How we use cookies to store information about how you use this service.',
      backLink: payload.referer,
      ...cookiesPresenter(true, payload.referer, cookiesPolicy)
    })
  }
}

export const cookies = [
  getCookies,
  postCookies
]

import Joi from 'joi'
import { getCurrentPolicy, updatePolicy } from '../../cookies.js'
import { cookiesPresenter } from '../../presenters/footer/cookies-presenter.js'

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
      payload: Joi.object({
        analytics: Joi.boolean().required(),
        async: Joi.boolean().default(false),
        referer: Joi.string().allow('').default('')
      })
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

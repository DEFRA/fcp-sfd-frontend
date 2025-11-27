import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    yar.clear('businessDetails')

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    let newBusinessName = null
    if (request.headers.referer === 'http://localhost:3000/business-name-change') {
      newBusinessName = 'Clarksons New and improved Farm'
    }

    if (request.headers.referer === 'http://localhost:3000/business-email-change') {
      yar.set('businessDetails', { businessEmailChanged: true })
    }
    const pageData = businessDetailsPresenter(businessDetails, yar, request.auth.credentials.scope, newBusinessName)

    return h.view('business/business-details.njk', pageData)
  }
}

const postBusinessDetails = {
  method: 'POST',
  path: '/business-details',
  handler: async (request, h) => {
    let errors = false
    console.log('🚀 ~ request.payload:', request.payload)
    if (request.yar.get('businessDetails')?.businessEmailChanged) {
      errors = true
      request.yar.clear('businessDetails')

      const businessDetails = await fetchBusinessDetailsService(request.auth.credentials)
      const pageData = businessDetailsPresenter(businessDetails, request.yar, request.auth.credentials.scope)

      return h.view('business/business-details.njk', {...pageData, errors})
    }

    const newBusinessName = 'Clarksons New and improved Farm'
    return h.view('business/business-details-view.njk', {
      newBusinessName
    })
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails,
  postBusinessDetails
]

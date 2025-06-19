import { businessNameCheckPresenter } from '../../presenters/business/business-name-check-presenter.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const getBusinessNameCheck = {
  method: 'GET',
  path: '/business-name-check',
  handler: async (request, h) => {
    const sessionData = request.yar.get('businessNameChangeData')
    console.log('🚀 sessionData:', sessionData)
    const pageData = businessNameCheckPresenter(sessionData)

    return h.view('business/business-name-check', pageData)
  }
}

const postBusinessNameCheck = {
  method: 'POST',
  path: '/business-name-check',
  handler: (request, h) => {
    flashNotification(request.yar, 'Success', 'You have updated your business name')

    return h.redirect('/business-details')
  }
}

export const businessNameCheckRoutes = [
  getBusinessNameCheck,
  postBusinessNameCheck
]

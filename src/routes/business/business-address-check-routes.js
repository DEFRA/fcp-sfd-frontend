import { businessAddressCheckPresenter } from '../../presenters/business/business-address-check-presenter.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const getBusinessAddressCheck = {
  method: 'GET',
  path: '/business-address-check',
  handler: (request, h) => {
    const sessionData = request.yar.get('businessAddressEnterData')
    const pageData = businessAddressCheckPresenter(sessionData)

    return h.view('business/business-address-check', pageData)
  }
}

const postBusinessAddressCheck = {
  method: 'POST',
  path: '/business-address-check',
  handler: (request, h) => {
    flashNotification(request.yar, 'Success', 'You have updated your business address')

    return h.redirect('/business-details')
  }
}

export const businessAddressCheckRoutes = [
  getBusinessAddressCheck,
  postBusinessAddressCheck
]

import { businessAddressCheckPresenter } from '../../presenters/business/business-address-check-presenter.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { fetchUpdatedBusinessDataService } from '../../services/business/fetch-updated-business-data-service.js'


const getBusinessAddressCheck = {
  method: 'GET',
  path: '/business-address-check',
  handler: async (request, h) => {
    const businessAddressEnterData = await fetchUpdatedBusinessDataService(request.yar, 'businessAddress')
    const businessDetailsData = request.yar.get('businessDetails')

    const sessionData = request.yar.get('businessAddress')

    const pageData = businessAddressCheckPresenter(businessDetailsData, sessionData)

    return h.view('business/business-address-check', pageData)
  }
}

const postBusinessAddressCheck = {
  method: 'POST',
  path: '/business-address-check',
  handler: (request, h) => {
    const sessionData = request.yar.get('businessAddress')
    setSessionData(request.yar, 'businessDetails', 'businessAddress', sessionData)

    flashNotification(request.yar, 'Success', 'You have updated your business address')

    return h.redirect('/business-details')
  }
}

export const businessAddressCheckRoutes = [
  getBusinessAddressCheck,
  postBusinessAddressCheck
]

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessVatRemoveService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials)

  // TODO: Call the GraphQL mutation to remove the VAT number

  businessDetails.info.vat = null

  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have removed your business VAT number')
}

export {
  updateBusinessVatRemoveService
}

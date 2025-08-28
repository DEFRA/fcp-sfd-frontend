import { dalConnector } from '../../dal/connector.js'
import { updateBusinessVatMutation } from '../../dal/mutations/update-business-vat.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessVatRemoveService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials)
  console.log('businessDetails:::', businessDetails)

  const variables = { input: { vat: businessDetails.info.vat, sbi: businessDetails.info.sbi } }

  const response = await dalConnector(updateBusinessVatMutation, variables)

  if (response.errors) {
    throw new Error('DAL error from mutation')
  }

  businessDetails.info.vat = null

  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have removed your business VAT number')
}

export {
  updateBusinessVatRemoveService
}

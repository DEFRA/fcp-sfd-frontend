import { dalConnector } from '../../dal/connector.js'
import { updateBusinessVATMutation } from '../../dal/mutations/update-business-vat.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessVatRemoveService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, request)

  const variables = { input: { vat: '', sbi: businessDetails.info.sbi } }

  const response = await dalConnector(updateBusinessVATMutation, variables, request)

  if (response.errors) {
    throw new Error('DAL error from mutation')
  }

  businessDetails.info.vat = ''

  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have removed your VAT registration number')
}

export {
  updateBusinessVatRemoveService
}

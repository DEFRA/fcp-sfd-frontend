import { dalConnector } from '../../dal/connector.js'
import { updateBusinessVATMutation } from '../../dal/mutations/update-business-vat.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { getUserSessionToken } from '../../utils/get-user-session-token.js'

const updateBusinessVatChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, getUserSessionToken)

  const variables = { input: { vat: businessDetails.changeBusinessVat, sbi: businessDetails.info.sbi } }
  const response = await dalConnector(updateBusinessVATMutation, variables, getUserSessionToken)

  if (response.errors) {
    throw new Error('DAL error from mutation')
  }

  businessDetails.info.vat = businessDetails.changeBusinessVat
  delete businessDetails.changeBusinessVat

  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have updated your VAT registration number')
}

export {
  updateBusinessVatChangeService
}

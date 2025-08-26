import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { dalConnector } from '../../dal/connector.js'
import { updateBusinessVATMutation } from '../../dal/mutations/update-business-vat.js'

const updateBusinessVatChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials)

  // Set the variables
  const variables = { input: { vat: businessDetails.changeBusinessVat, sbi: businessDetails.info.sbi } }
  // DAL UPDATE HERE
  const response = await dalConnector(updateBusinessVATMutation, variables)

  if (response.errors || response.data.updateBusinessVat.success === false) { // review success status with CDP team
    throw new Error('DAL error from mutation')
  }

  businessDetails.info.vat = businessDetails.changeBusinessVat
  delete businessDetails.changeBusinessVat

  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have updated your business VAT number')
}

export {
  updateBusinessVatChangeService
}

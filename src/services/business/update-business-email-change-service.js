import { dalConnector } from '../../dal/connector.js'
import { updateBusinessEmailMutation } from '../../dal/mutations/update-business-email.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessEmailChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials)

  const variables = {
    input: {
      email: { address: businessDetails.changeBusinessEmail },
      sbi: businessDetails.info.sbi
    }
  }

  const response = await dalConnector(updateBusinessEmailMutation, variables, request)

  if (response.errors) {
    throw new Error('DAL error from mutation')
  }

  businessDetails.contact.email = businessDetails.changeBusinessEmail
  delete businessDetails.changeBusinessEmail

  yar.set('businessDetails', businessDetails)

  flashNotification(yar, 'Success', 'You have updated your business email address')
}

export {
  updateBusinessEmailChangeService
}

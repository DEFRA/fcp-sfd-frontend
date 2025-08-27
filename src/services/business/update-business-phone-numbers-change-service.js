import { dalConnector } from '../../dal/connector.js'
import { updateBusinessPhoneMutation } from '../../dal/mutations/update-business-phone-numbers.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessPhoneNumbersChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials)
  await updateBusinessPhone(businessDetails)

  // Update the cached data to now reflect the real data
  businessDetails.contact.landline = businessDetails.changeBusinessTelephone ?? null
  businessDetails.contact.mobile = businessDetails.changeBusinessMobile ?? null

  delete businessDetails.changeBusinessTelephone
  delete businessDetails.changeBusinessMobile

  yar.set('businessDetails', businessDetails)

  flashNotification(yar, 'Success', 'You have updated your business phone numbers')
}

const updateBusinessPhone = async (businessDetails) => {
  const variables = {
    input: {
      phone: {
        landline: businessDetails.changeBusinessTelephone ?? null,
        mobile: businessDetails.changeBusinessMobile ?? null
      },
      sbi: businessDetails.info.sbi
    }
  }

  const response = await dalConnector(updateBusinessPhoneMutation, variables)

  if (response.errors) {
    throw new Error('DAL error from mutation')
  }
}

export {
  updateBusinessPhoneNumbersChangeService
}

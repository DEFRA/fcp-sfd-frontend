import { updateBusinessPhoneNumbersMutation } from '../../dal/mutations/update-business-phone-numbers.js'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessPhoneNumbersChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessPhoneNumbers')
  const variables = {
    input: {
      phone: {
        landline: businessDetails.changeBusinessPhoneNumbers.businessTelephone ?? null,
        mobile: businessDetails.changeBusinessPhoneNumbers.businessMobile ?? null
      },
      sbi: businessDetails.info.sbi
    }
  }

  await updateDalService(updateBusinessPhoneNumbersMutation, variables)

  yar.clear('businessDetails')

  flashNotification(yar, 'Success', 'You have updated your business phone numbers')
}

export {
  updateBusinessPhoneNumbersChangeService
}

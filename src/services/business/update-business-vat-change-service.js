/**
 * Service to update a business's VAT registration number
 *
 * Fetches the pending VAT change from the session
 * Calls the DAL to persist the updated VAT number using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessVatChangeService
 */

import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { updateBusinessVATMutation } from '../../dal/mutations/update-business-vat.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessVatChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessVAT')
  const variables = { input: { vat: businessDetails.changeBusinessVAT, sbi: businessDetails.info.sbi } }

  await updateDalService(updateBusinessVATMutation, variables)

  yar.clear('businessDetails')

  flashNotification(yar, 'Success', 'You have updated your VAT registration number')
}

export {
  updateBusinessVatChangeService
}

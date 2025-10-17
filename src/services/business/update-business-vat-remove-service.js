/**
 * Service to remove a business's VAT registration number
 *
 * Fetches the current business details
 * Calls the DAL to remove the VAT number using updateDalService
 * Displays a success flash notification to the user
 *
 * Note: This service does not clear or update session data because the
 * remove VAT page does not store any changed data in the session.
 *
 * @module updateBusinessVatRemoveService
 */

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { updateBusinessVATMutation } from '../../dal/mutations/business/update-business-vat.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { getUserSessionToken } from '../../utils/get-user-session-token.js'

const updateBusinessVatRemoveService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(credentials, getUserSessionToken)
  const variables = { input: { vat: '', sbi: businessDetails.info.sbi } }

  await updateDalService(updateBusinessVATMutation, variables, getUserSessionToken)

  flashNotification(yar, 'Success', 'You have removed your VAT registration number')
}

export {
  updateBusinessVatRemoveService
}

/**
 * Service to update a business's email address
 *
 * Fetches the pending business email change from the session
 * Calls the DAL to persist the updated email using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessEmailChangeService
 */

import { updateDalService } from '../DAL/update-dal-service.js'
import { updateBusinessEmailMutation } from '../../dal/mutations/business/update-business-email.js'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { getUserSessionToken } from '../../utils/get-user-session-token.js'

const updateBusinessEmailChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, getUserSessionToken, 'changeBusinessEmail')

  const variables = { input: { email: { address: businessDetails.changeBusinessEmail }, sbi: businessDetails.info.sbi } }

  await updateDalService(updateBusinessEmailMutation, variables, getUserSessionToken)

  yar.clear('businessDetails')

  flashNotification(yar, 'Success', 'You have updated your business email address')
}

export {
  updateBusinessEmailChangeService
}

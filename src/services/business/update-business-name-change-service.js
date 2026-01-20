/**
 * Service to update a business's name
 *
 * Fetches the pending business name change from the session
 * Calls the DAL to persist the updated name using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessNameChangeService
 */

import { updateBusinessNameMutation } from '../../dal/mutations/business/update-business-name.js'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessNameChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessName')
  const variables = { input: { name: businessDetails.changeBusinessName, sbi: businessDetails.info.sbi } }

  await updateDalService(updateBusinessNameMutation, variables)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', 'You have updated your business name')
}

export {
  updateBusinessNameChangeService
}

/**
 * Updates the business name change data
 * @module updateBusinessNameChangeService
 */

import { updateBusinessNameMutation } from '../../dal/mutations/update-business-name.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessNameChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(credentials)
  const changedBusinessDetails = yar.get('businessDetails')

  const variables = { input: { name: changedBusinessDetails.changeBusinessName, sbi: businessDetails.info.sbi } }
  await updateDalService(updateBusinessNameMutation, variables)

  yar.clear('businessDetails')

  flashNotification(yar, 'Success', 'You have updated your business name')
}

export {
  updateBusinessNameChangeService
}

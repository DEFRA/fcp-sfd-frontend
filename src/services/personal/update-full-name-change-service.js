import { dalConnector } from '../../dal/connector.js'
import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateFullNameChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalDetailsService(yar, credentials)

  const variables = { input: { name: personalDetails.changeFullName, crn: personalDetails.info.crn } }

  const response = await dalConnector(variables)

  if (response.errors) {
    throw new Error('DAL error from mutation')
  }

  personalDetails.info.FullName = personalDetails.changeFullName
  delete personalDetails.changeFullName

  yar.set('personalDetails', personalDetails)

  flashNotification(yar, 'Success', 'You have updated your full name')
}

export {
  updatePersonalNameChangeService
}

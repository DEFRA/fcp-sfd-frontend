import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'

const fetchFullNameChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalDetailsService(yar, credentials)

  const changeFirstName = personalDetails.changeFirstName || personalDetails.info.fullName?.First || ''
  const changeMiddleName = personalDetails.changeMiddleName || personalDetails.info.fullName?.Middle || ''
  const changeLastName = personalDetails.changeLastName || personalDetails.info.fullName?.Last || ''
  const changeFullName = { First: changeFirstName, Middle: changeMiddleName, Last: changeLastName }

  const updatedPersonalDetails = { ...personalDetails, changeFullName }

  yar.set('personalDetails', updatedPersonalDetails)

  return updatedPersonalDetails
}

export {
  fetchFullNameChangeService
}

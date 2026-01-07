import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'

const fetchPersonalFixListService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalDetailsService(credentials)

  const session = yar.get(credentials.sessionId) || {}
  const personalFixList = session.personalFixList

  if (!personalFixList) {
    return personalDetails
  }

  // Merge each changed section into the live details
  if (personalFixList.data?.name) {
    personalDetails.changePersonalName = personalFixList.data.name
  }

  if (personalFixList.data?.dob) {
    personalDetails.changePersonalDOB = personalFixList.data.dob
  }

  if (personalFixList.data?.email) {
    personalDetails.changePersonalEmail = personalFixList.data.email
  }

  if (personalFixList.data?.phone) {
    personalDetails.changePersonalPhoneNumbers = personalFixList.data.phone
  }

  if (personalFixList.data?.address) {
    personalDetails.changePersonalAddress = personalFixList.data.address
  }

  return personalDetails
}

export {
  fetchPersonalFixListService
}

/**
 * Stores the Personal Fix List data on the session
 * @module setPersonalFixListSessionDataService
 */

/**
 * Takes the personal fix list payload and validation errors
 * and saves them into the session under the provided key/value.
 *
 * It fetches the existing session object, updates it, saves it back
 * and returns the updated session for reuse.
 */
const setPersonalFixListSessionDataService = (yar, key, payload, validationErrors = []) => {
  console.log('🚀 ~ validationErrors:', validationErrors)
  console.log('🚀 ~ payload:', payload)

  // Define what fields belong to each section
  const FIELD_GROUPS = {
    name: ['first', 'middle', 'last'],
    dob: ['day', 'month', 'year'],
    address: ['address1', 'address2', 'address3', 'city', 'county', 'postcode', 'country'],
    phone: ['personalTelephone', 'personalMobile'],
    email: ['personalEmail']
  }

  const sessionData = yar.get(key) || {}
  const groupedData = {}

  for (const section of validationErrors) {
    const fields = FIELD_GROUPS[section]

    if (!fields) {
      continue
    }

    groupedData[section] = {}

    for (const field of fields) {
      groupedData[section][field] = payload[field] ?? ''
    }
  }

  sessionData.personalFixList = {
    sections: validationErrors,
    data: groupedData
  }

  yar.set(key, sessionData)

  console.log('🚀 ~ sessionData:', sessionData)
  console.log('🚀 ~ sessionData personalFixList:', sessionData.personalFixList.data)

  return sessionData
}

export {
  setPersonalFixListSessionDataService
}

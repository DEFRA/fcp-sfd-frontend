/**
 * Takes the payload from a form and sets it on the session
 * @module setSessionDataService
 */

/**
 * Takes the payload from a form and sets it on the session
 *
 * Using the key provided this function will fetch the current session data already set on the state.
 * With that data it will then update the session with the users entered values from the payload. This uses the value
 * provided as the key to update the session data.
 *
 * It returns the newly updated session object to be used.
 *
 * @param {object} payload - The payload from the form that will be set on the session
 * @param {object} yar - The hapi `request.yar` object
 * @param {string} key - The key to fetch the current session data
 * @param {string} value - The object value
 *
 * @returns {object} - The updated session data object
 */
const setSessionDataService = (payload, yar, key, value) => {
  const sessionData = yar.get(key)
  sessionData[value] = payload
  yar.set(key, sessionData)

  return sessionData
}

export {
  setSessionDataService
}

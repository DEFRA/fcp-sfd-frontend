/**
 * @module allowListService
 */

import config from '../config/index.js'

const allowListMap = {
  fptt: {
    crn: 'allowLists.farmingPaymentsWhitelistCrns',
    sbi: 'allowLists.farmingPaymentsWhitelistSbis'
  }
}

const allowListService = (sbi, crn, schema) => {
  // Returns an array of allowed CRN's and SBI's
  const allowedCrnList = getAllowList(schema, 'crn')
  const allowedSbiList = getAllowList(schema, 'sbi')

  if (allowedCrnList.length === 0 || allowedSbiList.length === 0) {
    return false
  }

  return isAllowed(allowedCrnList, allowedSbiList, crn, sbi)
}

/**
 * Checks if the given CRN and SBI are in the allowed list.
 */
const isAllowed = (allowedCrnList, allowedSbiList, crn, sbi) => {
  return (
    allowedCrnList.includes(String(crn)) && allowedSbiList.includes(String(sbi))
  )
}

const getAllowList = (scheme, type) => {
  // Grab the relevant config key,
  // i.e if schema is 'fptt' and type is 'crn', the config key would be 'allowLists.farmingPaymentsWhitelistCrns'
  const configKey = allowListMap[scheme]?.[type]

  if (!configKey) {
    return []
  }

  // Allow list should be returned as a string of comma-separated values
  const allowList = config.get(configKey)

  if (!allowList) {
    return []
  }

  // The allow list is returned from the config as a string. This function splits the string into an array and trims
  // any whitespace
  const allowListArray = allowList.split(',').map((item) => {
    return item.trim()
  })

  return allowListArray.filter(Boolean)
}

export {
  allowListService
}

/**
 * Checks whether a given CRN and SBI are permitted for a scheme based on if they are present in their respective
 * allow lists.
 *
 * The service:
 * - Reads the string of allowed CRNs and SBIs from the config, which are expected to be comma-separated values
 * - Normalises the allow lists by splitting the string into an array and trimming whitespace
 * - Checks whether the provided CRN and SBI are included in their respective allow lists
 * - Returns `false` when allow lists are missing/empty or when either the CRN or SBI are not included
 *
 * @module allowListService
 */

import { config } from '../config/index.js'

const allowListMap = {
  farmingPayments: {
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
 * Returns `true` when both CRN and SBI are present in their respective allow lists.
 */
const isAllowed = (allowedCrnList, allowedSbiList, crn, sbi) => {
  return (
    allowedCrnList.includes(String(crn)) && allowedSbiList.includes(String(sbi))
  )
}

/**
 * Reads and parses the allow list for a given scheme and identifier type.
 * Returns an array of trimmed strings, or an empty array when not configured.
 */
const getAllowList = (scheme, type) => {
  // Grab the relevant config key,
  // i.e if schema is 'farmingPayments' and type is 'crn', the config key would be 'allowLists.farmingPaymentsWhitelistCrns'
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

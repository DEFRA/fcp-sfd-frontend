/**
 * Formats data ready for presenting in the `/account-address-enter` page
 * @module personalAddressEnterPresenter
 */

import { formatOriginalAddress, formatChangedAddress } from '../base-presenter.js'

const personalAddressEnterPresenter = (data, payload) => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Enter your personal address',
    metaDescription: 'Enter the address for your personal account.',
    userName: data.info.userName ?? null,
    address: formatAddress(payload, data.changePersonalAddress, data.address)
  }
}

/**
 * Formats an address for display based on the available data.
 *
 * The function prioritises the input parameters in the following order:
 *
 * 1. If `payload` exists, it returns `payload` as-is (usually due to a validation error).
 *
 * 2. If `changePersonalAddress` exists:
 *    - Returns a formatted address combining `flatName`, `buildingName`, and `buildingNumberRange` into `address1`
 *      if it contains a `uprn` (selected from address lookup).
 *
 *    - Otherwise, returns `changePersonalAddress` as-is (manually entered address).
 *
 * 3. If `originalAddress` exists:
 *    - Returns a formatted address from `lookup` if `lookup.uprn` is present (selected from postcode lookup).
 *    - Otherwise, returns a formatted address from `manual` lines.
 */
const formatAddress = (payload, changePersonalAddress, originalAddress) => {
  if (payload) {
    return payload
  }

  if (changePersonalAddress) {
    return formatChangedAddress(changePersonalAddress)
  }

  if (originalAddress) {
    return formatOriginalAddress(originalAddress)
  }

  return null
}

export {
  personalAddressEnterPresenter
}

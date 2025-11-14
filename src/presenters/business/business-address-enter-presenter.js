/**
 * Formats data ready for presenting in the `/business-address-enter` page
 * @module businessAddressEnterPresenter
 */

import { formatOriginalAddress, formatChangedAddress } from '../base-presenter.js'

const businessAddressEnterPresenter = (data, payload) => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    userName: data.customer.userName ?? null,
    address: formatAddress(payload, data.changeBusinessAddress, data.address),
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null
  }
}

/**
 * Formats an address for display based on the available data.
 *
 * The function prioritises the input parameters in the following order:
 *
 * 1. If `payload` exists, it returns `payload` as-is (usually due to a validation error).
 *
 * 2. If `changeBusinessAddress` exists:
 *    - Returns a formatted address combining `flatName`, `buildingName`, and `buildingNumberRange` into `address1`
 *      if it contains a `uprn` (selected from address lookup).
 *
 *    - Otherwise, returns `changeBusinessAddress` as-is (manually entered address).
 *
 * 3. If `originalAddress` exists:
 *    - Returns a formatted address from `lookup` if `lookup.uprn` is present (selected from postcode lookup).
 *    - Otherwise, returns a formatted address from `manual` lines.
 */
const formatAddress = (payload, changeBusinessAddress, originalAddress) => {
  if (payload) {
    return payload
  }

  if (changeBusinessAddress) {
    return formatChangedAddress(changeBusinessAddress)
  }

  if (originalAddress) {
    return formatOriginalAddress(originalAddress)
  }

  return null
}

export {
  businessAddressEnterPresenter
}

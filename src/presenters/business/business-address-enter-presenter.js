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
 * 1. If `payload` exists, it is returned as-is.
 *    This usually occurs when validation has failed and the form needs to be
 *    re-rendered with the user's submitted values.
 *
 * 2. If `changeBusinessAddress` exists:
 *    - If it contains a `uprn`, it indicates the address was selected from
 *      the postcode lookup. The lookup fields are mapped into the manual
 *      address structure used by the form:
 *        - `address1` → `pafOrganisationName`, `flatName`, `buildingName`
 *        - `address2` → `buildingNumberRange` + `street`
 *        - `address3` → `doubleDependentLocality`, `dependentLocality`
 *
 *    - If no `uprn` is present, the address is assumed to have been manually
 *      entered and is returned as-is.
 *
 * 3. If `originalAddress` exists:
 *    - If `lookup.uprn` is present, the lookup address is mapped into the
 *      manual address structure used by the form.
 *    - Otherwise, the manual address lines (`line1`–`line5`) are used.
 *
 * Returns `null` if no address data is available.
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

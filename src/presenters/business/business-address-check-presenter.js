/**
 * Formats data ready for presenting in the `/business-address-check` page
 * @module businessAddressCheckPresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const businessAddressCheckPresenter = (businessDetails) => {
  const { changeBusinessAddress, address, info, customer } = businessDetails

  return {
    backLink: backLink(changeBusinessAddress?.postcodeLookup),
    changeLink: changeLink(changeBusinessAddress?.postcodeLookup),
    pageTitle: 'Check your business address is correct before submitting',
    metaDescription: 'Check the address for your business is correct.',
    userName: customer.userName ?? null,
    address: formatAddress(changeBusinessAddress, address),
    businessName: info.businessName ?? null,
    sbi: info.sbi ?? null
  }
}

/**
 * Formats the business address into an array of address parts.
 *
 * When the user has a pending change in the session (`changeBusinessAddress`) that flat
 * address is used, removing falsy values and, for postcode lookup selections, the `uprn`,
 * `displayAddress` and `postcodeLookup` keys.
 *
 * When there is no pending change, the address falls back to the business address mapped
 * from the DAL. This has a nested `{ lookup, manual, ... }` shape, so it is formatted with
 * the shared `formatDisplayAddress` helper to avoid rendering `[object Object]`.
 */
const formatAddress = (changeBusinessAddress, address) => {
  if (!changeBusinessAddress) {
    return presenters.formatDisplayAddress(address)
  }

  if (changeBusinessAddress.postcodeLookup) {
    const { uprn, displayAddress, postcodeLookup, ...addressParts } = changeBusinessAddress

    return Object.values(addressParts).filter(Boolean)
  }

  return Object.values(changeBusinessAddress).filter(Boolean)
}

const backLink = (postcodeLookup) => {
  if (postcodeLookup) {
    return { href: '/business-address-select' }
  } else {
    return { href: '/business-address-enter' }
  }
}

const changeLink = (postcodeLookup) => {
  if (postcodeLookup) {
    return '/business-address-change'
  } else {
    return '/business-address-enter'
  }
}

export {
  businessAddressCheckPresenter
}

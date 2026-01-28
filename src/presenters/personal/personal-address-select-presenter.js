/**
 * Formats data ready for presenting in the `/account-address-select` page
 * @module personalAddressSelectPresenter
 */

import { formatDisplayAddresses } from '../base-presenter.js'

const personalAddressSelectPresenter = (data) => {
  return {
    backLink: { href: '/account-address-change' },
    pageTitle: 'Choose your personal address',
    metaDescription: 'Choose the address for your personal account.',
    userName: data.info.userName ?? null,
    postcode: data.changePersonalPostcode.postcode,
    displayAddresses: formatDisplayAddresses(data.changePersonalAddresses, data.changePersonalAddress)
  }
}

export {
  personalAddressSelectPresenter
}

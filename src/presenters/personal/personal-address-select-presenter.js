/**
 * Formats data ready for presenting in the `/account-address-select` page
 * @module personalAddressSelectPresenter
 */

import { constants, presenters } from '@defra/fcp-sfd-frontend-engine'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external

const personalAddressSelectPresenter = (data) => {
  return {
    backLink: { href: PERSONAL_CHANGE_LINKS.personalAddress },
    postcodeChangeLink: PERSONAL_CHANGE_LINKS.personalAddress,
    manualAddressLink: '/account-address-enter',
    pageTitle: 'Choose your personal address',
    metaDescription: 'Choose the address for your personal account.',
    userName: data.userName ?? null,
    postcode: data.changePersonalPostcode?.postcode ?? null,
    displayAddresses: presenters.formatDisplayAddresses(data.changePersonalAddresses ?? [], data.changePersonalAddress)
  }
}

export {
  personalAddressSelectPresenter
}

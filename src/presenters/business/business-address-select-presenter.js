/**
 * Formats data ready for presenting in the `/business-address-select` page
 * @module businessAddressSelectPresenter
 */

import { constants, presenters } from '@defra/fcp-sfd-frontend-engine'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

const businessAddressSelectPresenter = (data) => {
  return {
    backLink: { href: BUSINESS_CHANGE_LINKS.businessAddress },
    postcodeChangeLink: BUSINESS_CHANGE_LINKS.businessAddress,
    manualAddressLink: '/business-address-enter',
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    userName: data.customer.userName ?? null,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null,
    postcode: data.changeBusinessPostcode?.postcode ?? null,
    displayAddresses: presenters.formatDisplayAddresses(data.changeBusinessAddresses ?? [], data.changeBusinessAddress)
  }
}

export {
  businessAddressSelectPresenter
}

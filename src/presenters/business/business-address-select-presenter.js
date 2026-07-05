/**
 * Formats data ready for presenting in the `/business-address-select` page
 * @module businessAddressSelectPresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const businessAddressSelectPresenter = (data) => {
  return {
    backLink: { href: '/business-address-change' },
    postcodeChangeLink: '/business-address-change',
    manualAddressLink: '/business-address-enter',
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    userName: data.customer.userName ?? null,
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    postcode: data.changeBusinessPostcode.postcode,
    displayAddresses: presenters.formatDisplayAddresses(data.changeBusinessAddresses, data.changeBusinessAddress)
  }
}

export {
  businessAddressSelectPresenter
}

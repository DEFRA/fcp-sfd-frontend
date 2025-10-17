/**
 * Formats data ready for presenting in the `/business-address-select` page
 * @module businessAddressSelectPresenter
 */

import { formatDisplayAddresses } from '../base-presenter.js'

const businessAddressSelectPresenter = (data) => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null,
    postcode: data.changeBusinessPostcode.postcode,
    displayAddresses: formatDisplayAddresses(data.changeBusinessAddresses, data.changeBusinessAddress)
  }
}

export {
  businessAddressSelectPresenter
}

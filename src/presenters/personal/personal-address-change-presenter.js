/**
 * Formats data ready for presenting in the `/account-address-change` page
 * @module personalAddressChangePresenter
 */

import { formatFirstLastName } from '../base-presenter.js'

const personalAddressChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal address?',
    metaDescription: 'Update the address for your personal account.',
    userName: formatFirstLastName(data.info.fullName) || null,
    postcode: payload ?? data.changePersonalPostcode?.postcode ?? data.address.postcode
  }
}

export {
  personalAddressChangePresenter
}

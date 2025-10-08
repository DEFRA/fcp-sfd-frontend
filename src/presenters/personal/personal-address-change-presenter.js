/**
 * Formats data ready for presenting in the `/account-address-change` page
 * @module personalAddressChangePresenter
 */

const personalAddressChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal address?',
    metaDescription: 'Update the address for your personal account.',
    postcode: payload ?? data.changePersonalPostcode?.postcode ?? data.address.postcode,
    userName: data.info.fullName.fullNameJoined ?? null
  }
}

export {
  personalAddressChangePresenter
}

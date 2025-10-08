/**
 * Formats data ready for presenting in the `/personal-address-change` page
 * @module personalAddressChangePresenter
 */

const personalAddressChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal address?',
    metaDescription: 'Update the address for your personal account.',
    personalPostcode: payload ?? data.changeBPersonalPostcode?.personalPostcode ?? data.address.postcode,
    userName: data.info.fullName.fullNameJoined ?? null
  }
}

export {
  personalAddressChangePresenter
}

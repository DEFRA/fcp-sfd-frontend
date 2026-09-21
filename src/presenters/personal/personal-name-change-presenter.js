/*
 * Formats data ready for presenting in the `/personal-name-change` page
 * @module personalNameChangePresenter
 */

const personalNameChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your full name?',
    metaDescription: 'Update the full name for your personal account.',
    userName: data.userName ?? null,
    first: payload?.first ?? data.changePersonalName?.first ?? data.fullName.first,
    middle: payload?.middle ?? data.changePersonalName?.middle ?? data.fullName.middle,
    last: payload?.last ?? data.changePersonalName?.last ?? data.fullName.last
  }
}

export {
  personalNameChangePresenter
}

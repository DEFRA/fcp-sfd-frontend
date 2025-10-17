/*
 * Formats data ready for presenting in the `/personal-name-change` page
 * @module personalNameChangePresenter
 */

const personalNameChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your full name?',
    metaDescription: 'Update the full name for your personal account.',
    userName: data.info.fullName.fullNameJoined ?? null,
    first: payload?.first ?? data.changePersonalName?.first ?? data.info.fullName.first,
    middle: payload?.middle ?? data.changePersonalName?.middle ?? data.info.fullName.middle,
    last: payload?.last ?? data.changePersonalName?.last ?? data.info.fullName.last
  }
}

export {
  personalNameChangePresenter
}

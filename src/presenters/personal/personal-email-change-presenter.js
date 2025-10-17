/**
 * Formats data ready for presenting in the `/personal-email-change` page
 * @module personalEmailChangePresenter
 */

const personalEmailChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your personal email address?',
    metaDescription: 'Update the email address for your personal account.',
    userName: data.info.fullName.fullNameJoined ?? null,
    personalEmail: payload ?? data.changePersonalEmail ?? data.contact.email
  }
}

export {
  personalEmailChangePresenter
}

/**
 * Formats data ready for presenting in the `/personal-email-check` page
 * @module personalEmailCheckPresenter
 */

const personalEmailCheckPresenter = (data) => {
  return {
    backLink: { href: '/account-email-change' },
    changeLink: '/account-email-change',
    pageTitle: 'Check your personal email address is correct before submitting',
    metaDescription: 'Check the email address for your personal account is correct.',
    userName: data.info.fullName.fullNameJoined ?? null,
    personalEmail: data.changePersonalEmail ?? data.contact.email
  }
}

export {
  personalEmailCheckPresenter
}

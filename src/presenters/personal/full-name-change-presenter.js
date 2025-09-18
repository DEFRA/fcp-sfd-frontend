/**
 * Formats data ready for presenting in the `/account-name-change` page
 * @module fullNameChangePresenter
 */

const fullNameChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your full name?',
    metaDescription: 'Update the full name for your personal account.',
    fullName: data.info.fullName ?? null,
    changeFirstName: payload ?? data.changeFirstName ?? data.info.fullName.First ?? null,
    changeMiddleName: payload ?? data.changeMiddleName ?? data.info.fullName.Middle ?? null,
    changeLastName: payload ?? data.changeLastName ?? data.info.fullName.Last ?? null
  }
}

export {
  fullNameChangePresenter
}

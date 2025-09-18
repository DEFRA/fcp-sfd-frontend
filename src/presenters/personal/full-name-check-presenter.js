/**
 * Formats data ready for presenting in the `/account-name-check` page
 * @module fullNameCheckPresenter
 */

const fullNameCheckPresenter = (data) => {
  return {
    backLink: { href: '/account-name-change' },
    changeLink: '/account-name-change',
    pageTitle: 'Check your name is correct before submitting',
    metaDescription: 'Check the full name for your personal account is correct.',
    fullName: data.customer.fullName ?? null,
    changeFirstName: payload ?? data.changeFirstName ?? data.info.fullName.First ?? null,
    changeMiddleName: payload ?? data.changeMiddleName ?? data.info.fullName.Middle ?? null,
    changeLastName: payload ?? data.changeLastName ?? data.info.fullName.Last ?? null

  }
}

export {
  fullNameCheckPresenter
}

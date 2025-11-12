/**
 * Formats data ready for presenting in the `/personal-name-check` page
 * @module personalNameCheckPresenter
 */

const personalNameCheckPresenter = (personalDetails) => {
  return {
    backLink: { href: '/account-name-change' },
    changeLink: '/account-name-change',
    pageTitle: 'Check your name is correct before submitting',
    metaDescription: 'Check the full name for your personal account is correct.',
    userName: personalDetails.info.userName,
    fullName: formatFullName(personalDetails.changePersonalName ?? personalDetails.info.fullName)
  }
}

const formatFullName = (nameData) => {
  return [
    nameData.first,
    nameData.middle,
    nameData.last
  ].filter(Boolean).join(' ')
}

export {
  personalNameCheckPresenter
}

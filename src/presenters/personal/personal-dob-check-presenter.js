/**
 * Formats data ready for presenting in the `/personal-dob-check` page
 * @module personalDobCheckPresenter
 */

const personalDobCheckPresenter = (personalDetails) => {
  const { day, month, year } = personalDetails.changePersonalDob
  const personalDob = new Date(Number(year), Number(month) - 1, Number(day))

  return {
    backLink: { href: '/account-date-of-birth-change' },
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account is correct.',
    userName: personalDetails.info.userName ?? null,
    changeLink: '/account-date-of-birth-change',
    dateOfBirth: new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(personalDob)
  }
}

export {
  personalDobCheckPresenter
}

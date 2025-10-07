/**
 * Formats data ready for presenting in the `/personal-dob-change` page
 * @module personalDobChangePresenter
 */

const personalDobChangePresenter = (data, payload) => {
  const personalDob = new Date([data.info.dateOfBirth])
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your date of birth?',
    metaDescription: 'For example, 31 3 1980',
    dobDay: payload?.day || data.changePersonalDob?.day || personalDob.getDate(),
    dobMonth: payload?.month || data.changePersonalDob?.month || personalDob.getMonth() + 1,
    dobYear: payload?.year || data.changePersonalDob?.year || personalDob.getFullYear()

  }
}

export { personalDobChangePresenter }

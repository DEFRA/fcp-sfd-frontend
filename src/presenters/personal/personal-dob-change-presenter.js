/**
 * Formats data ready for presenting in the `/personal-dob-change` page
 * @module personalDobChangePresenter
 */

const personalDobChangePresenter = (data, payload) => {
  const personalDob = new Date([data.info.dateOfBirth])
  return {
    backLink: { href: '/personal-details' },
    userName: data.info.fullName.fullNameJoined ?? null,
    pageTitle: 'What is your date of birth?',
    metaDescription: 'Update the date of birth for your personal account.',
    hint: 'For example, 31 3 1980',
    dobDay: payload ? payload.day || '' : data.changePersonalDob?.day || personalDob.getDate(),
    dobMonth: payload ? payload.month || '' : data.changePersonalDob?.month || personalDob.getMonth() + 1,
    dobYear: payload ? payload.year || '' : data.changePersonalDob?.year || personalDob.getFullYear()
  }
}

export { personalDobChangePresenter }

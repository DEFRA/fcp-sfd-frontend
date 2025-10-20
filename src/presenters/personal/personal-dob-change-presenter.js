/**
 * Formats data ready for presenting in the `/personal-dob-change` page
 * @module personalDobChangePresenter
 */

const personalDobChangePresenter = (data, payload) => {
  const dateInputValues = generateDateInputValues(data, payload)
  return {
    backLink: { href: '/personal-details' },
    userName: data.info.fullName.fullNameJoined ?? null,
    pageTitle: 'What is your date of birth?',
    metaDescription: 'Update the date of birth for your personal account.',
    hint: 'For example, 31 3 1980',
    ...dateInputValues
  }
}

const generateDateInputValues = (data, payload) => {
  if (payload) {
    return {
      day: payload.day || '',
      month: payload.month || '',
      year: payload.year || ''
    }
  }
  const personalDob = new Date([data.info.dateOfBirth])
  return {
    day: data.changePersonalDob?.day || personalDob.getDate(),
    month: data.changePersonalDob?.month || personalDob.getMonth() + 1,
    year: data.changePersonalDob?.year || personalDob.getFullYear()
  }
}

export { personalDobChangePresenter }

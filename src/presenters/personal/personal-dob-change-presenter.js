/**
 * Formats data ready for presenting in the `/personal-dob-change` page
 * @module personalDobChangePresenter
 */

const personalDobChangePresenter = (data, payload) => {
  const { day, month, year } = generateDateInputValues(data, payload)

  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What is your date of birth?',
    metaDescription: 'Update the date of birth for your personal account.',
    userName: data.info.userName || null,
    hint: 'For example, 31 3 1980',
    day,
    month,
    year
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

  const [year, month, day] = data.info.dateOfBirth.split('-').map(Number)

  return {
    day: data.changePersonalDob?.day || `${day}`,
    month: data.changePersonalDob?.month || `${month}`,
    year: data.changePersonalDob?.year || `${year}`
  }
}

export { personalDobChangePresenter }

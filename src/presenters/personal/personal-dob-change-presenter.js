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
    userName: data.info.userName ?? null,
    hint: 'For example, 31 3 1980',
    day,
    month,
    year
  }
}

/**
 * Builds date of birth values for the form inputs.
 *
 * Values coming from `payload` are always strings (they come from the form).
 * `changePersonalDob` is saved payload data, so these values are also strings.
 *
 * The original date of birth value comes from the DAL and isn’t a string.
 * When falling back to those values we explicitly convert them to strings
 * so all sources are normalised and safe to use in inputs.
 *
 * Null values are handled to avoid showing 'null' in the UI.
 */
const generateDateInputValues = (data, payload) => {
  if (payload) {
    return {
      day: payload.day ?? '',
      month: payload.month ?? '',
      year: payload.year ?? ''
    }
  }

  const { year, month, day } = data.info.dateOfBirth

  return {
    day: data.changePersonalDob?.day ?? day?.toString() ?? '',
    month: data.changePersonalDob?.month ?? month?.toString() ?? '',
    year: data.changePersonalDob?.year ?? year?.toString() ?? ''
  }
}

export { personalDobChangePresenter }

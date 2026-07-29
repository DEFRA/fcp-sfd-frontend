/**
 * Formats data ready for presenting in the `/personal-dob-check` page
 * @module personalDobCheckPresenter
 */

import moment from 'moment'

const personalDobCheckPresenter = (personalDetails) => {
  const dob = personalDetails.changePersonalDob ?? personalDetails.info.dateOfBirth
  const { day, month, year } = dob
  const personalDob = day && month && year
    ? moment(`${year}-${Number(month)}-${Number(day)}`, 'YYYY-M-D', true)
    : null

  return {
    backLink: { href: '/account-date-of-birth-change' },
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account is correct.',
    userName: personalDetails.info.userName ?? null,
    changeLink: '/account-date-of-birth-change',
    dateOfBirth: personalDob?.isValid() ? personalDob.format('D MMMM YYYY') : null
  }
}

export {
  personalDobCheckPresenter
}

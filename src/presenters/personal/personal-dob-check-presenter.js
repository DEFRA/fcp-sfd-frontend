/**
 * Formats data ready for presenting in the `/personal-dob-check` page
 * @module personalDobCheckPresenter
 */

import moment from 'moment'
import { formatFirstLastName } from '../base-presenter.js'

const personalDobCheckPresenter = (personalDetails) => {
  const { day, month, year } = personalDetails.changePersonalDob
  const personalDob = new Date([`${month}/${day}/${year}`])
  moment.locale('en-gb')

  return {
    backLink: { href: '/account-date-of-birth-change' },
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account is correct.',
    userName: formatFirstLastName(personalDetails.info.fullName) || null,
    changeLink: '/account-date-of-birth-change',
    dateOfBirth: moment(personalDob).format('LL')
  }
}

export {
  personalDobCheckPresenter
}

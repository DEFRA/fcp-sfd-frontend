/**
 * Formats data ready for presenting in the `/personal-dob-check` page
 * @module personalDobCheckPresenter
 */

import moment from 'moment'

const personalDobCheckPresenter = (personalDetails) => {
  const { day, month, year } = personalDetails.changePersonalDob
  const personalDob = new Date([`${month}/${day}/${year}`])
  moment.locale('en-gb')

  return {
    backLink: { href: '/personal-dob-change' },
    changeLink: '/personal-dob-change',
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account are correct.',
    dobText: moment(personalDob).format('LL')
  }
}

export {
  personalDobCheckPresenter
}

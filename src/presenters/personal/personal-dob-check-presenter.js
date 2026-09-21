/**
 * Formats data ready for presenting in the `/personal-dob-check` page
 * @module personalDobCheckPresenter
 */

import { constants, presenters } from '@defra/fcp-sfd-frontend-engine'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external

const personalDobCheckPresenter = (data) => {
  const { day, month, year } = data.changePersonalDob ?? data.dateOfBirth
  // new Date() needs the format YYYY-MM-DD with leading zeros e.g. '1990-04-05' not '1990-4-5'
  const personalDob = new Date(
    `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  )

  return {
    backLink: { href: PERSONAL_CHANGE_LINKS.personalDateOfBirth },
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account is correct.',
    userName: data.userName ?? null,
    changeLink: PERSONAL_CHANGE_LINKS.personalDateOfBirth,
    dateOfBirth: presenters.formatLongDate(personalDob)
  }
}

export {
  personalDobCheckPresenter
}

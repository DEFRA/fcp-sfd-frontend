/**
 * Formats data ready for presenting in the `/personal-dob-check` page
 * @module personalDobCheckPresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const personalDobCheckPresenter = (personalDetails) => {
  const dob = personalDetails.changePersonalDob ?? personalDetails.info.dateOfBirth

  return {
    backLink: { href: '/account-date-of-birth-change' },
    pageTitle: 'Check your date of birth is correct before submitting',
    metaDescription: 'Check the date of birth for your personal account is correct.',
    userName: personalDetails.info.userName ?? null,
    changeLink: '/account-date-of-birth-change',
    dateOfBirth: presenters.formatLongDateFromParts(dob)
  }
}

export {
  personalDobCheckPresenter
}

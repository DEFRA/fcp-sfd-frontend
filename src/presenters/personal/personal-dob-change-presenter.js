/**
 * Formats data ready for presenting in the `/personal-dob-change` page
 * @module personalDobChangePresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const personalDobChangePresenter = (data, payload) => {
  const { day, month, year } = presenters.formatDateInputValues(payload, data.changePersonalDob, data.info.dateOfBirth)

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

export { personalDobChangePresenter }

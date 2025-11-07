/**
 * Formats data ready for presenting in the `/personal-name-check` page
 * @module personalNameCheckPresenter
 */

import { formatFullName, formatFirstLastName } from '../base-presenter.js'

const personalNameCheckPresenter = (personalDetails) => {
  return {
    backLink: { href: '/account-name-change' },
    changeLink: '/account-name-change',
    pageTitle: 'Check your name is correct before submitting',
    metaDescription: 'Check the full name for your personal account is correct.',
    userName: formatFirstLastName(personalDetails.info.fullName) || null,
    fullName: formatFullName(personalDetails.changePersonalName ?? personalDetails.info.fullName)
  }
}

export {
  personalNameCheckPresenter
}

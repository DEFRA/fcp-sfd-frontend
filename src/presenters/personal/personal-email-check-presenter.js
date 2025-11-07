/**
 * Formats data ready for presenting in the `/personal-email-check` page
 * @module personalEmailCheckPresenter
 */

import { formatFirstLastName } from '../base-presenter.js'

const personalEmailCheckPresenter = (data) => {
  return {
    backLink: { href: '/account-email-change' },
    changeLink: '/account-email-change',
    pageTitle: 'Check your personal email address is correct before submitting',
    metaDescription: 'Check the email address for your personal account is correct.',
    userName: formatFirstLastName(data.info.fullName) || null,
    personalEmail: data.changePersonalEmail ?? data.contact.email
  }
}

export {
  personalEmailCheckPresenter
}

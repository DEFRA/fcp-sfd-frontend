/**
 * Formats data ready for presenting in the `/personal-email-check` page
 * @module personalEmailCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external

const personalEmailCheckPresenter = (data) => {
  return {
    backLink: { href: PERSONAL_CHANGE_LINKS.personalEmail },
    changeLink: PERSONAL_CHANGE_LINKS.personalEmail,
    pageTitle: 'Check your personal email address is correct before submitting',
    metaDescription: 'Check the email address for your personal account is correct.',
    userName: data.userName ?? null,
    personalEmail: data.changePersonalEmail ?? data.email
  }
}

export {
  personalEmailCheckPresenter
}

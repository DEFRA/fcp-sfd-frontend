/**
 * Formats data ready for presenting in the `/personal-name-check` page
 * @module personalNameCheckPresenter
 */

import { utils } from '@defra/fcp-sfd-frontend-engine'

const personalNameCheckPresenter = (data) => {
  return {
    backLink: { href: '/account-name-change' },
    changeLink: '/account-name-change',
    pageTitle: 'Check your name is correct before submitting',
    metaDescription: 'Check the full name for your personal account is correct.',
    userName: data.userName ?? null,
    fullName: utils.formatFullName(data.changePersonalName ?? data.fullName)
  }
}

export {
  personalNameCheckPresenter
}

/**
 * Formats data ready for presenting in the `/personal-name-check` page
 * @module personalNameCheckPresenter
 */

import { constants, utils } from '@defra/fcp-sfd-frontend-engine'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external

const personalNameCheckPresenter = (data) => {
  return {
    backLink: { href: PERSONAL_CHANGE_LINKS.personalName },
    changeLink: PERSONAL_CHANGE_LINKS.personalName,
    pageTitle: 'Check your name is correct before submitting',
    metaDescription: 'Check the full name for your personal account is correct.',
    userName: data.userName ?? null,
    fullName: utils.formatFullName(data.changePersonalName ?? data.fullName)
  }
}

export {
  personalNameCheckPresenter
}

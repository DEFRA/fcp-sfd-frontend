/**
 * Formats data ready for presenting in the `/personal-phone-numbers-check` page
 * @module personalPhoneNumbersCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { PERSONAL: PERSONAL_CHANGE_LINKS } = constants.changeLinks.external

const personalPhoneNumbersCheckPresenter = (data) => {
  const phoneNumbers = data.changePersonalPhoneNumbers ?? {
    personalTelephone: data.telephone,
    personalMobile: data.mobile
  }

  return {
    backLink: { href: PERSONAL_CHANGE_LINKS.personalPhone },
    changeLink: PERSONAL_CHANGE_LINKS.personalPhone,
    pageTitle: 'Check your personal phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your personal account are correct.',
    userName: data.userName ?? null,
    personalTelephone: {
      telephone: phoneNumbers.personalTelephone ?? null,
      mobile: phoneNumbers.personalMobile ?? null
    }
  }
}

export {
  personalPhoneNumbersCheckPresenter
}

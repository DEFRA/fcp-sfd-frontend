/**
 * Formats data ready for presenting in the `/personal-phone-numbers-check` page
 * @module personalPhoneNumbersCheckPresenter
 */

import { formatFirstLastName } from '../base-presenter.js'

const personalPhoneNumbersCheckPresenter = (personalDetails) => {
  return {
    backLink: { href: '/account-phone-numbers-change' },
    changeLink: '/account-phone-numbers-change',
    pageTitle: 'Check your personal phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your personal account are correct.',
    userName: formatFirstLastName(personalDetails.info.fullName) || null,
    personalTelephone: {
      telephone: personalDetails.changePersonalPhoneNumbers.personalTelephone ?? 'Not added',
      mobile: personalDetails.changePersonalPhoneNumbers.personalMobile ?? 'Not added'
    }
  }
}

export {
  personalPhoneNumbersCheckPresenter
}

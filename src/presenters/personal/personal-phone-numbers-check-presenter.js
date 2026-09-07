/**
 * Formats data ready for presenting in the `/personal-phone-numbers-check` page
 * @module personalPhoneNumbersCheckPresenter
 */

const personalPhoneNumbersCheckPresenter = (data) => {
  const phoneNumbers = data.changePersonalPhoneNumbers ?? {
    personalTelephone: data.contact.telephone,
    personalMobile: data.contact.mobile
  }

  return {
    backLink: { href: '/account-phone-numbers-change' },
    changeLink: '/account-phone-numbers-change',
    pageTitle: 'Check your personal phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your personal account are correct.',
    userName: data.info.userName ?? null,
    personalTelephone: {
      telephone: phoneNumbers.personalTelephone ?? null,
      mobile: phoneNumbers.personalMobile ?? null
    }
  }
}

export {
  personalPhoneNumbersCheckPresenter
}

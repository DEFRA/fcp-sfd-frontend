/**
 * Formats data ready for presenting in the `/personal-phone-numbers-change` page
 * @module personalPhoneNumbersChangePresenter
 */

const personalPhoneNumbersChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'What are your personal phone numbers?',
    metaDescription: 'Update the phone numbers for your personal account.',
    userName: data.info.fullName.fullNameJoined ?? null,
    personalTelephone: formatPersonalNumber(payload?.personalTelephone, data.changePersonalTelephone, data.contact.telephone),
    personalMobile: formatPersonalNumber(payload?.personalMobile, data.changePersonalMobile, data.contact.mobile)
  }
}

/**
 * The first time a user loads the personal phone numbers change page they won't have entered any data, so a payload
 * or a changedNumber won't be present. If a user has a validation issue then we want to reply the payload data to them.
 * We check if payload is not undefined because it could be a user has removed the 'mobile' number for example but
 * incorrectly entered the telephone number so the payload for this would appear as an empty string.
 *
 * Payload is the priority to check and then after that if changedNumber is present then we display that value.
 *
 * @private
 */
const formatPersonalNumber = (payloadNumber, changedNumber, originalNumber) => {
  if (payloadNumber !== undefined) {
    return payloadNumber
  }

  if (changedNumber !== undefined) {
    return changedNumber
  }

  return originalNumber
}

export { personalPhoneNumbersChangePresenter }

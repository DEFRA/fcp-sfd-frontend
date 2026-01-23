/**
 * Formats data ready for presenting in the `/personal-fix-check` page
 * @module personalFixCheckPresenter
 */

import moment from 'moment'

const personalFixCheckPresenter = (personalDetails) => {
  const {
    orderedSectionsToFix,
    changePersonalName,
    changePersonalDob,
    changePersonalEmail,
    changePersonalAddress,
    changePersonalPhoneNumbers
  } = personalDetails

  return {
    backLink: { href: '/personal-fix-list' },
    pageTitle: 'Check your details are correct before submitting',
    metaDescription: 'Check your details are correct before submitting',
    changeLink: '/personal-fix-list',
    sections: orderedSectionsToFix,
    fullName: formatFullName(changePersonalName),
    dateOfBirth: formatDob(changePersonalDob),
    personalEmail: changePersonalEmail?.personalEmail ?? null,
    address: formatAddress(changePersonalAddress),
    personalTelephone: {
      telephone: changePersonalPhoneNumbers?.personalTelephone ?? null,
      mobile: changePersonalPhoneNumbers?.personalMobile ?? null
    }
  }
}

const formatDob = (dob) => {
  if (dob) {
    const { day, month, year } = dob
    const personalDob = new Date([`${month}/${day}/${year}`])

    return moment(personalDob).format('D MMMM YYYY')
  }

  return null
}

const formatAddress = (personalAddress) => {
  if (personalAddress) {
    return Object.values(personalAddress).filter(Boolean)
  }

  return null
}

const formatFullName = (nameData) => {
  if (nameData) {
    return [
      nameData.first,
      nameData.middle,
      nameData.last
    ].filter(Boolean).join(' ')
  }

  return null
}

export {
  personalFixCheckPresenter
}

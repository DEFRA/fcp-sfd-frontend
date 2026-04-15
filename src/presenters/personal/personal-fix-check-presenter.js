/**
 * Formats data ready for presenting in the `/personal-fix-check` page
 * @module personalFixCheckPresenter
 */

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
    userName: personalDetails.info?.userName ?? null,
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
    const personalDob = new Date(Number(year), Number(month) - 1, Number(day))

    if (Number.isNaN(personalDob.getTime())) {
      return null
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(personalDob)
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

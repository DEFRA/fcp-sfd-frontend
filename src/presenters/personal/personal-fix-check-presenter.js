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
    // new Date() needs the format YYYY-MM-DD with leading zeros e.g. '1990-04-05' not '1990-4-5'
    const personalDob = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)

    return personalDob.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
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

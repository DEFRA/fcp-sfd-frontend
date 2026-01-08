/**
 * Formats data ready for presenting in the `/personal-fix-check` page
 * @module personalFixCheckPresenter
 */

import moment from 'moment'

const personalFixCheckPresenter = (personalDetails, sessionData) => {
  console.log('🚀 ~ sessionData:', sessionData)
  console.log('🚀 ~ personalDetails:', personalDetails)

  const dob = personalDetails.changePersonalDOB || {}
  const { day, month, year } = dob

  const personalDob = new Date([`${month}/${day}/${year}`])
  moment.locale('en-gb')

  return {
    backLink: { href: '/personal-fix-list' },
    pageTitle: 'Check your details are correct before submitting',
    metaDescription: 'Check your details are correct before submitting',
    changeLink: '/personal-fix-list',
    sections: sessionData.orderedSections,
    fullName: formatFullName(personalDetails.changePersonalName),
    dateOfBirth: moment(personalDob).format('LL'),
    personalEmail: personalDetails.changePersonalEmail?.personalEmail,
    address: formatAddress(personalDetails.changePersonalAddress),
    personalTelephone: {
      telephone: personalDetails.changePersonalPhoneNumbers?.personalTelephone ?? null,
      mobile: personalDetails.changePersonalPhoneNumbers?.personalMobile ?? null
    }
  }
}

const formatAddress = (personalAddress) => {
  if (!personalAddress) {
    return null
  }

  return Object.values(personalAddress).filter(Boolean)
}

const formatFullName = (nameData) => {
  if (!nameData) {
    return null
  }

  return [
    nameData.first,
    nameData.middle,
    nameData.last
  ].filter(Boolean).join(' ')
}

const generateDateInputValues = (data, payload) => {
  if (payload) {
    return {
      day: payload.day || '',
      month: payload.month || '',
      year: payload.year || ''
    }
  }

  const [year, month, day] = data.info.dateOfBirth.split('-').map(Number)

  return {
    day: data.changePersonalDob?.day || `${day}`,
    month: data.changePersonalDob?.month || `${month}`,
    year: data.changePersonalDob?.year || `${year}`
  }
}

export {
  personalFixCheckPresenter
}

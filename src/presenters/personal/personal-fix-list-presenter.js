/**
 * Formats data ready for presenting in the `/personal-fix-list` page
 * @module personalFixListPresenter
 */

import { formatNumber, formatChangedAddress } from '../base-presenter.js'

const personalFixListPresenter = (personalDetails, sessionData, payload, errors = undefined) => {
  const { day, month, year } = generateDateInputValues(personalDetails, payload)

  let sortedErrorsOrder

  if (errors) {
    sortedErrorsOrder = sortErrorsOrder(errors, sessionData.orderedSections)
  }

  return {
    backLink: { href: '/personal-fix' },
    pageTitle: 'Your personal details to update',
    metaDescription: 'Your personal details to update.',
    sections: sessionData.orderedSections,
    name: {
      first: payload?.first ?? personalDetails.changePersonalName?.first ?? personalDetails.info.fullName.first,
      middle: payload?.middle ?? personalDetails.changePersonalName?.middle ?? personalDetails.info.fullName.middle,
      last: payload?.last ?? personalDetails.changePersonalName?.last ?? personalDetails.info.fullName.last
    },
    dateOfBirth: {
      day,
      month,
      year
    },
    personalTelephone: formatNumber(payload?.personalTelephone, personalDetails.changePersonalPhoneNumbers?.personalTelephone, personalDetails.contact.telephone),
    personalMobile: formatNumber(payload?.personalMobile, personalDetails.changePersonalPhoneNumbers?.personalMobile, personalDetails.contact.mobile),
    personalEmail: payload?.personalEmail ?? personalDetails.changePersonalEmail?.personalEmail ?? personalDetails.contact.email,
    address: formatAddress(payload, personalDetails.changePersonalAddress),
    errors: sortedErrorsOrder
  }
}

/**
 * Sorts validation errors so they appear in the same order as the sections
 * and fields displayed on the Personal Fix List page.
 *
 * Because the page is dynamically built based on which sections need fixing
 * and which field the user clicked on (source), the validation errors must be
 * ordered to match the displayed section order and the logical field order
 * within each section.
 *
 * This function takes the list of validation errors and the ordered list of
 * sections, and returns the errors sorted to match the UI layout.
 */
const sortErrorsOrder = (errors, orderedSections) => {
  const errorOrder = {
    name: ['first', 'middle', 'last'],
    dob: ['day', 'month', 'year'],
    address: [
      'address1',
      'address2',
      'address3',
      'city',
      'county',
      'postcode',
      'country'
    ],
    phone: ['personalTelephone', 'personalMobile'],
    email: ['personalEmail']
  }

  const sortedErrors = []

  for (const section of orderedSections) {
    const fieldsInSection = errorOrder[section] || []

    for (const field of fieldsInSection) {
      if (errors[field]) {
        sortedErrors.push({
          field,
          ...errors[field]
        })
      }
    }
  }

  return sortedErrors
}

const formatAddress = (payload, changePersonalAddress) => {
  if (payload) {
    return {
      address1: payload.address1,
      address2: payload.address2,
      address3: payload.address3,
      city: payload.city,
      county: payload.county,
      postcode: payload.postcode,
      country: payload.country
    }
  }

  if (changePersonalAddress) {
    return formatChangedAddress(changePersonalAddress)
  }

  return null
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
  personalFixListPresenter
}

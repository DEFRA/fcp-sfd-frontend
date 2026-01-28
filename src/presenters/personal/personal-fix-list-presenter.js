/**
 * Formats data ready for presenting in the `/personal-fix-list` page
 * @module personalFixListPresenter
 */

import { formatNumber, formatChangedAddress } from '../base-presenter.js'
import { PERSONAL_SECTION_FIELD_ORDER } from '../../constants/interrupter-journey.js'

const personalFixListPresenter = (personalDetails, payload, errors = null) => {
  const { day, month, year } = formatDateOfBirth(personalDetails, payload)
  const sortedErrors = errors ? sortErrorsBySectionOrder(errors, personalDetails.orderedSectionsToFix) : null

  return {
    backLink: { href: '/personal-fix' },
    pageTitle: 'Your personal details to update',
    metaDescription: 'Your personal details to update.',
    sections: personalDetails.orderedSectionsToFix,
    name: formatName(payload, personalDetails),
    dateOfBirth: {
      day,
      month,
      year
    },
    personalTelephone: formatNumber(payload?.personalTelephone, personalDetails.changePersonalPhoneNumbers?.personalTelephone, personalDetails.contact.telephone),
    personalMobile: formatNumber(payload?.personalMobile, personalDetails.changePersonalPhoneNumbers?.personalMobile, personalDetails.contact.mobile),
    personalEmail: payload?.personalEmail ?? personalDetails.changePersonalEmail?.personalEmail ?? personalDetails.contact.email,
    address: formatAddress(payload, personalDetails.changePersonalAddress),
    errors: sortedErrors
  }
}

const formatName = (payload, personalDetails) => {
  return {
    first:
      payload?.first ??
      personalDetails.changePersonalName?.first ??
      personalDetails.info.fullName.first,
    middle:
      payload?.middle ??
      personalDetails.changePersonalName?.middle ??
      personalDetails.info.fullName.middle,
    last:
      payload?.last ??
      personalDetails.changePersonalName?.last ??
      personalDetails.info.fullName.last
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
const sortErrorsBySectionOrder = (errors, orderedSectionsToFix) => {
  const sortedErrors = []

  for (const section of orderedSectionsToFix) {
    // A section (i.e 'name') can have multiple fields (i.e 'first', 'middle', 'last')
    const fieldsInSection = PERSONAL_SECTION_FIELD_ORDER[section] || []

    for (const field of fieldsInSection) {
      // If there's an error for this field, add it to the sorted list with the error details
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
    const {
      address1,
      address2,
      address3,
      city,
      county,
      postcode,
      country
    } = payload

    return { address1, address2, address3, city, county, postcode, country }
  }

  if (changePersonalAddress) {
    return formatChangedAddress(changePersonalAddress)
  }

  return null
}

/**
 * Builds date of birth values for the form inputs.
 *
 * Values coming from `payload` are always strings (they come from the form).
 * `changePersonalDob` is saved payload data, so these values are also strings.
 *
 * The original date of birth value comes from the DAL and isn’t a string.
 * When falling back to those values we explicitly convert them to strings
 * so all sources are normalised and safe to use in inputs.
 *
 * Null values are handled to avoid showing 'null' in the UI.
 */
const formatDateOfBirth = (data, payload) => {
  if (payload) {
    return {
      day: payload.day ?? '',
      month: payload.month ?? '',
      year: payload.year ?? ''
    }
  }

  return {
    day: data.changePersonalDob?.day ?? data.info.dateOfBirth.day?.toString() ?? '',
    month: data.changePersonalDob?.month ?? data.info.dateOfBirth.month?.toString() ?? '',
    year: data.changePersonalDob?.year ?? data.info.dateOfBirth.year?.toString() ?? ''
  }
}

export {
  personalFixListPresenter
}

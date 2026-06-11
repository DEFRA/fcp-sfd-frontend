/**
 * Takes the raw data and maps it to a more usable format
 *
 * @param {Object} value - The data from the DAL
 * @returns {Object} Formatted personal details data
 */

import { mappers } from '@defra/fcp-sfd-frontend-engine'

export const mapPersonalDetails = (value) => {
  const [year, month, day] = value.customer.info.dateOfBirth ? value.customer.info.dateOfBirth.split('-') : []

  return {
    crn: value.customer.crn,
    info: {
      userName: mappers.customerName(value.customer.info.name).userName,
      fullName: {
        first: value.customer.info.name.first,
        last: value.customer.info.name.last,
        middle: value.customer.info.name.middle ?? null
      },
      fullNameJoined: [
        value.customer.info.name.first,
        value.customer.info.name.middle,
        value.customer.info.name.last
      ].filter(Boolean).join(' '),
      dateOfBirth: {
        full: value.customer.info.dateOfBirth ?? null,
        day: day ?? null,
        month: month ?? null,
        year: year ?? null
      }
    },
    address: mappers.address(value.customer.info.address),
    contact: {
      email: value.customer.info.email.address,
      telephone: value.customer.info.phone.landline ?? null,
      mobile: value.customer.info.phone.mobile ?? null
    },
    business: {
      info: {
        name: value.business.info.name ?? null
      }
    }
  }
}

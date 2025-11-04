/**
 * Takes the raw data and maps it to a more usable format
 *
 * @param {Object} value - The data from the DAL
 *
 * @returns {Object} Formatted personal business details data
 */

export const mapPersonalBusinessDetails = (value) => {
  return {
    info: {
      fullName: {
        first: value.customer.info.name.first ?? null,
        last: value.customer.info.name.last ?? null,
        middle: value.customer.info.name.middle ?? null,
        fullNameJoined: formatFullName(value.customer.info.name)
      }
    },
    business: {
      info: {
        sbi: value.business?.sbi ?? null,
        name: value.business?.info?.name ?? null
      }
    }
  }
}

const formatFullName = (name) => {
  if (!name) return null
  return [
    name.first,
    name.middle,
    name.last
  ].filter(Boolean).join(' ')
}

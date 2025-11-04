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
        first: value.customer.info.name.first,
        last: value.customer.info.name.last,
        middle: value.customer.info.name.middle ?? null
      }
    },
    business: {
      info: {
        sbi: value.business.sbi ?? null,
        name: value.business.info.name ?? null
      }
    }
  }
}

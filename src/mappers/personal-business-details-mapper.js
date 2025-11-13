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
      userName: [
        value.customer.info.name.first,
        value.customer.info.name.last
      ].filter(Boolean).join(' ')
    },
    business: {
      info: {
        organisationId: value.business.organisationId ?? null,
        sbi: value.business.sbi ?? null,
        name: value.business.info.name ?? null
      }
    }
  }
}

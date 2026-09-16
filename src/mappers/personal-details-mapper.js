/**
 * Takes the raw data and maps it to a more usable format
 *
 * @param {Object} value - The data from the DAL
 *
 * @returns {Object} Formatted personal details data
 */

import { mappers } from '@defra/fcp-sfd-frontend-engine'

export const mapPersonalDetails = (value) => {
  return {
    ...mappers.personalDetails(value),
    business: {
      name: value.business?.info?.name ?? null
    }
  }
}

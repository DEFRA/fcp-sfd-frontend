/**
 * Takes the raw data and maps it to a more usable format
 *
 * @param {Object} value - The data from the DAL
 *
 * @returns {Object} Formatted business details data
 */

import { mappers } from '@defra/fcp-sfd-frontend-engine'

export const mapBusinessDetails = (value) => {
  return {
    ...mappers.businessDetails(value),
    customer: mappers.customerName(value.customer.info.name)
  }
}

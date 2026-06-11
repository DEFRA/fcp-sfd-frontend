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
    info: {
      sbi: value.business.sbi,
      businessName: value.business.info.name,
      vat: value.business.info.vat,
      traderNumber: value.business.info.traderNumber,
      vendorNumber: value.business.info.vendorNumber,
      legalStatus: value.business.info.legalStatus.type,
      type: value.business.info.type.type,
      countyParishHoldingNumbers: value.business.countyParishHoldings
    },
    address: mappers.address(value.business.info.address),
    contact: {
      email: value.business.info.email.address,
      landline: value.business.info.phone.landline ?? null,
      mobile: value.business.info.phone.mobile ?? null
    },
    customer: mappers.customerName(value.customer.info.name)
  }
}

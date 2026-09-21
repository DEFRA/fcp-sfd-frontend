/**
 * Formats data ready for presenting in the `/business-vat-registration-number-check` page
 * @module businessVatCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

const businessVatCheckPresenter = (data) => {
  return {
    backLink: { href: BUSINESS_CHANGE_LINKS.businessVat },
    changeLink: BUSINESS_CHANGE_LINKS.businessVat,
    pageTitle: 'Check your VAT registration number is correct before submitting',
    metaDescription: 'Check the VAT registration number for your business is correct.',
    userName: data.customer.userName ?? null,
    vatNumber: data.changeBusinessVat ?? data.vat ?? null,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessVatCheckPresenter
}

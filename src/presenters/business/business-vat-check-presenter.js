/**
 * Formats data ready for presenting in the `/business-vat-registration-number-check` page
 * @module businessVatCheckPresenter
 */

const businessVatCheckPresenter = (data) => {
  return {
    backLink: { href: '/business-vat-registration-number-change' },
    changeLink: '/business-vat-registration-number-change',
    pageTitle: 'Check your VAT registration number is correct before submitting',
    metaDescription: 'Check the VAT registration number for your business is correct.',
    vatNumber: data.changeBusinessVAT ?? data.info.vat ?? null,
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null
  }
}

export {
  businessVatCheckPresenter
}

/**
 * Formats data ready for presenting in the `/business-vat-registration-number-change` page
 * @module businessVatChangePresenter
 */

const businessVatChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your VAT registration number?',
    metaDescription: 'Update the VAT registration number for your business.',
    userName: data.customer.userName ?? null,
    vatNumber: payload ?? data.changeBusinessVat ?? data.vat,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessVatChangePresenter
}

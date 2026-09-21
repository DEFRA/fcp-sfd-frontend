/**
 * Formats data ready for presenting in the `/business-vat-registration-remove` page
 * @module businessVatRemovePresenter
 */

const businessVatRemovePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Are you sure you want to remove your VAT registration number?',
    metaDescription: 'Are you sure you want to remove your VAT registration number?',
    userName: data.customer.userName ?? null,
    vatNumber: data.vat ?? null,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessVatRemovePresenter
}

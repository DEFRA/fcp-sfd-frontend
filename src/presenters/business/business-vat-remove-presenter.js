/**
 * Formats data ready for presenting in the `/business-vat-remove` page
 * @module businessVatRemovePresenter
 */

const businessVatRemovePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Are you sure you want to remove your VAT registration number?',
    metaDescription: 'Are you sure you want to remove your VAT registration number?',
    vatNumber: data.info.vat ?? null,
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null
  }
}

export {
  businessVatRemovePresenter
}

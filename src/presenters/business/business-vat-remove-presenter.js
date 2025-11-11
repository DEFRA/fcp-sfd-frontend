/**
 * Formats data ready for presenting in the `/business-vat-registration-remove` page
 * @module businessVatRemovePresenter
 */

const businessVatRemovePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Are you sure you want to remove your VAT registration number?',
    metaDescription: 'Are you sure you want to remove your VAT registration number?',
    userName: data.customer.userName,
    vatNumber: data.info.vat ?? null,
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null
  }
}

export {
  businessVatRemovePresenter
}

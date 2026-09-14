/**
 * Formats data ready for presenting in the `/business-name-check` page
 * @module businessNameCheckPresenter
 */

const businessNameCheckPresenter = (data) => {
  return {
    backLink: { href: '/business-name-change' },
    changeLink: '/business-name-change',
    pageTitle: 'Check your business name is correct before submitting',
    metaDescription: 'Check the name for your business is correct.',
    userName: data.customer.userName ?? null,
    businessName: data.businessName ?? null,
    changeBusinessName: data.changeBusinessName ?? data.businessName,
    sbi: data.sbi ?? null
  }
}

export {
  businessNameCheckPresenter
}

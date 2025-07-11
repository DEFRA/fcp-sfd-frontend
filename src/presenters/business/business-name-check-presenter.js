/**
 * Formats data ready for presenting in the `/business-name-check` page
 * @module businessNameCheckPresenter
 */

const businessNameCheckPresenter = (data) => {
  return {
    backLink: { href: '/business-name-change' },
    cancelLink: '/business-details',
    changeLink: '/business-name-change',
    pageTitle: 'Check your business name is correct before submitting',
    metaDescription: 'Check the name for your business is correct.',
    businessName: data.businessName ?? null,
    changeBusinessName: data.changeBusinessName ?? data.businessName ?? null,
    sbi: data.sbi ?? null,
    userName: data.userName ?? null
  }
}

export {
  businessNameCheckPresenter
}

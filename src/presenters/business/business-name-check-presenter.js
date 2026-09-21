/**
 * Formats data ready for presenting in the `/business-name-check` page
 * @module businessNameCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

const businessNameCheckPresenter = (data) => {
  return {
    backLink: { href: BUSINESS_CHANGE_LINKS.businessName },
    changeLink: BUSINESS_CHANGE_LINKS.businessName,
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

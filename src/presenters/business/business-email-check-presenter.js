/**
 * Formats data ready for presenting in the `/business-email-check` page
 * @module businessEmailCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

const businessEmailCheckPresenter = (data) => {
  return {
    backLink: { href: BUSINESS_CHANGE_LINKS.businessEmail },
    changeLink: BUSINESS_CHANGE_LINKS.businessEmail,
    pageTitle: 'Check your business email address is correct before submitting',
    metaDescription: 'Check the email address for your business is correct.',
    userName: data.customer.userName ?? null,
    businessEmail: data.changeBusinessEmail ?? data.email,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessEmailCheckPresenter
}

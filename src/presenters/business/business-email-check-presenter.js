/**
 * Formats data ready for presenting in the `/business-email-check` page
 * @module businessEmailCheckPresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const businessEmailCheckPresenter = (data) => {
  return presenters.businessEmailCheck(data, { href: '/business-email-change' }, '/business-email-change')
}

export {
  businessEmailCheckPresenter
}

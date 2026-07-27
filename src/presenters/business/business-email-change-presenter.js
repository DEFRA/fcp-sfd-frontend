/**
 * Formats data ready for presenting in the `/business-email-change` page
 * @module businessEmailEnterPresenter
 */

import { presenters } from '@defra/fcp-sfd-frontend-engine'

const businessEmailChangePresenter = (data, payload) => {
  return presenters.businessEmailChange(data, payload, { href: '/business-details' })
}

export {
  businessEmailChangePresenter
}

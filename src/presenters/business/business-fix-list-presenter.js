/**
 * Formats data ready for presenting in the `/business-fix-list` page
 * @module businessFixListPresenter
 */

import { formatNumber, formatChangedAddress, sortErrorsBySectionOrder } from '../base-presenter.js'
import { BUSINESS_SECTION_FIELD_ORDER } from '../../constants/interrupter-journey.js'

const businessFixListPresenter = (businessDetails, payload, errors = null) => {
  const sortedErrors = errors ? sortErrorsBySectionOrder(errors, businessDetails.orderedSectionsToFix, BUSINESS_SECTION_FIELD_ORDER) : null

  return {
    backLink: { href: '/business-fix' },
    pageTitle: 'Your business details to update',
    metaDescription: 'Your business details to update.',
    sections: businessDetails.orderedSectionsToFix,
    userName: businessDetails.customer?.userName ?? null,
    businessName: payload?.businessName ?? businessDetails.changeBusinessName?.businessName ?? businessDetails.info.businessName,
    businessTelephone: formatNumber(payload?.businessTelephone, businessDetails.changeBusinessPhoneNumbers?.businessTelephone, businessDetails.contact.landline),
    businessMobile: formatNumber(payload?.businessMobile, businessDetails.changeBusinessPhoneNumbers?.businessMobile, businessDetails.contact.mobile),
    businessEmail: payload?.businessEmail ?? businessDetails.changeBusinessEmail?.businessEmail ?? businessDetails.contact.email,
    address: formatAddress(payload, businessDetails.changeBusinessAddress),
    vatNumber: payload?.vatNumber ?? businessDetails.changeBusinessVat?.vatNumber ?? businessDetails.info?.vat,
    errors: sortedErrors
  }
}

const formatAddress = (payload, changeBusinessAddress) => {
  if (payload) {
    const {
      address1,
      address2,
      address3,
      city,
      county,
      postcode,
      country
    } = payload

    return { address1, address2, address3, city, county, postcode, country }
  }

  if (changeBusinessAddress) {
    return formatChangedAddress(changeBusinessAddress)
  }

  return null
}

export {
  businessFixListPresenter
}

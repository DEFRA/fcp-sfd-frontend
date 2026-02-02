/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

import { formatBackLink, formatDisplayAddress } from '../base-presenter.js'

const businessDetailsPresenter = (data, yar, permissionGroup) => {
  const countyParishHoldingNumbers = formatCph(data.info.countyParishHoldingNumbers)

  return {
    backLink: {
      text: data.info.businessName ? formatBackLink(data.info.businessName) : 'Back',
      href: '/home'
    },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: permissionGroup.viewPermission ? 'View business details' : 'View and update your business details',
    metaDescription: 'View and update your business details.',
    userName: data.customer.userName ?? null,
    address: formatDisplayAddress(data.address),
    businessName: data.info.businessName,
    businessTelephone: {
      telephone: data.contact.landline ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added'
    },
    businessEmail: data.contact.email,
    sbi: data.info.sbi,
    vatNumber: data.info.vat ?? 'No number added',
    tradeNumber: data.info.traderNumber ?? null,
    vendorRegistrationNumber: data.info.vendorNumber ?? null,
    countyParishHoldingNumbers,
    countyParishHoldingNumbersText: `County Parish Holding (CPH) number${countyParishHoldingNumbers.length > 1 ? 's' : ''}`,
    businessLegalStatus: data.info.legalStatus,
    businessType: data.info.type,
    changeLinks: setChangeLinks(data, permissionGroup),
    permissionsText: setPermissionsText(permissionGroup)
  }
}

const setPermissionsText = (permissionGroup) => {
  if (permissionGroup.amendPermission) {
    return 'You only have permission to update contact details for this business. You can ask the business to raise your permission level.'
  }

  if (permissionGroup.viewPermission) {
    return 'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
  }

  return null
}

const getAmendLinks = (data) => {
  return {
    businessAddress: {
      items: [
        {
          href: '/business-address-change',
          text: 'Change',
          visuallyHiddenText: 'business address'
        }
      ]
    },
    businessTelephone: {
      items: [
        {
          href: '/business-phone-numbers-change',
          text: data.contact.landline || data.contact.mobile ? 'Change' : 'Add',
          visuallyHiddenText: 'business phone numbers'
        }
      ]
    },
    businessEmail: {
      items: [
        {
          href: '/business-email-change',
          text: 'Change',
          visuallyHiddenText: 'business email address'
        }
      ]
    }
  }
}

const getFullPermissionLinks = (data) => {
  const fullPermissionLinks = {
    businessName: {
      items: [
        {
          href: '/business-name-change',
          text: 'Change',
          visuallyHiddenText: 'business name'
        }
      ]
    },
    businessLegal: {
      items: [
        {
          href: '/business-legal-status-change',
          text: 'Change',
          visuallyHiddenText: 'business legal status'
        }
      ]
    },
    businessType: {
      items: [
        {
          href: '/business-type-change',
          text: 'Change',
          visuallyHiddenText: 'business type'
        }
      ]
    }
  }

  if (data.info.vat) {
    fullPermissionLinks.businessVatNumber = {
      items: [
        {
          href: '/business-vat-registration-remove',
          text: 'Remove',
          visuallyHiddenText: 'VAT registration number'
        },
        {
          href: '/business-vat-registration-number-change',
          text: 'Change',
          visuallyHiddenText: 'VAT registration number'
        }
      ]
    }
  } else {
    fullPermissionLinks.businessVatNumber = {
      items: [
        {
          href: '/business-vat-registration-number-change',
          text: 'Add',
          visuallyHiddenText: 'VAT registration number'
        }
      ]
    }
  }

  return fullPermissionLinks
}

const setChangeLinks = (data, permissionGroup) => {
  if (permissionGroup.fullPermission) {
    return {
      ...getAmendLinks(data),
      ...getFullPermissionLinks(data),
      fullPermission: true
    }
  }

  if (permissionGroup.amendPermission) {
    return {
      ...getAmendLinks(data),
      amendPermission: true
    }
  }

  return {}
}

const formatCph = (countyParishHoldings) => {
  return (countyParishHoldings || [])
    .filter(cph => cph?.cphNumber) // removes null objects & null/undefined cphNumber
    .map(cph => cph.cphNumber)
}

export {
  businessDetailsPresenter
}

/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

import { formatDisplayAddress } from '../base-presenter.js'
import { FULL_PERMISSIONS, AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const businessDetailsPresenter = (data, yar, permissionLevels) => {
  return {
    backLink: { href: '/home' },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
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
    countyParishHoldingNumbers: formatCph(data.info.countyParishHoldingNumbers),
    businessLegalStatus: data.info.legalStatus,
    businessType: data.info.type,
    userName: data.customer.fullName,
    changeLinks: setChangeLinks(data, permissionLevels)
  }
}

const setChangeLinks = (data, permissionLevels) => {
  const amendPermission = permissionLevels.some(permission => AMEND_PERMISSIONS.includes(permission))
  const fullPermission = permissionLevels.some(permission => FULL_PERMISSIONS.includes(permission))

  const amendLinks = {
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

  if (fullPermission) {
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

    return {
      ...amendLinks,
      ...fullPermissionLinks,
      fullPermission: true
    }
  } else if (amendPermission) {
    return {
      ...amendLinks,
      amendPermission: true
    }
  } else {
    return {}
  }
}

const formatCph = (countyParishHoldings) => {
  return countyParishHoldings.map(cph => cph.cphNumber)
}

export {
  businessDetailsPresenter
}

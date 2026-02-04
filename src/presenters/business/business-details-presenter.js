/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessDetailsPresenter
 */

import { formatBackLink, formatDisplayAddress } from '../base-presenter.js'
import { BUSINESS_CHANGE_LINKS } from '../../constants/change-links.js'
import { businessDetailsChangeLinksPresenter } from './business-details-change-links-presenter.js'


const businessDetailsPresenter = (data, yar, permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate) => {
  const changeLinks = businessDetailsChangeLinksPresenter(permissionLevel, hasValidBusinessDetails, sectionsNeedingUpdate)
  const countyParishHoldingNumbers = formatCph(data.info.countyParishHoldingNumbers)

  return {
    backLink: {
      text: data.info.businessName ? formatBackLink(data.info.businessName) : 'Back',
      href: '/home'
    },
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: permissionLevel === 'view' ? 'View business details' : 'View and update your business details',
    metaDescription: 'View and update your business details.',
    userName: data.customer.userName ?? null,
    permissionsText: setPermissionsText(permissionLevel),
    businessAddress: {
      value: formatDisplayAddress(data.address),
      changeLink: changeLinks.businessAddress,
      action: getActionText(data.address)
    },
    businessName: {
      value: data.info.businessName ?? 'Not added',
      changeLink: changeLinks.businessName,
      action: getActionText(data.info.businessName)
    },
    businessTelephone: {
      telephone: data.contact.landline ?? 'Not added',
      mobile: data.contact.mobile ?? 'Not added',
      action: getActionText(data.contact.landline || data.contact.mobile),
      changeLink: changeLinks.businessTelephone
    },
    businessEmail: {
      value: data.contact.email ?? 'Not added',
      action: getActionText(data.contact.email),
      changeLink: changeLinks.businessEmail
    },
    sbi: data.info.sbi,
    vatNumber: buildVatDisplay(data.info.vat, changeLinks.vat),
    tradeNumber: data.info.traderNumber ?? null,
    vendorRegistrationNumber: data.info.vendorNumber ?? null,
    countyParishHoldingNumbers,
    countyParishHoldingNumbersText: `County Parish Holding (CPH) number${countyParishHoldingNumbers.length > 1 ? 's' : ''}`,
    businessLegalStatus: {
      value: data.info.legalStatus ?? 'Not added',
      action: getActionText(data.info.legalStatus),
      changeLink: permissionLevel === 'full' ? BUSINESS_CHANGE_LINKS.businessLegal : null
    },
    businessType: {
      value: data.info.type ?? 'Not added',
      action: getActionText(data.info.type),
      changeLink: permissionLevel === 'full' ? BUSINESS_CHANGE_LINKS.businessType : null
    }
  }
}

/**
 * Builds VAT display based on change-link intent.
 */
const buildVatDisplay = (vatNumber, vatChangeState) => {
  const value = vatNumber || 'No number added'

  if (!vatChangeState) {
    return {
      value,
      action: null,
      changeLink: null
    }
  }

  if (vatChangeState === 'interrupter') {
    if (!vatNumber) {
      return {
        value,
        action: 'Add',
        changeLink: '/business-fix?source=vat-add'
      }
    }

    return {
      value: vatNumber,
      action: 'Change',
      changeLink: {
        items: [
          {
            href: '/business-fix?source=vat-change',
            text: 'Change',
            visuallyHiddenText: 'VAT registration number'
          },
          {
            href: '/business-fix?source=vat-remove',
            text: 'Remove',
            visuallyHiddenText: 'VAT registration number'
          }
        ]
      }
    }
  }

  if (!vatNumber) {
    return {
      value,
      action: 'Add',
      changeLink: BUSINESS_CHANGE_LINKS.vatNumberAdd
    }
  }

  return {
    value,
    action: 'Change',
    changeLink: {
      items: [
        {
          href: BUSINESS_CHANGE_LINKS.vatNumberChange,
          text: 'Change',
          visuallyHiddenText: 'VAT registration number'
        },
        {
          href: BUSINESS_CHANGE_LINKS.vatNumberRemove,
          text: 'Remove',
          visuallyHiddenText: 'VAT registration number'
        }
      ]
    }
  }
}

const getActionText = (value) => {
  return value ? 'Change' : 'Add'
}

const setPermissionsText = (permissionLevel) => {
  if (permissionLevel === 'amend') {
    return 'You only have permission to update contact details for this business. You can ask the business to raise your permission level.'
  }

  if (permissionLevel === 'view') {
    return 'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
  }

  return null
}

const formatCph = (countyParishHoldings) => {
  return (countyParishHoldings || [])
    .filter(cph => cph?.cphNumber) // removes null objects & null/undefined cphNumber
    .map(cph => cph.cphNumber)
}

export {
  businessDetailsPresenter
}

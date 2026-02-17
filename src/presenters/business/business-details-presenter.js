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
    businessNameHeader: data.info.businessName ?? null,
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
 * Builds the VAT row data for the business details page.
 *
 * VAT is more complex than other fields because:
 * - Users may or may not have permission to change VAT details
 * - VAT supports multiple actions (add, change, remove)
 * - During the business details interrupter flow, VAT actions may need
 *   to route via the business-fix journey instead of the normal pages
 *
 * This function does not return direct URLs in all cases.
 * Instead, it returns the data needed by the view to render:
 * - the displayed VAT value
 * - the action text (Add / Change)
 * - either a single change link, multiple links (Change / Remove),
 *   or no links at all
 *
 * Behaviour summary:
 * - If `vatChangeState` is null, the user does not have permission to
 *   change VAT and no actions are shown.
 * - If `vatChangeState` is `'interrupter'`, links are routed via the
 *   business-fix pages to force the user through the interrupter journey.
 * - Otherwise, normal add/change/remove links are returned.
 */
const buildVatDisplay = (vatNumber, vatChangeState) => {
  const hasVat = Boolean(vatNumber)
  const value = vatNumber || 'No number added'

  // If no vatChangeState it means the user does not have permission to change VAT details
  if (!vatChangeState) {
    return {
      value,
      action: null,
      changeLink: null
    }
  }

  // Interrupter flow: invalid data, user has permission, must go via business-fix
  if (vatChangeState === 'interrupter') {
    const changeLink = '/business-fix?source=vat'
    // Links still need to display the same as normal, but if no VAT number, link goes to interrupter add page
    if (!hasVat) {
      return {
        value,
        action: 'Add',
        changeLink
      }
    }

    // If VAT number exists, show normal change/remove links but via interrupter pages
    return {
      value: vatNumber,
      action: 'Change',
      changeLink: {
        items: [
          {
            href: changeLink,
            text: 'Change',
            visuallyHiddenText: 'VAT registration number',
            classes: 'govuk-link--no-visited-state'
          },
          {
            href: changeLink,
            text: 'Remove',
            visuallyHiddenText: 'VAT registration number',
            classes: 'govuk-link--no-visited-state'
          }
        ]
      }
    }
  }

  // Normal flow: user has permission and no interrupter
  if (!hasVat) {
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
          visuallyHiddenText: 'VAT registration number',
          classes: 'govuk-link--no-visited-state'
        },
        {
          href: BUSINESS_CHANGE_LINKS.vatNumberRemove,
          text: 'Remove',
          visuallyHiddenText: 'VAT registration number',
          classes: 'govuk-link--no-visited-state'
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

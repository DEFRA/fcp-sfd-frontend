/**
 * Formats data ready for presenting in the `/home` page
 * @module homePresenter
 */

import { VIEW_LEVEL_PERMISSION } from '../constants/scope/business-details.js'

const homePresenter = (data, permissionGroups, enrolmentCount, isOnFarmingPaymentsAllowlist) => {
  const presentedData = {
    pageTitle: 'Your business',
    metaDescription: 'Home page for your business\'s schemes and details.',
    userName: data.info.userName,
    businessName: data.business.info.name,
    businessDetails: setBusinessDetails(permissionGroups),
    sbi: data.business.info.sbi,
    isOnFarmingPaymentsAllowlist,
    farmingPayments: {
      link: 'fp-check-your-details',
      title: 'Farm Payments Technical Test',
      // Status hidden for now; endpoint from FPTT not available yet. Will update in a future ticket.
      status: 'do-not-show'
    }
  }

  if (enrolmentCount && enrolmentCount > 1) {
    presentedData.backLink = {
      text: 'Choose another business',
      href: '/auth/reselect-business'
    }
  }

  return presentedData
}

const setBusinessDetails = (permissionGroups) => {
  if (permissionGroups.includes(VIEW_LEVEL_PERMISSION)) {
    return {
      link: '/business-details',
      text: 'View your Business details'
    }
  }

  return {
    link: '/business-details',
    text: 'View and update your business details'
  }
}

export {
  homePresenter
}

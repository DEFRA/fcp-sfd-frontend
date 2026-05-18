/**
 * Formats data ready for presenting in the `/home` page
 * @module homePresenter
 */

import { VIEW_LEVEL_PERMISSION } from '../constants/scope/business-details.js'
import { config } from '../config/index.js'

const homePresenter = (data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList) => {
  const presentedData = {
    pageTitle: 'Your business',
    metaDescription: 'Home page for your business\'s schemes and details.',
    userName: data.info.userName,
    signOutLink: '/auth/sign-out',
    businessName: data.business.info.name,
    businessDetails: setBusinessDetails(permissionGroups),
    personalDetails: {
      link: '/personal-details',
      text: 'View and update your personal details'
    },
    sbi: data.business.info.sbi,
    isOnWoodlandManagementAllowList
  }

  if (enrolmentCount && enrolmentCount > 1) {
    presentedData.backLink = {
      text: 'Choose another business',
      href: '/auth/reselect-business'
    }
  }

  if (isOnWoodlandManagementAllowList) {
    const woodlandManagementLink = config.get('servicesConfig.WMPEndpoint')

    presentedData.woodlandManagement = {
      link: `${woodlandManagementLink}?ssoOrgId=${data.business.info.organisationId}`,
      title: 'Woodland Management Plan',
      // Status hidden for now; endpoint from grants not available yet. Will update in a future ticket.
      status: 'do-not-show'
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

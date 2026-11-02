/**
 * Formats data ready for presenting in the `/home` page
 * @module homePresenter
 */

import { VIEW_LEVEL_PERMISSION } from '../constants/scope/business-details.js'
import { config } from '../config/index.js'

const homePresenter = (data, permissionGroups, enrolmentCount, isOnWoodlandManagementAllowList) => {
  const { name, sbi, organisationId } = data.business

  const presentedData = {
    pageTitle: 'Your business',
    metaDescription: 'Home page for your business\'s schemes and details.',
    userName: data.userName,
    signOutLink: '/auth/sign-out',
    businessName: name,
    businessDetails: setBusinessDetails(permissionGroups),
    personalDetails: {
      link: '/personal-details',
      text: 'View and update your personal details'
    },
    sbi,
    grants: setGrants(organisationId, isOnWoodlandManagementAllowList)
  }

  if (enrolmentCount && enrolmentCount > 1) {
    presentedData.backLink = {
      text: 'Choose another business',
      href: '/auth/reselect-business'
    }
  }

  return presentedData
}

const buildGrantLink = (baseUrl, organisationId) => {
  return `${baseUrl}?ssoOrgId=${organisationId}`
}

const compareByTitleAlphabetically = (grantA, grantB) => grantA.title.localeCompare(grantB.title)

const setGrants = (organisationId, isOnWoodlandManagementAllowList) => {
  const grants = []

  if (isOnWoodlandManagementAllowList) {
    grants.push({
      link: buildGrantLink(config.get('servicesConfig.WMPEndpoint'), organisationId),
      title: 'Woodland Management Plan',
      // Status hidden for now; endpoint from grants not available yet. Will update in a future ticket.
      status: 'do-not-show'
    })
  }

  // Access is managed by the grants team, so there is no allow list; the toggle only controls rollout
  if (config.get('featureToggle.waterManagementEnabled')) {
    grants.push({
      link: buildGrantLink(config.get('servicesConfig.waterManagementEndpoint'), organisationId),
      title: 'Water Management grant round 3',
      status: 'do-not-show'
    })
  }

  return grants.toSorted(compareByTitleAlphabetically)
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

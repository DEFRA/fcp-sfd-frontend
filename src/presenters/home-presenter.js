/**
 * Formats data ready for presenting in the `/home` page
 * @module homePresenter
 */

import { VIEW_LEVEL_PERMISSION, LEGAL_PERMISSIONS } from '../constants/scope/business-details.js'
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
    grants: setGrants(organisationId, permissionGroups, isOnWoodlandManagementAllowList)
  }

  if (enrolmentCount && enrolmentCount > 1) {
    presentedData.backLink = {
      text: 'Choose another business',
      href: '/auth/reselect-business'
    }
  }

  return presentedData
}

const byTitle = (grantA, grantB) => grantA.title.localeCompare(grantB.title)

const setGrants = (organisationId, permissionGroups, isOnWoodlandManagementAllowList) => {
  const canMakeLegalChanges = LEGAL_PERMISSIONS.some(permission => permissionGroups.includes(permission))
  const grants = []

  if (isOnWoodlandManagementAllowList) {
    const woodlandManagementLink = config.get('servicesConfig.WMPEndpoint')

    grants.push({
      link: `${woodlandManagementLink}?ssoOrgId=${organisationId}`,
      title: 'Woodland Management Plan',
      // Status hidden for now; endpoint from grants not available yet. Will update in a future ticket.
      status: 'do-not-show'
    })
  }

  if (canMakeLegalChanges) {
    const waterManagementLink = config.get('servicesConfig.WaterManagementEndpoint')

    grants.push({
      link: `${waterManagementLink}?ssoOrgId=${organisationId}`,
      title: 'Water Management',
      status: 'do-not-show'
    })
  }

  return grants.toSorted(byTitle)
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

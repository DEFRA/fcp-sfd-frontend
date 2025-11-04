/**
 * Formats data ready for presenting in the `/home` page
 * @module homePresenter
 */

import { VIEW_LEVEL_PERMISSION } from '../constants/scope/business-details.js'
import { formatFullName } from './base-presenter.js'
import { config } from '../config/index.js'

const homePresenter = (authData) => {
  const IAHWEndpoint = config.get('servicesConfig.IAHWEndpoint')
  return {
    pageTitle: 'Your business',
    metaDescription: 'Home page for your business\'s schemes and details.',
    fullName: formatFullName(data.info.fullName),
    businessName: data.business.info.name,
    businessDetails: setBusinessDetails(permissionGroups),
    sbi: data.business.info.sbi,
    IAHWLink: `${IAHWEndpoint}+${authData.credentials.ssoOrgId}`
  }
}

const setBusinessDetails = (permissionGroups) => {
  if (permissionGroups.includes(VIEW_LEVEL_PERMISSION)) {
    return {
      link: '/business-details',
      text: 'View business details'
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

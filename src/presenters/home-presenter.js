/**
 * Formats data ready for presenting in the `/home` page
 * @module homePresenter
 */

import { VIEW_LEVEL_PERMISSION } from '../constants/scope/business-details.js'
import { config } from '../config/index.js'

const homePresenter = (authData) => {
  const IAHWEndpoint = config.get('servicesConfig.IAHWEndpoint')

  return {
    userName: authData.name ?? null,
    businessDetails: setBusinessDetails(authData.credentials.scope),
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

export const featureToggleConfig = {
  featureToggle: {
    personalDetailsInterrupterEnabled: {
      doc: 'Enables the personal details interrupter journey',
      format: Boolean,
      default: false,
      env: 'PERSONAL_DETAILS_INTERRUPTER_ENABLED'
    },
    businessDetailsInterrupterEnabled: {
      doc: 'Enables the business details interrupter journey',
      format: Boolean,
      default: false,
      env: 'BUSINESS_DETAILS_INTERRUPTER_ENABLED'
    },
    cphEnabled: {
      doc: 'Enables County Parish Holding (CPH) data in business details',
      format: Boolean,
      default: false,
      env: 'CPH_ENABLED'
    },
    waterManagementEnabled: {
      doc: 'Enables the Water Management grant tile on the home page',
      format: Boolean,
      default: false,
      env: 'WATER_MANAGEMENT_ENABLED'
    },
    viewLand: {
      doc: 'Enables the view land feature',
      format: Boolean,
      default: false,
      env: 'VIEW_LAND_ENABLED'
    },
    updatePersonalDetails: {
      doc: 'Enables personal details update functionality (change links)',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS'
    },
    updateBusinessDetails: {
      doc: 'Enables business details update functionality (change links)',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS'
    }
  }
}

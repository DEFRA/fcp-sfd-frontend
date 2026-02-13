export const featureToggleConfig = {
  featureToggle: {
    dalConnection: {
      doc: 'Turns the dal connector on or off as source of crown-host data',
      format: Boolean,
      default: false,
      env: 'DAL_CONNECTION'
    },
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
    }
  }
}

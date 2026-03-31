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
    }
  }
}

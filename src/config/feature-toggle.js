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
      doc: 'Enables personal details update functionality (master toggle)',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS'
    },
    updatePersonalDetailsName: {
      doc: 'Enables personal name update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS_NAME'
    },
    updatePersonalDetailsDob: {
      doc: 'Enables personal date of birth update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS_DOB'
    },
    updatePersonalDetailsAddress: {
      doc: 'Enables personal address update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS_ADDRESS'
    },
    updatePersonalDetailsPhone: {
      doc: 'Enables personal phone number update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS_PHONE'
    },
    updatePersonalDetailsEmail: {
      doc: 'Enables personal email update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_PERSONAL_DETAILS_EMAIL'
    },
    updateBusinessDetails: {
      doc: 'Enables business details update functionality (master toggle)',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS'
    },
    updateBusinessDetailsName: {
      doc: 'Enables business name update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_NAME'
    },
    updateBusinessDetailsAddress: {
      doc: 'Enables business address update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_ADDRESS'
    },
    updateBusinessDetailsPhone: {
      doc: 'Enables business phone number update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_PHONE'
    },
    updateBusinessDetailsEmail: {
      doc: 'Enables business email update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_EMAIL'
    },
    updateBusinessDetailsVat: {
      doc: 'Enables business VAT update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_VAT'
    },
    updateBusinessDetailsCharityRegistration: {
      doc: 'Enables business charity registration update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_CHARITY_REGISTRATION'
    },
    updateBusinessDetailsCompanyRegistration: {
      doc: 'Enables business company registration update functionality',
      format: Boolean,
      default: true,
      env: 'UPDATE_BUSINESS_DETAILS_COMPANY_REGISTRATION'
    }
  }
}

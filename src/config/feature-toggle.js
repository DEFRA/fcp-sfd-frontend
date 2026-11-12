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
    personalDetails: {
      updatePersonalDetails: {
        doc: 'Enables the update personal details feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_PERSONAL_DETAILS'
      },
      updatePersonalDetailsName: {
        doc: 'Enables the update personal details name feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_PERSONAL_DETAILS_NAME'
      },
      updatePersonalDetailsDob: {
        doc: 'Enables the update personal details date of birth feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_PERSONAL_DETAILS_DOB'
      },
      updatePersonalDetailsAddress: {
        doc: 'Enables the update personal details address feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_PERSONAL_DETAILS_ADDRESS'
      },
      updatePersonalDetailsPhone: {
        doc: 'Enables the update personal details phone feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_PERSONAL_DETAILS_PHONE'
      },
      updatePersonalDetailsEmail: {
        doc: 'Enables the update personal details email feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_PERSONAL_DETAILS_EMAIL'
      }
    },
    businessDetails: {
      updateBusinessDetails: {
        doc: 'Enables the update business details feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS'
      },
      updateBusinessDetailsName: {
        doc: 'Enables the update business details name feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS_NAME'
      },
      updateBusinessDetailsAddress: {
        doc: 'Enables the update business details address feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS_ADDRESS'
      },
      updateBusinessDetailsPhone: {
        doc: 'Enables the update business details phone feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS_PHONE'
      },
      updateBusinessDetailsEmail: {
        doc: 'Enables the update business details email feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS_EMAIL'
      },
      updateBusinessDetailsVat: {
        doc: 'Enables the update business details VAT feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS_VAT'
      },
      updateBusinessDetailsRegistrationNumber: {
        doc: 'Enables the update business details registration number feature',
        format: Boolean,
        default: true,
        env: 'UPDATE_BUSINESS_DETAILS_REGISTRATION_NUMBER'
      }
    }
  }
}

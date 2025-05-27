import { BusinessDetailsController } from '../controllers/business-details.controller.js'

const routes = [
  {
    method: 'GET',
    path: '/business-details',
    options: {
      handler: BusinessDetailsController.businessDetails
    }
  },
  {
    method: 'GET',
    path: '/business-details/address',
    options: {
      handler: BusinessDetailsController.address
    }
  },
  {
    method: 'POST',
    path: '/business-details/address',
    options: {
      handler: BusinessDetailsController.submitAddress
    }
  }
  // {
  //   method: 'GET',
  //   path: '/business-details/check-address',
  //   options: {
  //     handler: BusinessDetailsController.checkAddress
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/check-address',
  //   options: {
  //     handler: BusinessDetailsController.submitCheckAddress
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/email',
  //   options: {
  //     handler: BusinessDetailsController.email
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/email',
  //   options: {
  //     handler: BusinessDetailsController.submitEmail
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/check-email',
  //   options: {
  //     handler: BusinessDetailsController.checkEmail
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/check-email',
  //   options: {
  //     handler: BusinessDetailsController.submitCheckEmail
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/name',
  //   options: {
  //     handler: BusinessDetailsController.name
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/name',
  //   options: {
  //     handler: BusinessDetailsController.submitName
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/check-name',
  //   options: {
  //     handler: BusinessDetailsController.checkName
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/check-name',
  //   options: {
  //     handler: BusinessDetailsController.submitCheckName
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/phone-number',
  //   options: {
  //     handler: BusinessDetailsController.phoneNumber
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/phone-number',
  //   options: {
  //     handler: BusinessDetailsController.submitPhoneNumber
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/check-phone-number',
  //   options: {
  //     handler: BusinessDetailsController.checkPhoneNumber
  //   }
  // },
  // {
  //   method: 'POST',
  //   path: '/business-details/check-phone-number',
  //   options: {
  //     handler: BusinessDetailsController.submitCheckPhoneNumber
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/legal-status',
  //   options: {
  //     handler: BusinessDetailsController.legalStatus
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: '/business-details/business-type',
  //   options: {
  //     handler: BusinessDetailsController.businessType
  //   }
  // },
]

export const businessDetailsRoutes = routes

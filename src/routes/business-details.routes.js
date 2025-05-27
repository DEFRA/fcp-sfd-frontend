import { BusinessDetailsController } from '../controllers/business-details.controller.js'

const routes = [
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
]

export const newBusinessDetailsRoutes = routes

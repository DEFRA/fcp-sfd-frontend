import { businessDetailsService } from '../../services/business/business-details.service.js'

const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: async (request, h) => {
    const pageData = await businessDetailsService(request)

    return h.view('business/business-details.njk', pageData)
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails
]

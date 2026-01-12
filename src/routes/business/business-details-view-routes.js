const getBusinessDetailsView = {
  method: 'GET',
  path: '/business-details-view',
  handler: async (_request, h) => {
    return h.view('business/business-details-view.njk', {})
  }
}

export const businessDetailsViewRoute = [
  getBusinessDetailsView
]

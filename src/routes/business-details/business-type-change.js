const getBusinessTypeChange = {
  method: 'GET',
  path: '/business-type-change',
  handler: (_, h) => {
    return h.view('business-details/business-type-change')
  }
}

export const businessTypeRoutes = [
  getBusinessTypeChange
]

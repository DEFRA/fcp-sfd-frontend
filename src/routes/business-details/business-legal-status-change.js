const getBusinessLegalStatusChange = {
  method: 'GET',
  path: '/business-legal-status-change',
  handler: (_, h) => {
    return h.view('business-details/business-legal-status-change')
  }
}

export const businessLegalStatusRoutes = [
  getBusinessLegalStatusChange
]

export const getBusinessLegalStatusChange = {
  method: 'GET',
  path: '/business-legal-status-change',
  handler: (_, h) => {
    return h.view('business/business-legal-status-change')
  }
}

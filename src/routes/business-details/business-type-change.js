export const getBusinessTypeChange = {
  method: 'GET',
  path: '/business-type-change',
  handler: (request, h) => {
    return h.view('business-details/business-type-change')
  }
}

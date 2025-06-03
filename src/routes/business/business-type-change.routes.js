export const getBusinessTypeChange = {
  method: 'GET',
  path: '/business-type-change',
  handler: (_, h) => {
    return h.view('business/business-type-change')
  }
}

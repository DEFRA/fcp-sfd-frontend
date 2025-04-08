export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: (request, h) => {
    const showSuccessBanner = request.state.showSuccessBanner === 'true'
    const businessName = request.state.businessName

    return h.view('business-details/business-details', {
      showSuccessBanner,
      businessName
    }).unstate('showSuccessBanner').unstate('businessName')
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

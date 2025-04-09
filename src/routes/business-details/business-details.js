export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: (request, h) => {
    const showSuccessBanner = request.state.showSuccessBanner === 'true'

    let businessName = request.state.businessName
    const originalBusinessName = request.state.originalBusinessName

    if (originalBusinessName && !showSuccessBanner) {
      businessName = originalBusinessName
    }

    businessName = businessName || 'Agile Farm Ltd'

    return h.view('business-details/business-details', {
      showSuccessBanner,
      businessName
    })
      .unstate('showSuccessBanner')
      .unstate('originalBusinessName')
      .state('businessName', businessName)
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

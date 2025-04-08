export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: (request, h) => {
    const showSuccessBanner = request.state.showSuccessBanner === 'true'

    return h.view('business-details/business-details', {
      showSuccessBanner
    }).unstate('showSuccessBanner')
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

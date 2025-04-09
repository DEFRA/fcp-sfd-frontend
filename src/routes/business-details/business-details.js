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

    // Get address values from state or use defaults
    const address1 = request.state.address1 || '10 Skirbeck Way'
    const address2 = request.state.address2 || ''
    const addressCity = request.state.addressCity || 'Maidstone'
    const addressCounty = request.state.addressCounty || ''
    const addressPostcode = request.state.addressPostcode || 'SK22 1DL'
    const addressCountry = request.state.addressCountry || 'United Kingdom'

    // Format address for display
    const formattedAddress = [
      address1,
      address2,
      addressCity,
      addressCounty,
      addressPostcode,
      addressCountry
    ].filter(Boolean).join('<br>')

    return h.view('business-details/business-details', {
      showSuccessBanner,
      businessName,
      formattedAddress
    })
      .unstate('showSuccessBanner')
      .unstate('originalBusinessName')
      .state('businessName', businessName)
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

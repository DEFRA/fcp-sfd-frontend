const getBusinessAddressCheck = {
  method: 'GET',
  path: '/business-address-check',
  handler: (request, h) => {
    const address1 = request.state.address1 || ''
    const address2 = request.state.address2 || ''
    const city = request.state.city || ''
    const addressCounty = request.state.addressCounty || ''
    const postcode = request.state.postcode || ''
    const addressCountry = request.state.addressCountry || ''

    return h.view('business/business-address-check', {
      address1,
      address2,
      city,
      addressCounty,
      postcode,
      addressCountry
    })
  }
}

const postBusinessAddressCheck = {
  method: 'POST',
  path: '/business-address-check',
  handler: (request, h) => {
    const address1 = request.state.address1 || ''
    const address2 = request.state.address2 || ''
    const city = request.state.city || ''
    const addressCounty = request.state.addressCounty || ''
    const postcode = request.state.postcode || ''
    const addressCountry = request.state.addressCountry || ''

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('successField', 'BUSINESS_ADDRESS')
      .state('address1', address1)
      .state('address2', address2)
      .state('city', city)
      .state('addressCounty', addressCounty)
      .state('postcode', postcode)
      .state('addressCountry', addressCountry)
      .unstate('originalBusinessName')
  }
}

export const businessAddressCheckRoutes = [
  getBusinessAddressCheck,
  postBusinessAddressCheck
]

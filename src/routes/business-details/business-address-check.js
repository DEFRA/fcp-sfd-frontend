export const getBusinessAddressCheck = {
  method: 'GET',
  path: '/business-address-check',
  handler: (request, h) => {
    const address1 = request.state.address1 || ''
    const address2 = request.state.address2 || ''
    const addressCity = request.state.addressCity || ''
    const addressCounty = request.state.addressCounty || ''
    const addressPostcode = request.state.addressPostcode || ''
    const addressCountry = request.state.addressCountry || ''

    return h.view('business-details/business-address-check', {
      address1,
      address2,
      addressCity,
      addressCounty,
      addressPostcode,
      addressCountry
    })
  }
}

export const postBusinessAddressCheck = {
  method: 'POST',
  path: '/business-address-check',
  handler: (request, h) => {
    const address1 = request.state.address1 || ''
    const address2 = request.state.address2 || ''
    const addressCity = request.state.addressCity || ''
    const addressCounty = request.state.addressCounty || ''
    const addressPostcode = request.state.addressPostcode || ''
    const addressCountry = request.state.addressCountry || ''

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('successField', 'BUSINESS_ADDRESS')
      .state('address1', address1)
      .state('address2', address2)
      .state('addressCity', addressCity)
      .state('addressCounty', addressCounty)
      .state('addressPostcode', addressPostcode)
      .state('addressCountry', addressCountry)
      .unstate('originalBusinessName')
  }
}

export const businessAddressCheckRoutes = [
  getBusinessAddressCheck,
  postBusinessAddressCheck
]

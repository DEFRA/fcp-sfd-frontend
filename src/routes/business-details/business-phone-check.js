export const getBusinessPhoneCheck = {
  method: 'GET',
  path: 'business-phone-check',
  handler: (request, h) => {
    const businessTelephone = request.state.businessTelephone || ''
    const businessMobile = request.state.businessMobile || ''

    return h.view('business-details/business-phone-check', {
      businessTelephone,
      businessMobile
    })
  }
}

export const postBusinessPhoneCheck = {
  method: 'POST',
  path: '/business-phone-check',
  handler: (request, h) => {
    const businessTelephone = request.state.businessTelephone
    const businessMobile = request.state.businessMobile

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('businessTelephone', businessTelephone)
      .state('businessMobile', businessMobile)
      .unstate('originalBusinessTelephone')
      .unstate('originalBusinessMobile')
  }
}

export const businessPhoneCheckRoutes = [
  getBusinessPhoneCheck,
  postBusinessPhoneCheck
]
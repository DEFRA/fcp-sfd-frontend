export const getBusinessPhoneNumbersCheck = {
  method: 'GET',
  path: '/business-phone-numbers-check',
  handler: (request, h) => {
    const businessTelephone = request.state.tempBusinessTelephone || ''
    const businessMobile = request.state.tempBusinessMobile || ''

    return h.view('business-details/business-phone-numbers-check', {
      businessTelephone,
      businessMobile
    })
  }
}

export const postBusinessPhoneNumbersCheck = {
  method: 'POST',
  path: '/business-phone-numbers-check',
  handler: (request, h) => {
    const businessTelephone = request.state.tempBusinessTelephone
    const businessMobile = request.state.tempBusinessMobile

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('businessTelephone', businessTelephone)
      .state('businessMobile', businessMobile)
      .unstate('originalBusinessTelephone')
      .unstate('originalBusinessMobile')
      .unstate('tempBusinessTelephone')
      .unstate('tempBusinessMobile')
  }
}

export const businessPhoneNumbersCheckRoutes = [
  getBusinessPhoneNumbersCheck,
  postBusinessPhoneNumbersCheck
]

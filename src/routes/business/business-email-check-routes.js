const getBusinessEmailCheck = {
  method: 'GET',
  path: '/business-email-check',
  handler: (request, h) => {
    const businessEmail = request.state.businessEmail || ''

    return h.view('business/business-email-check', {
      businessEmail
    })
  }
}

const postBusinessEmailCheck = {
  method: 'POST',
  path: '/business-email-check',
  handler: (request, h) => {
    const businessEmail = request.state.businessEmail

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('successField', 'BUSINESS_EMAIL_ADDRESS')
      .state('businessEmail', businessEmail)
      .unstate('originalBusinessEmail')
  }
}

export const businessEmailCheckRoutes = [
  getBusinessEmailCheck,
  postBusinessEmailCheck
]

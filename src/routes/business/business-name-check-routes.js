const getBusinessNameCheck = {
  method: 'GET',
  path: '/business-name-check',
  handler: async (request, h) => {
    const pageData = await businessNameCheckService(request.state)

    return h.view('business/business-name-check', pageData)
  }
}

const postBusinessNameCheck = {
  method: 'POST',
  path: '/business-name-check',
  handler: (request, h) => {
    const businessName = request.state.businessName

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('successField', 'BUSINESS_NAME')
      .state('businessName', businessName)
      .unstate('originalBusinessName')
  }
}

export const businessNameCheckRoutes = [
  getBusinessNameCheck,
  postBusinessNameCheck
]

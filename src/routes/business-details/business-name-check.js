export const getBusinessNameCheck = {
  method: 'GET',
  path: '/business-name-check',
  handler: (request, h) => {
    const businessName = request.state.businessName || ''

    return h.view('business-details/business-name-check', {
      businessName
    })
  }
}

export const postBusinessNameCheck = {
  method: 'POST',
  path: '/business-name-check',
  handler: (request, h) => {
    const businessName = request.state.businessName

    // TO DO: Save the new business name to the database
    // TO DO: based on the response route user or show

    return h.redirect('/business-details')
      .state('showSuccessBanner', 'true')
      .state('businessName', businessName)
      .unstate('originalBusinessName')
  }
}

export const businessNameCheckRoutes = [
  getBusinessNameCheck,
  postBusinessNameCheck
]

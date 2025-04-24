export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: (request, h) => {
    const {
      showSuccessBanner: showSuccessBannerRaw,
      businessName: businessNameRaw,
      originalBusinessName,
      address1 = '10 Skirbeck Way',
      address2 = '',
      addressCity = 'Maidstone',
      addressCounty = '',
      addressPostcode = 'SK22 1DL',
      addressCountry = 'United Kingdom',
      businessTelephone = '',
      businessMobile = ''
    } = request.state

    const showSuccessBanner = showSuccessBannerRaw === 'true'
    const businessName = originalBusinessName && !showSuccessBanner ? originalBusinessName : businessNameRaw || 'Agile Farm Ltd'

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
      formattedAddress,
      businessTelephone,
      businessMobile
    })
      .unstate('showSuccessBanner')
      .unstate('originalBusinessName')
      .state('businessName', businessName)
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

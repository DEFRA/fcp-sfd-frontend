import { resolveField } from '../../utils/resolve-field.js'

export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: (request, h) => {
    const {
      showSuccessBanner: showSuccessBannerRaw,
      businessName: businessNameRaw,
      originalBusinessName,
      address1: address1Raw,
      originalAddress1,
      address2: address2Raw,
      originalAddress2,
      addressCity: addressCityRaw,
      originalAddressCity,
      addressCounty: addressCountyRaw,
      originalAddressCounty,
      addressPostcode: addressPostcodeRaw,
      originalAddressPostcode,
      addressCountry: addressCountryRaw,
      originalAddressCountry,
      businessTelephone: businessTelephoneRaw,
      originalBusinessTelephone,
      businessMobile: businessMobileRaw,
      originalBusinessMobile
    } = request.state

    const showSuccessBanner = showSuccessBannerRaw === 'true'

    const fields = [
      { name: 'businessName', raw: businessNameRaw, original: originalBusinessName, fallback: 'Agile Farm Ltd' },
      { name: 'businessTelephone', raw: businessTelephoneRaw, original: originalBusinessTelephone },
      { name: 'businessMobile', raw: businessMobileRaw, original: originalBusinessMobile },
      { name: 'address1', raw: address1Raw, original: originalAddress1, fallback: '10 Skirbeck Way' },
      { name: 'address2', raw: address2Raw, original: originalAddress2, fallback: '' },
      { name: 'addressCity', raw: addressCityRaw, original: originalAddressCity, fallback: 'Maidstone' },
      { name: 'addressCounty', raw: addressCountyRaw, original: originalAddressCounty, fallback: '' },
      { name: 'addressPostcode', raw: addressPostcodeRaw, original: originalAddressPostcode, fallback: 'SK22 1DL' },
      { name: 'addressCountry', raw: addressCountryRaw, original: originalAddressCountry, fallback: 'United Kingdom' }
    ]

    const resolvedFields = fields.reduce((acc, { name, raw, original, fallback }) => {
      acc[name] = resolveField({
        current: raw || original,
        original,
        fallback,
        showSuccess: showSuccessBanner
      })
      return acc
    }, {})

    const formattedAddress = [
      resolvedFields.address1,
      resolvedFields.address2,
      resolvedFields.addressCity,
      resolvedFields.addressCounty,
      resolvedFields.addressPostcode,
      resolvedFields.addressCountry
    ].filter(Boolean).join('<br>')

    return h.view('business-details/business-details', {
      showSuccessBanner,
      businessName: resolvedFields.businessName,
      formattedAddress,
      businessTelephone: resolvedFields.businessTelephone,
      businessMobile: resolvedFields.businessMobile
    })
      .unstate('showSuccessBanner')
      .unstate('originalBusinessName')
      .unstate('originalBusinessTelephone')
      .unstate('originalBusinessMobile')
      .unstate('originalAddress1')
      .unstate('originalAddress2')
      .unstate('originalAddressCity')
      .unstate('originalAddressCounty')
      .unstate('originalAddressPostcode')
      .unstate('originalAddressCountry')
      .state('businessName', resolvedFields.businessName)
      .state('businessTelephone', resolvedFields.businessTelephone)
      .state('businessMobile', resolvedFields.businessMobile)
      .state('address1', resolvedFields.address1)
      .state('address2', resolvedFields.address2)
      .state('addressCity', resolvedFields.addressCity)
      .state('addressCounty', resolvedFields.addressCounty)
      .state('addressPostcode', resolvedFields.addressPostcode)
      .state('addressCountry', resolvedFields.addressCountry)
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

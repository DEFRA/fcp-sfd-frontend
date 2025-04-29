// import { resolveField } from '../../utils/resolve-field.js'

// export const getBusinessDetails = {
//   method: 'GET',
//   path: '/business-details',
//   handler: (request, h) => {
//     const {
//       showSuccessBanner: showSuccessBannerRaw,
//       businessName: businessNameRaw,
//       originalBusinessName,
//       address1: address1Raw,
//       originalAddress1,
//       address2: address2Raw,
//       originalAddress2,
//       addressCity: addressCityRaw,
//       originalAddressCity,
//       addressCounty: addressCountyRaw,
//       originalAddressCounty,
//       addressPostcode: addressPostcodeRaw,
//       originalAddressPostcode,
//       addressCountry: addressCountryRaw,
//       originalAddressCountry,
//       businessTelephone: businessTelephoneRaw,
//       originalBusinessTelephone,
//       businessMobile: businessMobileRaw,
//       originalBusinessMobile
//     } = request.state

//     const showSuccessBanner = showSuccessBannerRaw === 'true'

//     const fields = [
//       { name: 'businessName', raw: businessNameRaw, original: originalBusinessName, fallback: 'Agile Farm Ltd' },
//       { name: 'businessTelephone', raw: businessTelephoneRaw, original: originalBusinessTelephone },
//       { name: 'businessMobile', raw: businessMobileRaw, original: originalBusinessMobile },
//       { name: 'address1', raw: address1Raw, original: originalAddress1, fallback: '10 Skirbeck Way' },
//       { name: 'address2', raw: address2Raw, original: originalAddress2, fallback: '' },
//       { name: 'addressCity', raw: addressCityRaw, original: originalAddressCity, fallback: 'Maidstone' },
//       { name: 'addressCounty', raw: addressCountyRaw, original: originalAddressCounty, fallback: '' },
//       { name: 'addressPostcode', raw: addressPostcodeRaw, original: originalAddressPostcode, fallback: 'SK22 1DL' },
//       { name: 'addressCountry', raw: addressCountryRaw, original: originalAddressCountry, fallback: 'United Kingdom' }
//     ]

//     const resolvedFields = fields.reduce((acc, { name, raw, original, fallback }) => {
//       acc[name] = resolveField({
//         current: raw || original,
//         original,
//         fallback,
//         showSuccess: showSuccessBanner
//       })
//       return acc
//     }, {})

//     const formattedAddress = [
//       resolvedFields.address1,
//       resolvedFields.address2,
//       resolvedFields.addressCity,
//       resolvedFields.addressCounty,
//       resolvedFields.addressPostcode,
//       resolvedFields.addressCountry
//     ].filter(Boolean).join('<br>')

//     return h.view('business-details/business-details', {
//       showSuccessBanner,
//       businessName: resolvedFields.businessName,
//       formattedAddress,
//       businessTelephone: resolvedFields.businessTelephone,
//       businessMobile: resolvedFields.businessMobile
//     })
//       .unstate('showSuccessBanner')
//       .unstate('originalBusinessName')
//       .unstate('originalBusinessTelephone')
//       .unstate('originalBusinessMobile')
//       .unstate('originalAddress1')
//       .unstate('originalAddress2')
//       .unstate('originalAddressCity')
//       .unstate('originalAddressCounty')
//       .unstate('originalAddressPostcode')
//       .unstate('originalAddressCountry')
//       .state('businessName', resolvedFields.businessName)
//       .state('businessTelephone', resolvedFields.businessTelephone)
//       .state('businessMobile', resolvedFields.businessMobile)
//       .state('address1', resolvedFields.address1)
//       .state('address2', resolvedFields.address2)
//       .state('addressCity', resolvedFields.addressCity)
//       .state('addressCounty', resolvedFields.addressCounty)
//       .state('addressPostcode', resolvedFields.addressPostcode)
//       .state('addressCountry', resolvedFields.addressCountry)
//   }
// }

// export const businessDetailsRoutesView = [
//   getBusinessDetails
// ]
import { resolveField } from '../../utils/resolve-field.js'

// Helper function to handle field resolution and fallback logic
const resolveFields = (state, showSuccessBanner) => {
  const fields = [
    { name: 'businessName', raw: state.businessName, original: state.originalBusinessName, fallback: 'Agile Farm Ltd' },
    { name: 'businessTelephone', raw: state.businessTelephone, original: state.originalBusinessTelephone },
    { name: 'businessMobile', raw: state.businessMobile, original: state.originalBusinessMobile },
    { name: 'address1', raw: state.address1, original: state.originalAddress1, fallback: '10 Skirbeck Way' },
    { name: 'address2', raw: state.address2, original: state.originalAddress2, fallback: '' },
    { name: 'addressCity', raw: state.addressCity, original: state.originalAddressCity, fallback: 'Maidstone' },
    { name: 'addressCounty', raw: state.addressCounty, original: state.originalAddressCounty, fallback: '' },
    { name: 'addressPostcode', raw: state.addressPostcode, original: state.originalAddressPostcode, fallback: 'SK22 1DL' },
    { name: 'addressCountry', raw: state.addressCountry, original: state.originalAddressCountry, fallback: 'United Kingdom' }
  ]

  return fields.reduce((acc, { name, raw, original, fallback }) => {
    acc[name] = resolveField({
      current: raw || original,
      original,
      fallback,
      showSuccess: showSuccessBanner
    })
    return acc
  }, {})
}

const getFormattedAddress = (resolvedFields) => {
  return [
    resolvedFields.address1,
    resolvedFields.address2,
    resolvedFields.addressCity,
    resolvedFields.addressCounty,
    resolvedFields.addressPostcode,
    resolvedFields.addressCountry
  ].filter(Boolean).join('<br>')
}

const manageState = (response, resolvedFields) => {
  const stateChanges = [
    { key: 'showSuccessBanner' },
    { key: 'originalBusinessName' },
    { key: 'originalBusinessTelephone' },
    { key: 'originalBusinessMobile' },
    { key: 'originalAddress1' },
    { key: 'originalAddress2' },
    { key: 'originalAddressCity' },
    { key: 'originalAddressCounty' },
    { key: 'originalAddressPostcode' },
    { key: 'originalAddressCountry' }
  ]

  stateChanges.forEach(({ key }) => response.unstate(key))

  const stateUpdates = [
    'businessName',
    'businessTelephone',
    'businessMobile',
    'address1',
    'address2',
    'addressCity',
    'addressCounty',
    'addressPostcode',
    'addressCountry'
  ]

  stateUpdates.forEach(key => response.state(key, resolvedFields[key]))
}

export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: (request, h) => {
    const { showSuccessBanner: showSuccessBannerRaw, ...state } = request.state
    const showSuccessBanner = showSuccessBannerRaw === 'true'

    const resolvedFields = resolveFields(state, showSuccessBanner)
    const formattedAddress = getFormattedAddress(resolvedFields)

    const response = h.view('business-details/business-details', {
      showSuccessBanner,
      businessName: resolvedFields.businessName,
      formattedAddress,
      businessTelephone: resolvedFields.businessTelephone,
      businessMobile: resolvedFields.businessMobile
    })

    manageState(response, resolvedFields)

    return response
  }
}

export const businessDetailsRoutesView = [
  getBusinessDetails
]

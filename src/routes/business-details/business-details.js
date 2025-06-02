import { resolveField } from '../../utils/resolve-field.js'
import { successMessages } from '../../constants/success-messages.js'

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
    { name: 'addressCountry', raw: state.addressCountry, original: state.originalAddressCountry, fallback: 'United Kingdom' },
    { name: 'businessEmail', raw: state.businessEmail, original: state.originalBusinessEmail, fallback: 'name@example.com' }
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
    { key: 'successField' },
    { key: 'originalBusinessName' },
    { key: 'originalBusinessTelephone' },
    { key: 'originalBusinessMobile' },
    { key: 'originalAddress1' },
    { key: 'originalAddress2' },
    { key: 'originalAddressCity' },
    { key: 'originalAddressCounty' },
    { key: 'originalAddressPostcode' },
    { key: 'originalAddressCountry' },
    { key: 'originalBusinessEmail' }
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
    'addressCountry',
    'businessEmail'
  ]

  stateUpdates.forEach(key => response.state(key, resolvedFields[key]))
}

export const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: async (request, h) => {
    const { showSuccessBanner: showSuccessBannerRaw, successField, ...state } = request.state
    const showSuccessBanner = showSuccessBannerRaw === 'true'
    const successMessage = successMessages?.[successField] || null

    const resolvedFields = resolveFields(state, showSuccessBanner)
    const formattedAddress = getFormattedAddress(resolvedFields)

    const response = h.view('business-details/business-details', {
      showSuccessBanner,
      successMessage,
      businessName: resolvedFields.businessName,
      formattedAddress,
      businessTelephone: resolvedFields.businessTelephone,
      businessMobile: resolvedFields.businessMobile,
      businessEmail: resolvedFields.businessEmail
    })

    manageState(response, resolvedFields)

    const tempData =
      request.state.tempBusinessTelephone !== undefined ||
      request.state.tempBusinessMobile !== undefined

    if (tempData && !showSuccessBanner) {
      response.unstate('tempBusinessTelephone')
      response.unstate('tempBusinessMobile')
    }

    return response
  }
}

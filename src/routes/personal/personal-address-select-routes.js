import { utils, constants, schemas } from '@defra/fcp-sfd-frontend-engine'

import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { personalAddressSelectPresenter } from '../../presenters/personal/personal-address-select-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { PERSONAL_JOURNEY } from '../../constants/journeys.js'
import { checkSessionDataGuard } from '../pre-handlers.js'

const getPersonalAddressSelect = {
  method: 'GET',
  path: '/account-address-select',
  options: {
    pre: [checkSessionDataGuard(PERSONAL_JOURNEY, ['changePersonalPostcode', 'changePersonalAddresses'])]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, ['changePersonalPostcode', 'changePersonalAddresses', 'changePersonalAddress'])

    const pageData = personalAddressSelectPresenter(personalDetails)

    return h.view('personal/personal-address-select', pageData)
  }
}

const postPersonalAddressSelect = {
  method: 'POST',
  path: '/account-address-select',
  options: {
    validate: {
      payload: schemas.osPlaces.addresses,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth } = request

        const errors = utils.formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, ['changePersonalPostcode', 'changePersonalAddresses'])
        const pageData = personalAddressSelectPresenter(personalDetails)

        return h.view('personal/personal-address-select', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const personalDetails = await fetchPersonalChangeService(request.yar, request.auth.credentials, 'changePersonalAddresses')

      const selectedAddress = personalDetails.changePersonalAddresses.find((address) => {
        // Concatenate UPRN and displayAddress to create a unique identifier.
        // Multiple addresses can share the same UPRN (e.g., multiple units in a building),
        // so UPRN alone is not unique. Using both properties ensures each address is truly distinct.
        return `${address.uprn}${address.displayAddress}` === request.payload.addresses
      })

      if (!selectedAddress) {
        return h.redirect('/account-address-select').takeover()
      }

      selectedAddress.postcodeLookup = true

      setSessionData(request.yar, 'personalDetailsUpdate', 'changePersonalAddress', selectedAddress)

      return h.redirect('/account-address-check')
    }
  }
}

export const personalAddressSelectRoutes = [
  getPersonalAddressSelect,
  postPersonalAddressSelect
]

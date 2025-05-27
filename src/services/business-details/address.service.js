/**
 * Orchestrates fetching and presenting the data for `/business-details/address` page
 * @module AddressService
 */

import { AddressPresenter } from '../../presenters/business-details/address.presenter.js'
import { FetchAddressService } from './fetch-address.service.js'

async function go (request) {
  const addressData = await FetchAddressService.go(request)
  const pageData = AddressPresenter.go(addressData)

  return {
    ...pageData
  }
}

export const AddressService = {
  go
}

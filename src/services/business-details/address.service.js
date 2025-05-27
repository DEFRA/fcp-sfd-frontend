/**
 * Orchestrates fetching and presenting the data for `/business-details/address` page
 * @module AddressService
 */

import { AddressPresenter } from '../../presenters/business-details/address.presenter.js'

async function go (request, h) {
  // const data = await FetchAddressService.go(request)
  const pageData = AddressPresenter.go(request)

  return {
    ...pageData
  }
}

export const AddressService = {
  go
}

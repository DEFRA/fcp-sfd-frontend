/**
 * Formats data ready for presenting in the `/business-address-select-change` page
 * @module businessAddressSelectChangePresenter
 */

const businessAddressSelectChangePresenter = (data) => {
  return {
    backLink: { href: '/business-address-change' },
    pageTitle: 'Choose your business address',
    metaDescription: 'Choose the address for your business.',
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null,
    postcode: data.changeBusinessPostcode.businessPostcode,
    displayAddresses: displayAddresses(data.changeBusinessAddresses)
  }
}

function displayAddresses(addresses) {
  const displayAddresses = addresses.map(address => ({
    value: address.uprn + address.displayAddress,
    text: address.displayAddress,
    selected: false
  }))

  displayAddresses.unshift({
    value: 'display',
    text: `${addresses.length} addresses found`,
    selected: true
  })

  return displayAddresses
}

export {
  businessAddressSelectChangePresenter
}
